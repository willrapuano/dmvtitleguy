import { spawn } from "node:child_process";

const REQUIRED_ENVIRONMENT = [
  "TURSO_DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "GHL_PRIVATE_INTEGRATION_TOKEN",
  "GHL_LOCATION_ID",
  "GHL_WEBSITE_PIPELINE_ID",
];

const missing = REQUIRED_ENVIRONMENT.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(JSON.stringify({
    schemaVersion: 1,
    healthy: false,
    error: { code: "CHECKPOINT_ENV_MISSING", variables: missing },
  }));
  process.exit(1);
}

const childEnvironment = Object.fromEntries(REQUIRED_ENVIRONMENT.map((name) => [name, process.env[name]]));
childEnvironment.TARGET_ORIGIN = "https://dmvtitleguy.io";

const child = spawn(process.execPath, ["scripts/check-seo-operations.mjs"], {
  cwd: process.cwd(),
  env: childEnvironment,
  stdio: "inherit",
});

child.on("error", () => {
  console.error(JSON.stringify({
    schemaVersion: 1,
    healthy: false,
    error: { code: "CHECKPOINT_HEALTH_SPAWN_FAILED" },
  }));
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(JSON.stringify({
      schemaVersion: 1,
      healthy: false,
      error: { code: "CHECKPOINT_HEALTH_SIGNAL" },
    }));
    process.exit(1);
  }
  process.exit(code ?? 1);
});
