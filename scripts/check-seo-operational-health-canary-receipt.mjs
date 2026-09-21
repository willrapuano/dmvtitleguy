import { readFile } from "node:fs/promises";
import { verifyConfiguredCanaryReceipt } from "./lib/seo-health-canary-receipt.mjs";

const config = JSON.parse(await readFile(
  new URL("../config/seo-operational-health.json", import.meta.url),
  "utf8",
));

const result = await verifyConfiguredCanaryReceipt(config);
console.log(JSON.stringify(result));
