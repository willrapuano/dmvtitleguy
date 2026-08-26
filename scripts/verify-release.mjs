import { spawn } from "node:child_process";

const port = process.env.VERIFY_PORT || "3217";
const origin = `http://127.0.0.1:${port}`;

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      ...options,
      env: { ...process.env, ...options.env },
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed (${code ?? signal})`));
    });
  });
}

async function waitForServer(server) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next server exited with ${server.exitCode}`);
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Timed out waiting for the release verification server");
}

const staticChecks = [
  ["npm", ["run", "lint"]],
  ["npm", ["run", "typecheck"]],
  ["npm", ["run", "verify:canonical-domain"]],
  ["npm", ["run", "verify:blog-normalizer"]],
  ["npm", ["run", "verify:blog-publication"]],
  ["npm", ["run", "verify:dependency-overrides"]],
  ["npm", ["run", "build"]],
];

for (const [command, args] of staticChecks) await run(command, args);

const server = spawn("npm", ["run", "start", "--", "-p", port], { stdio: "inherit", env: process.env });
try {
  await waitForServer(server);
  const runtimeChecks = [
    "verify:lead-security",
    "verify:migration",
    "verify:sitemap-completeness",
    "verify:blog-rendering",
    "verify:social-metadata",
    "verify:brand-identity",
    "verify:competitive-content",
    "verify:optimized-plan",
  ];
  for (const script of runtimeChecks) {
    await run("npm", ["run", script], { env: { TARGET_ORIGIN: origin } });
  }
} finally {
  if (server.exitCode === null) server.kill("SIGTERM");
}

console.log("Release verification passed: build and all required runtime SEO gates are green");
