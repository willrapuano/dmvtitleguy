const targetOrigin = (process.env.TARGET_ORIGIN || "http://localhost:3000").replace(/\/$/, "");
const endpoint = `${targetOrigin}/api/leads`;
const checks = [];

function record(name, ok, detail) {
  checks.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name} — ${detail}`);
}

async function post(body, headers) {
  return fetch(endpoint, { method: "POST", headers, body: JSON.stringify(body), redirect: "manual" });
}

const harmlessPayload = {
  formType: "quote",
  name: "Security verifier",
  email: "security-verifier@example.invalid",
  website: "bot-check-do-not-deliver",
};

let response = await post(harmlessPayload, { "content-type": "application/json" });
record("missing Origin is rejected", response.status === 403, `HTTP ${response.status}`);

response = await post(harmlessPayload, {
  "content-type": "text/plain",
  origin: targetOrigin,
  referer: `${targetOrigin}/contact`,
});
record("non-JSON content is rejected", response.status === 415, `HTTP ${response.status}`);

response = await post(harmlessPayload, {
  "content-type": "application/jsonp",
  origin: targetOrigin,
  referer: `${targetOrigin}/contact`,
});
record("JSON lookalike media type is rejected", response.status === 415, `HTTP ${response.status}`);

response = await post(harmlessPayload, {
  "content-type": "application/json",
  origin: "https://attacker.example",
  referer: "https://attacker.example/",
});
record("cross-origin request is rejected", response.status === 403, `HTTP ${response.status}`);

response = await post(harmlessPayload, {
  "content-type": "application/json",
  origin: targetOrigin,
  referer: `${targetOrigin}/contact`,
});
const honeypotResult = await response.json().catch(() => ({}));
record("honeypot returns neutral success without delivery", response.status === 200 && honeypotResult.ok === true, `HTTP ${response.status}`);

response = await fetch(`${targetOrigin}/api/funnels/upload-url`, {
  method: "POST",
  headers: { origin: targetOrigin, "content-type": "application/json" },
  body: "{}",
});
record("public funnel document uploads are disabled", response.status === 410, `HTTP ${response.status}`);

if (checks.some((check) => !check.ok)) process.exitCode = 1;
