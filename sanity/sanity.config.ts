import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemas";

export default defineConfig({
  name: "dmvtitleguy",
  title: "DMV Title Guy — Blog CMS",
  projectId: "4s0dloxi",
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
  api: {
    // Ensure proper API version for embedded studio
    version: "2024-01-01",
  },
});
