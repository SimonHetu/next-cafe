import { expect, test } from "@playwright/test";

test("guest can add, update, and remove a product from the cart", async ({ page }) => {
  await page.goto("/products", { waitUntil: "domcontentloaded" });

  const firstProductCard = page.locator(".max-w-85").first();
  await expect(firstProductCard).toBeVisible();

  const productName = (await firstProductCard.locator("h2").innerText()).trim();
  await firstProductCard.locator("button").last().click();
  await expect(page.getByRole("link", { name: /cart\[1\]/i })).toBeVisible();

  await page.goto("/cart", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();
  await expect(page.getByRole("heading", { name: productName })).toBeVisible();
  await expect(page.getByText(/^Total:/)).toBeVisible();

  const cartItem = page.locator(".border-base-content\\/10", {
    has: page.getByRole("heading", { name: productName }),
  }).first();

  await cartItem.locator("button").nth(1).click();
  await expect(page.getByRole("heading", { name: productName })).toBeVisible();

  await cartItem.locator("button").nth(2).click();
  await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
});
