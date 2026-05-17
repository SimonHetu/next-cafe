import { describe, expect, it } from "vitest";
import {
  LIMITS,
  cartQuantitySchema,
  clerkUserIdSchema,
  moneyAmountSchema,
  productIdSchema,
  productSlugSchema,
  stockQuantitySchema,
} from "./limits";

describe("moneyAmountSchema", () => {
  it("accepts valid money strings and numbers within range", () => {
    expect(moneyAmountSchema.safeParse("0").success).toBe(true);
    expect(moneyAmountSchema.safeParse("12.99").success).toBe(true);
    expect(moneyAmountSchema.safeParse(12.5).success).toBe(true);
    expect(moneyAmountSchema.safeParse(LIMITS.PRICE_MAX).success).toBe(true);
  });

  it("rejects more than two decimal places", () => {
    expect(moneyAmountSchema.safeParse("10.001").success).toBe(false);
    expect(moneyAmountSchema.safeParse(10.555).success).toBe(false);
  });

  it("rejects negative and non-finite values", () => {
    expect(moneyAmountSchema.safeParse("-1").success).toBe(false);
    expect(moneyAmountSchema.safeParse(Number.POSITIVE_INFINITY).success).toBe(
      false
    );
  });

  it("rejects values above PRICE_MAX", () => {
    expect(
      moneyAmountSchema.safeParse(LIMITS.PRICE_MAX + 0.01).success
    ).toBe(false);
  });
});

describe("productSlugSchema", () => {
  it("accepts URL-style slugs and lowercases input", () => {
    const r = productSlugSchema.safeParse("Ethiopian-Yirga");
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe("ethiopian-yirga");
    expect(productSlugSchema.safeParse("python-press").success).toBe(true);
  });

  it("rejects invalid slug characters or shapes", () => {
    expect(productSlugSchema.safeParse("bad_slug").success).toBe(false);
    expect(productSlugSchema.safeParse("double--hyphen").success).toBe(false);
    expect(productSlugSchema.safeParse("").success).toBe(false);
  });

  it("rejects when over max length", () => {
    const long = "a".repeat(LIMITS.PRODUCT_SLUG_MAX + 1);
    expect(productSlugSchema.safeParse(long).success).toBe(false);
  });
});

describe("clerkUserIdSchema", () => {
  it("accepts Clerk-shaped user ids", () => {
    expect(clerkUserIdSchema.safeParse("user_2abcXYZ").success).toBe(true);
    expect(clerkUserIdSchema.safeParse("  user_0123456789  ").success).toBe(
      true
    );
  });

  it("rejects ids that do not match pattern or length", () => {
    expect(clerkUserIdSchema.safeParse("user_").success).toBe(false);
    expect(clerkUserIdSchema.safeParse("notuser_x").success).toBe(false);
  });
});

describe("productIdSchema", () => {
  it("accepts a valid cuid", () => {
    expect(
      productIdSchema.safeParse("cjld2cjxh0000qzrmn831i7rn").success
    ).toBe(true);
  });

  it("rejects non-cuids", () => {
    expect(productIdSchema.safeParse("not-a-cuid").success).toBe(false);
    expect(productIdSchema.safeParse("").success).toBe(false);
  });
});

describe("stockQuantitySchema", () => {
  it("accepts integers in range", () => {
    expect(stockQuantitySchema.safeParse("0").success).toBe(true);
    expect(stockQuantitySchema.safeParse(LIMITS.STOCK_MAX).success).toBe(true);
  });

  it("rejects negative, non-int, or over max", () => {
    expect(stockQuantitySchema.safeParse("-1").success).toBe(false);
    expect(stockQuantitySchema.safeParse("1.5").success).toBe(false);
    expect(
      stockQuantitySchema.safeParse(LIMITS.STOCK_MAX + 1).success
    ).toBe(false);
  });
});

describe("cartQuantitySchema", () => {
  it("accepts integers from 1 to CART_QTY_MAX", () => {
    expect(cartQuantitySchema.safeParse("1").success).toBe(true);
    expect(cartQuantitySchema.safeParse(LIMITS.CART_QTY_MAX).success).toBe(
      true
    );
  });

  it("rejects below 1 or above max", () => {
    expect(cartQuantitySchema.safeParse("0").success).toBe(false);
    expect(
      cartQuantitySchema.safeParse(LIMITS.CART_QTY_MAX + 1).success
    ).toBe(false);
  });
});
