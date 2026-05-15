import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";

const adminStorageState = process.env.E2E_ADMIN_STORAGE_STATE;
const hasAdminStorageState = Boolean(
  adminStorageState && existsSync(adminStorageState)
);

test.use({
  storageState: hasAdminStorageState ? adminStorageState : undefined,
});

test("admin can create, read, update, and delete a product", async ({ page }) => {
  test.skip(
    !hasAdminStorageState,
    "Set E2E_ADMIN_STORAGE_STATE to a signed-in Clerk admin storage state JSON file."
  );

  const id = Date.now();
  const name = `E2E Coffee ${id}`;
  const updatedName = `${name} Updated`;
  const slug = `e2e-coffee-${id}`;
  const updatedSlug = `${slug}-updated`;

  await page.goto("/admin", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Products management" })).toBeVisible();

  await page.getByRole("link", { name: /Add Product/i }).click();
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Short description").fill("Created by Playwright.");
  await page.getByLabel("Detailed description").fill("CRUD coverage for the deployment assignment.");
  await page.getByLabel("Image URL").fill("/assets/images/products/c-brew.png");
  await page.getByLabel("Price").fill("12.50");
  await page.getByLabel("Roast level").selectOption("MEDIUM");
  await page.getByLabel("Origin").fill("Brazil");
  await page.getByRole("button", { name: "Create product" }).click();

  await page.getByPlaceholder("Search product...").fill(name);
  await expect(page.getByRole("heading", { name })).toBeVisible();

  await page.getByTitle("Edit product").first().click();
  await page.getByLabel("Name").fill(updatedName);
  await page.getByLabel("Slug").fill(updatedSlug);
  await page.getByRole("button", { name: "Update product" }).click();

  await page.getByPlaceholder("Search product...").fill(updatedName);
  await expect(page.getByRole("heading", { name: updatedName })).toBeVisible();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByTitle("Delete product").first().click();
  await expect(page.getByText("No products found matching your search.")).toBeVisible();
});
