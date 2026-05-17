import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/src/generated/prisma/enums", () => ({
  RoastLevel: {
    LIGHT: "LIGHT",
    MEDIUM: "MEDIUM",
    DARK: "DARK",
  },
}));

import { RoastLevel } from "@/src/generated/prisma/enums";
import {
  CreateProductSchema,
  DeleteProductSchema,
  UpdateProductSchema,
  UpdateProductStockSchema,
} from "./products.schema";

const baseProduct = {
  name: "House Blend",
  slug: "house-blend",
  description: "Balanced cup with chocolate notes.",
  detailDescription: "Washed process. Roasted for espresso or filter.",
  imageUrl: "/images/products/house-blend.png",
  price: "18.50",
  roastLevel: RoastLevel.MEDIUM,
  origin: "Colombia",
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("CreateProductSchema", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          headers: { get: () => "image/png" },
        } as unknown as Response)
      )
    );
  });

  it("accepts a valid payload with local image path (no fetch)", async () => {
    const r = await CreateProductSchema.safeParseAsync(baseProduct);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.slug).toBe("house-blend");
      expect(r.data.price).toBe(18.5);
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it("rejects when strings exceed limits", async () => {
    const longName = "x".repeat(200);
    const r = await CreateProductSchema.safeParseAsync({
      ...baseProduct,
      name: longName,
    });
    expect(r.success).toBe(false);
  });

  it("rejects invalid price decimals", async () => {
    const r = await CreateProductSchema.safeParseAsync({
      ...baseProduct,
      price: "10.999",
    });
    expect(r.success).toBe(false);
  });
});

describe("CreateProductSchema with remote imageUrl", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          headers: { get: () => "image/jpeg" },
        } as unknown as Response)
      )
    );
  });

  it("calls fetch for https image URLs when format is valid", async () => {
    const r = await CreateProductSchema.safeParseAsync({
      ...baseProduct,
      imageUrl: "https://cdn.example.com/bean.jpg",
    });
    expect(r.success).toBe(true);
    expect(fetch).toHaveBeenCalled();
  });
});

describe("UpdateProductSchema", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          headers: { get: () => "image/png" },
        } as unknown as Response)
      )
    );
  });

  it("extends create fields with a cuid productId", async () => {
    const r = await UpdateProductSchema.safeParseAsync({
      ...baseProduct,
      productId: "cjld2cjxh0000qzrmn831i7rn",
    });
    expect(r.success).toBe(true);
  });

  it("rejects invalid productId", async () => {
    const r = await UpdateProductSchema.safeParseAsync({
      ...baseProduct,
      productId: "not-a-cuid",
    });
    expect(r.success).toBe(false);
  });
});

describe("UpdateProductStockSchema", () => {
  it("accepts product cuid and stock", () => {
    const r = UpdateProductStockSchema.safeParse({
      productId: "cjld2cjxh0000qzrmn831i7rn",
      newStock: "42",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.newStock).toBe(42);
  });

  it("rejects bad product id", () => {
    expect(
      UpdateProductStockSchema.safeParse({
        productId: "x",
        newStock: 0,
      }).success
    ).toBe(false);
  });
});

describe("DeleteProductSchema", () => {
  it("accepts cuid", () => {
    expect(
      DeleteProductSchema.safeParse({
        productId: "cjld2cjxh0000qzrmn831i7rn",
      }).success
    ).toBe(true);
  });
});
