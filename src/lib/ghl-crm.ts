const GHL_API = "https://services.leadconnectorhq.com";

export const TRANSACTION_INTENT_SOURCES = new Set([
  "quote",
  "request-title-review",
  "upload-contract",
  "investor-due-diligence",
]);

interface GHLContact {
  id: string;
}

interface GHLOpportunity {
  id: string;
  name?: string;
}

interface GHLField {
  id: string;
  name: string;
}

function requiredEnvironment() {
  const token = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  const pipelineId = process.env.GHL_WEBSITE_PIPELINE_ID;
  const submittedStageId = process.env.GHL_WEBSITE_SUBMITTED_STAGE_ID;
  if (!token || !locationId || !pipelineId || !submittedStageId) {
    throw new Error("GHL transaction measurement is not configured");
  }
  return { token, locationId, pipelineId, submittedStageId };
}

async function ghlRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { token } = requiredEnvironment();
  const response = await fetch(`${GHL_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: "v3",
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`GHL API ${path} returned HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

let opportunityFieldsPromise: Promise<Map<string, string>> | undefined;

function opportunityFields(locationId: string) {
  opportunityFieldsPromise ??= ghlRequest<{ customFields: GHLField[] }>(
    `/locations/${locationId}/customFields?model=opportunity`
  ).then(({ customFields }) => new Map(customFields.map((field) => [field.name, field.id])));
  return opportunityFieldsPromise;
}

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function customFieldValues(fields: Map<string, string>, data: Record<string, unknown>) {
  const values: Array<{ id: string; fieldValue: string }> = [];
  const add = (name: string, value: unknown, max = 500) => {
    const id = fields.get(name);
    const fieldValue = clean(value, max);
    if (id && fieldValue) values.push({ id, fieldValue });
  };
  add("SEO Submission ID", data.submissionId, 50);
  add("SEO Submitted At", data.submittedAt, 50);
  add("Web Form Type", data.formType, 80);
  add("First Landing Path", data.firstLandingPage, 500);
  add("Conversion Path", data.serverConversionPage, 500);
  add("Attribution Channel", data.firstChannel, 80);
  add("Jurisdiction", data.jurisdiction, 80);
  add("Transaction Type", data.transactionType, 80);
  add("Contact Role", data.role, 80);
  add("Property Address", data.propertyAddress, 240);
  add("Review Type", data.reviewType, 80);
  add("Urgency", data.urgency, 60);
  add("Closing Timeline", data.closingTimeline, 120);
  add("Buyer Type", data.buyerType, 60);
  add("Acquisition Source", data.acquisitionSource, 80);
  add("Timeframe", data.timeframe, 80);
  add("Closing Date", data.closingDate, 40);
  add("Listing", data.listing, 240);
  if (data.seoQaExcluded === true) add("SEO QA Excluded", "true", 10);
  return values;
}

export function isSeoQaPayload(data: Record<string, unknown>) {
  return clean(data.email, 200).toLowerCase() === "dmvtitleguy-attribution-qa@example.invalid";
}

export async function syncGHLTransactionOpportunity(data: Record<string, unknown>, source: string) {
  if (!TRANSACTION_INTENT_SOURCES.has(source)) return { skipped: true as const };
  const { locationId, pipelineId, submittedStageId } = requiredEnvironment();
  const submissionId = clean(data.submissionId, 50);
  if (!submissionId) throw new Error("GHL opportunity requires a submission ID");

  const contactResult = await ghlRequest<{ contact: GHLContact }>("/contacts/upsert", {
    method: "POST",
    body: JSON.stringify({
      locationId,
      name: clean(data.name, 120),
      email: clean(data.email, 200).toLowerCase(),
      phone: clean(data.phone, 60) || undefined,
      source: `dmvtitleguy-${source}`,
      createNewIfDuplicateAllowed: false,
    }),
  });
  const contactId = contactResult.contact.id;

  const query = new URLSearchParams({
    locationId,
    pipelineId,
    status: "all",
    q: submissionId,
    limit: "20",
  });
  const existing = await ghlRequest<{ opportunities: GHLOpportunity[] }>(
    `/opportunities/search?${query.toString()}`
  );
  const prior = existing.opportunities?.find((opportunity) => opportunity.name?.includes(submissionId));
  if (prior) return { contactId, opportunityId: prior.id, duplicate: true as const };

  const fields = await opportunityFields(locationId);
  const values = customFieldValues(fields, data);
  // This location currently disallows multiple opportunities for one contact
  // in the same pipeline. Preserve one durable CRM card per contact and move it
  // back to Submitted for a new transaction request; the append-only local
  // ledger remains the submission-level system of record.
  const contactQuery = new URLSearchParams({
    locationId,
    pipelineId,
    contactId,
    status: "all",
    order: "updated_desc",
    limit: "20",
  });
  const contactOpportunities = await ghlRequest<{ opportunities: GHLOpportunity[] }>(
    `/opportunities/search?${contactQuery.toString()}`
  );
  const reusable = contactOpportunities.opportunities?.[0];
  if (reusable) {
    const updated = await ghlRequest<{ opportunity: GHLOpportunity }>(`/opportunities/${reusable.id}`, {
      method: "PUT",
      body: JSON.stringify({
        pipelineId,
        pipelineStageId: submittedStageId,
        name: `Website ${source} | ${submissionId}`,
        status: "open",
        customFields: values,
      }),
    });
    return { contactId, opportunityId: updated.opportunity.id, duplicate: false as const, reused: true as const };
  }

  const created = await ghlRequest<{ opportunity: GHLOpportunity }>("/opportunities/", {
    method: "POST",
    body: JSON.stringify({
      pipelineId,
      pipelineStageId: submittedStageId,
      locationId,
      contactId,
      name: `Website ${source} | ${submissionId}`,
      status: "open",
      customFields: values,
    }),
  });
  return { contactId, opportunityId: created.opportunity.id, duplicate: false as const };
}
