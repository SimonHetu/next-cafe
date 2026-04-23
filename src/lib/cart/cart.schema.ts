import { z } from "zod";

export const AddToCartSchema = z.object({
  userId: z.string().trim().uuid(),
  productId: z.string().trim().min(1, "Product ID is required."),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.").optional().default(1),
});

export const RemoveCartItemSchema = z.object({
  userId: z.string().trim().uuid(),
  itemId: z.string().trim().uuid("Item ID is required."),
});

export const ClearCartSchema = z.object({
  userId: z.string().trim().uuid(),
});

