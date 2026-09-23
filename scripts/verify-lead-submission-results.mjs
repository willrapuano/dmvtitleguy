import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";

// Execute real client modules with an isolated React/fetch harness. No server,
// provider credentials, CRM writes, browser profile, or network access is used.
function loadModule(path, require, globals = {}) {
  const source = readFileSync(path, "utf8");
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const exports = {};
  runInNewContext(js, { exports, require, ...globals }, { timeout: 5_000 });
  return exports;
}

const { classifyLeadSubmissionResponse } = loadModule("src/lib/lead-submission-result.ts", () => {
  throw new Error("Response classifier must remain dependency-free");
});
const cases = [
  { name: "acknowledged intake", code: 200, body: { ok: true }, state: "success", conversions: 1 },
  { name: "explicit non-pending intake", code: 200, body: { ok: true, pending: false }, state: "success", conversions: 1 },
  { name: "pending delivery", code: 202, body: { ok: true, pending: true }, state: "pending", conversions: 0 },
  { name: "202 without flag", code: 202, body: { ok: true }, state: "pending", conversions: 0 },
  { name: "pending flag on 200", code: 200, body: { ok: true, pending: true }, state: "pending", conversions: 0 },
  { name: "duplicate acknowledgment", code: 200, body: { ok: true, duplicate: true }, state: "success", conversions: 0 },
  { name: "pending duplicate", code: 202, body: { ok: true, duplicate: true }, state: "pending", conversions: 0 },
  { name: "HTTP failure despite ok body", code: 503, body: { ok: true }, state: "error", conversions: 0 },
  { name: "application failure", code: 200, body: { ok: false }, state: "error", conversions: 0 },
  { name: "missing body", code: 200, body: null, state: "error", conversions: 0 },
  { name: "malformed ok", code: 200, body: { ok: "true" }, state: "error", conversions: 0 },
  { name: "malformed pending", code: 200, body: { ok: true, pending: "true" }, state: "error", conversions: 0 },
  { name: "malformed duplicate", code: 200, body: { ok: true, duplicate: "true" }, state: "error", conversions: 0 },
  { name: "network failure", networkFailure: true, state: "error", conversions: 0 },
  { name: "invalid JSON", code: 200, invalidJson: true, state: "error", conversions: 0 },
];

const forms = [
  ["LeadCaptureForm", "quote"],
  ["AdvertisingPageClient", "advertising"],
  ["SubscribePageClient", "subscribe"],
  ["funnels/TitleReviewForm", "request-title-review"],
  ["funnels/UploadContractForm", "upload-contract"],
  ["funnels/InvestorDueDiligenceForm", "investor-due-diligence"],
];
function find(tree, predicate) {
  if (!tree || typeof tree !== "object") return undefined;
  if (predicate(tree)) return tree;
  const children = tree.props?.children;
  for (const child of (Array.isArray(children) ? children.flat(Infinity) : [children])) {
    const match = find(child, predicate);
    if (match) return match;
  }
}
const jsx = (type, props) => ({ type, props });
const Pending = () => null;
let count = 0;
for (const [file, formType] of forms) {
  for (const test of cases) {
    let stateIndex = 0;
    let refIndex = 0;
    const states = [];
    const refs = [];
    const conversions = [];
    const events = [];
    const requests = [];
    const react = {
      useState(initial) {
        const index = stateIndex++;
        if (!(index in states)) states[index] = initial;
        return [states[index], value => { states[index] = value; }];
      },
      useRef(initial) {
        const index = refIndex++;
        refs[index] ||= { current: initial };
        return refs[index];
      },
      useEffect() {},
    };
    const require = name => {
      if (name === "react") return react;
      if (name === "react/jsx-runtime") return { jsx, jsxs: jsx, Fragment: "fragment" };
      if (name === "lucide-react") return new Proxy({}, { get: (_, key) => String(key) });
      if (name === "next/link") return { default: "a" };
      if (name === "@/components/LeadRoutingNotice") return { LeadRoutingNotice: "routing-notice" };
      if (name === "@/components/LeadSubmissionPending") return { LeadSubmissionPending: Pending };
      if (name === "@/lib/client-lead-attribution") return { getLeadAttribution: () => ({}) };
      if (name === "@/lib/lead-submission-result") return { classifyLeadSubmissionResponse };
      if (name === "@/lib/client-analytics") return {
        trackLeadConversion: (...args) => conversions.push(args),
        trackAnalyticsEvent: (...args) => events.push(args),
      };
      throw new Error("Unmocked import: " + name);
    };
    const componentModule = loadModule("src/components/" + file + ".tsx", require, {
      crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000001" },
      FormData: class { get() { return ""; } },
      fetch: async (url, options) => {
        requests.push({ url, body: JSON.parse(options.body) });
        if (test.networkFailure) throw new Error("fixture network failure");
        return {
          ok: test.code >= 200 && test.code < 300,
          status: test.code,
          json: async () => {
            if (test.invalidJson) throw new Error("fixture invalid JSON");
            return test.body;
          },
        };
      },
    });
    const Component = componentModule[file.split("/").at(-1)];
    const render = () => {
      stateIndex = 0;
      refIndex = 0;
      return Component({});
    };
    const form = find(render(), node => node.type === "form");
    assert.ok(form, file + " missing form");
    await form.props.onSubmit({ preventDefault() {}, currentTarget: {} });
    assert.equal(states[0], test.state, file + ": " + test.name);
    assert.equal(conversions.length, test.conversions, file + ": " + test.name);
    if (conversions.length) assert.equal(conversions[0][0], formType);
    assert.equal(requests.length, 1, "No automatic retries");
    const rendered = render();
    if (test.state === "pending") {
      assert.ok(find(rendered, node => node.type === Pending), file + " missing pending notice");
      assert.equal(find(rendered, node => node.type === "form"), undefined, "Pending must not offer resubmission");
    }
    if (test.state !== "success" || test.conversions === 0) {
      assert.equal(events.filter(([name]) => name === "lead_form_submit_success").length, 0);
    }
    if (test.state === "error") {
      await find(rendered, node => node.type === "form").props.onSubmit({ preventDefault() {}, currentTarget: {} });
      assert.equal(requests[1].body.submissionId, requests[0].body.submissionId, "Retry must retain idempotency key");
    }
    count++;
  }
}

let focused = false;
let effect;
const { LeadSubmissionPending } = loadModule("src/components/LeadSubmissionPending.tsx", name => {
  if (name === "react/jsx-runtime") return { jsx, jsxs: jsx };
  if (name === "react") return {
    useRef: () => ({ current: { focus() { focused = true; } } }),
    useEffect: callback => { effect = callback; },
  };
  throw new Error("Unmocked pending import: " + name);
});
const notice = LeadSubmissionPending();
effect();
assert.equal(focused, true);
assert.equal(notice.props.role, "status");
assert.equal(notice.props["aria-live"], "polite");
assert.equal(notice.props.tabIndex, -1);
assert.ok(find(notice, node => node.type === "a" && node.props.href === "tel:+17038591467"));
assert.equal(find(notice, node => node.type === "form" || node.type === "button"), undefined);
console.log("Lead response regression gate passed: " + count + " real-handler cases, stable retry IDs, pending rendering and focus.");
