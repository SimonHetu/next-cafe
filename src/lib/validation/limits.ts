import { z } from "zod";

export const LIMITS = {
  PRODUCT_NAME_MAX: 160,
  PRODUCT_SLUG_MAX: 128,
  PRODUCT_DESCRIPTION_MAX: 750,
  PRODUCT_DETAIL_MAX: 12_000,
  PRODUCT_ORIGIN_MAX: 120,
  IMAGE_URL_MAX: 2048,
  PRICE_MAX: 99_999_999.99,
  STOCK_MAX: 1_000_000,
  USER_ID_MIN: 3,
  USER_ID_MAX: 128,
  CART_QTY_MAX: 999,
} as const;

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const CLERK_USER_ID_REGEX = /^user_[A-Za-z0-9_]+$/;

export const productSlugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .max(
    LIMITS.PRODUCT_SLUG_MAX,
    `Slug must be at most ${LIMITS.PRODUCT_SLUG_MAX} characters.`
  )
  .transform((s) => s.toLowerCase())
  .refine((s) => SLUG_REGEX.test(s), {
    message: "Slug must use lowercase letters, digits, and hyphens only.",
  });

export const moneyAmountSchema = z.coerce
  .number()
  .finite("Price must be a valid number.")
  .min(0, "Price cannot be negative.")
  .max(LIMITS.PRICE_MAX, `Price cannot exceed ${LIMITS.PRICE_MAX}.`)
  .refine(
    (n) => Math.abs(n - Math.round(n * 100) / 100) < 1e-8,
    "Price must have at most two decimal places."
  );

export const clerkUserIdSchema = z
  .string()
  .trim()
  .min(LIMITS.USER_ID_MIN, "User ID is invalid.")
  .max(LIMITS.USER_ID_MAX, "User ID is invalid.")
  .regex(CLERK_USER_ID_REGEX, "User ID is invalid.");

export const productIdSchema = z.string().cuid("Product ID is invalid.");

export const stockQuantitySchema = z.coerce
  .number()
  .finite("Stock quantity must be a valid number.")
  .int("Stock quantity must be a whole number.")
  .min(0, "Stock quantity cannot be negative.")
  .max(LIMITS.STOCK_MAX, `Stock cannot exceed ${LIMITS.STOCK_MAX}.`);

export const cartQuantitySchema = z.coerce
  .number()
  .finite("Quantity must be a valid number.")
  .int("Quantity must be a whole number.")
  .min(1, "Quantity must be at least 1.")
  .max(LIMITS.CART_QTY_MAX, `Quantity cannot exceed ${LIMITS.CART_QTY_MAX}.`);
