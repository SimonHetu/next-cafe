import { expect, type Page, test } from "@playwright/test";

const testCards = [
  { name: "successful payment", number: "4242424242424242", outcome: "success" },
  { name: "declined payment", number: "4000000000000002", outcome: "declined" },
  { name: "3D Secure payment", number: "4000002500003155", outcome: "threeDSecure" },
];

async function fillStripeField(
  page: Page,
  pattern: RegExp,
  value: string
) {
  await expect
    .poll(
      async () => {
        const pageField = page.getByPlaceholder(pattern).first();

        if (await pageField.isVisible().catch(() => false)) {
          await pageField.fill(value);
          return true;
        }

        for (const frame of page.frames()) {
          const frameField = frame.getByPlaceholder(pattern).first();

          if (await frameField.isVisible().catch(() => false)) {
            await frameField.fill(value);
            return true;
          }
        }

        return false;
      },
      { timeout: 20_000 }
    )
    .toBe(true);
}

test("guest cart exposes the Stripe checkout action", async ({ page }) => {
  await page.goto("/products", { waitUntil: "domcontentloaded" });
  await page.locator(".max-w-85").first().locator("button").last().click();
  await page.goto("/cart", { waitUntil: "domcontentloaded" });

  const checkout = page.getByRole("button", { name: "Pay with Stripe" });
  await expect(checkout).toBeVisible();
  await expect(checkout).toBeEnabled();
});

for (const card of testCards) {
  test(`Stripe test card flow: ${card.name}`, async ({ page }) => {
    test.skip(
      process.env.E2E_STRIPE_FULL_FLOW !== "1",
      "Set E2E_STRIPE_FULL_FLOW=1 to run the real Stripe Checkout card simulations."
    );

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.clear());
    await page.goto("/products", { waitUntil: "domcontentloaded" });
    await page.locator(".max-w-85").first().locator("button").last().click();
    await page.goto("/cart", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: "Your Cart" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Pay with Stripe" })).toBeVisible();
    await page.getByRole("button", { name: "Pay with Stripe" }).click();

    await page.waitForURL(/checkout\.stripe\.com/, { timeout: 30_000 });
    await page.getByLabel(/email/i).fill(`e2e-${Date.now()}@example.com`);
    await page
      .getByRole("button", { name: /pay with card/i })
      .evaluate((button) => (button as HTMLButtonElement).click());
    await fillStripeField(page, /1234 1234 1234 1234|card number/i, card.number);
    await fillStripeField(page, /MM \/ YY|MM\/YY|expiration/i, "12 / 34");
    await fillStripeField(page, /CVC|security code/i, "123");
    await page.getByPlaceholder(/full name on card/i).fill("E2E Test");
    await page.getByTestId("hosted-payment-submit-button").click();

    if (card.outcome === "success") {
      await expect(page).toHaveURL(/\/checkout\/success/, { timeout: 45_000 });
      await expect(page.getByText(/error|failed/i)).toHaveCount(0);
      return;
    }

    if (card.outcome === "declined") {
      await expect(page.getByText(/declined|card was declined/i)).toBeVisible({
        timeout: 30_000,
      });
      await expect(page).toHaveURL(/checkout\.stripe\.com/);
      return;
    }

    await expect
      .poll(
        async () => {
          for (const frame of page.frames()) {
            const button = frame
              .getByRole("button", { name: /complete|authorize|submit|continue/i })
              .first();

            if (await button.isVisible().catch(() => false)) {
              return true;
            }
          }

          return false;
        },
        { timeout: 30_000 }
      )
      .toBe(true);
  });
}
