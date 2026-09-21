import { seoOperationalHealthConfig } from "@/lib/seo-operational-health-config";
import {
  createSeoHealthDeploymentAttestation,
  isAuthorizedAttestationRequest,
} from "@/lib/seo-health-deployment-attestation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 10;

const HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
};

export async function GET(request: Request) {
  if (!isAuthorizedAttestationRequest(
    request.headers.get("authorization"),
    process.env.SEO_HEALTH_ATTESTATION_SECRET,
  )) {
    return Response.json({ ok: false, error: { code: "UNAUTHORIZED" } }, {
      status: 401,
      headers: HEADERS,
    });
  }
  const attestation = createSeoHealthDeploymentAttestation(
    process.env,
    seoOperationalHealthConfig,
  );
  return Response.json(attestation, {
    status: attestation.healthy ? 200 : 503,
    headers: HEADERS,
  });
}

function methodNotAllowed() {
  return new Response(null, {
    status: 405,
    headers: {
      ...HEADERS,
      Allow: "GET",
    },
  });
}

export async function HEAD() {
  return methodNotAllowed();
}

export async function OPTIONS() {
  return methodNotAllowed();
}
