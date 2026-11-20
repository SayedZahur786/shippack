import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  testMatch: "*.spec.ts",
  workers: 1,
  timeout: 90000,
  use: {
    baseURL: "http://localhost:4317",
    viewport: { width: 1440, height: 1000 },
  },
  webServer: {
    command: "npm run start -- --port 4317",
    url: "http://localhost:4317",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
