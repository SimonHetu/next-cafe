import { describe, expect, it } from "vitest";
import {
  AddToCartSchema,
  ClearCartSchema,
  RemoveCartItemSchema,
  UpdateCartItemQuantitySchema,
} from "./cart.schema";

const clerkId = "user_2abcdefghijklmnopqrst";
const cuid = "cjld2cjxh0000qzrmn831i7rn";
const itemCuid = "cjld2cjxh0000qzrmn831i7ro";

describe("AddToCartSchema", () => {
  it("parses typical form payloads", () => {
    const r = AddToCartSchema.safeParse({
      userId: clerkId,
      productId: cuid,
      quantity: "2",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.quantity).toBe(2);
  });

  it("defaults quantity when missing or blank", () => {
    const missing = AddToCartSchema.safeParse({
      userId: clerkId,
      productId: cuid,
    });
    expect(missing.success).toBe(true);
    if (missing.success) expect(missing.data.quantity).toBe(1);

    const blank = AddToCartSchema.safeParse({
      userId: clerkId,
      productId: cuid,
      quantity: "",
    });
    expect(blank.success).toBe(true);
    if (blank.success) expect(blank.data.quantity).toBe(1);
  });

  it("rejects invalid user or product id", () => {
    expect(
      AddToCartSchema.safeParse({
        userId: "admin",
        productId: cuid,
        quantity: 1,
      }).success
    ).toBe(false);
    expect(
      AddToCartSchema.safeParse({
        userId: clerkId,
        productId: "bad",
        quantity: 1,
      }).success
    ).toBe(false);
  });
});

describe("RemoveCartItemSchema", () => {
  it("requires Clerk user id and item cuid", () => {
    const ok = RemoveCartItemSchema.safeParse({
      userId: clerkId,
      itemId: itemCuid,
    });
    expect(ok.success).toBe(true);
  });

  it("rejects invalid item id", () => {
    expect(
      RemoveCartItemSchema.safeParse({
        userId: clerkId,
        itemId: "x",
      }).success
    ).toBe(false);
  });
});

describe("UpdateCartItemQuantitySchema", () => {
  it("requires positive bounded quantity", () => {
    const ok = UpdateCartItemQuantitySchema.safeParse({
      userId: clerkId,
      itemId: itemCuid,
      quantity: "500",
    });
    expect(ok.success).toBe(true);
    if (ok.success) expect(ok.data.quantity).toBe(500);
  });

  it("rejects quantity 0", () => {
    expect(
      UpdateCartItemQuantitySchema.safeParse({
        userId: clerkId,
        itemId: itemCuid,
        quantity: 0,
      }).success
    ).toBe(false);
  });
});

describe("ClearCartSchema", () => {
  it("accepts Clerk user id", () => {
    expect(ClearCartSchema.safeParse({ userId: clerkId }).success).toBe(true);
  });
});
