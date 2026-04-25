import { z } from "zod";

export const AddToCartSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required."),
  productId: z.string().trim().min(1, "Product ID is required."),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.").optional().default(1),
});

export const RemoveCartItemSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required."),
  itemId: z.string().trim().cuid("Item ID is invalid."),
});

export const UpdateCartItemQuantitySchema = z.object({
  userId: z.string().trim().min(1, "User ID is required."),
  itemId: z.string().trim().cuid("Item ID is invalid."),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1."),
});

export const ClearCartSchema = z.object({
  userId: z.string().trim().min(1, "User ID is required."),
});

