import { z } from "zod";

export const AddToCartSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required."),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1."),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemQuantitySchema = z.object({
  itemId: z.string().trim().min(1, "Item ID is required."),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1."),
});

export type UpdateCartItemQuantityInput =
  z.infer<typeof UpdateCartItemQuantitySchema>;

export const RemoveCartItemSchema = z.object({
  itemId: z.string().trim().min(1, "Item ID is required."),
});

export type RemoveCartItemInput = z.infer<typeof RemoveCartItemSchema>;