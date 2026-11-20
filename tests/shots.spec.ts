import { test, expect } from "@playwright/test";
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["mobile", 390, 844],
] as const) {
  test(`main routes ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    for (const [route, label] of [
      ["/", "home"],
      ["/pack", "workspace"],
      ["/pack?sample=1", "sample"],
      ["/privacy", "privacy"],
      ["/terms", "terms"],
      ["/missing", "404"],
    ]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: `docs/screenshots/${label}-${name}.png`,
        fullPage: true,
      });
    }
  });
}
test("sample Devpost and ZIP export work", async ({ page }) => {
  await page.goto("/pack?sample=1");
  await page.getByRole("tab", { name: "Devpost" }).click();
  await expect(page.locator("pre")).toContainText("CampusPlate");
  await expect(page.locator("pre")).toContainText("## How we built it");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download pack ZIP" }).click();
  expect((await download).suggestedFilename()).toBe("campusplate-sample.zip");
  await page.screenshot({
    path: "docs/screenshots/devpost-desktop.png",
    fullPage: true,
  });
});
test("public repository to checklist", async ({ page }) => {
  test.skip(!process.env.DATABASE_URL, "Needs provisioned Neon");
  await page.goto("/pack");
  await page
    .getByLabel("Public GitHub repository")
    .fill("https://github.com/expressjs/express");
  await page.getByRole("button", { name: "Build free checklist" }).click();
  await expect(page.getByText("REPOSITORY ANALYZED")).toBeVisible({
    timeout: 70000,
  });
  await expect(page.getByText("Tech", { exact: true })).toBeVisible();
});
test("protected export and foreign-origin mutation denied", async ({
  request,
}) => {
  expect((await request.get("/api/export")).status()).toBe(400);
  expect(
    (
      await request.post("/api/analyze", {
        headers: { origin: "https://attacker.invalid" },
        data: { url: "https://github.com/vercel/next.js" },
      })
    ).status(),
  ).toBe(400);
});
