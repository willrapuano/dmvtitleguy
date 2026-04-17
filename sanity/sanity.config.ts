import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

// Get token from environment - needed for embedded studio
const token = process.env.SANITY_API_TOKEN;

export default defineConfig({
  name: "dmvtitleguy",
  title: "DMV Title Guy — Blog CMS",
  projectId: "4s0dloxi",
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
  api: {
    version: "2024-01-01",
  },
  // Pass token to enable proper authentication in embedded studio
  token: token,
});
