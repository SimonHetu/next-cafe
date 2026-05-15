import { expect, test } from "@playwright/test";

test("home and products pages are reachable", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("link", { name: /ls coffee/i })).toBeVisible();
  await expect(page.getByText(/error|failed to load/i)).toHaveCount(0);

  await page.getByRole("link", { name: /ls coffee/i }).click();

  await expect(page).toHaveURL(/\/products/);
  await expect(page.getByText(/Product catalog/i)).toBeVisible();
  await expect(page.getByText(/error|failed to load/i)).toHaveCount(0);
});
