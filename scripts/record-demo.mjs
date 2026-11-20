import { chromium } from "playwright";
import { mkdirSync, renameSync } from "node:fs";
mkdirSync("docs/recording", { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  recordVideo: { dir: "docs/recording", size: { width: 1440, height: 1000 } },
});
const page = await context.newPage();
await page.goto("http://localhost:4317");
await page.waitForTimeout(7000);
await page.getByRole("link", { name: "Explore a sample", exact: true }).click();
await page.waitForTimeout(8000);
await page.getByRole("tab", { name: "Devpost" }).click();
await page.waitForTimeout(8000);
await page.getByRole("tab", { name: "Demo script" }).click();
await page.waitForTimeout(7000);
await page.getByRole("button", { name: "Download pack ZIP" }).click();
await page.waitForTimeout(5000);
const video = page.video();
await context.close();
renameSync(await video.path(), "docs/recording/walkthrough.webm");
await browser.close();
