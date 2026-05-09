import { z } from "zod";
import {
  cartQuantitySchema,
  clerkUserIdSchema,
  productIdSchema,
} from "@/src/lib/validation/limits";

export const AddToCartSchema = z.object({
  userId: clerkUserIdSchema,
  productId: productIdSchema,
  quantity: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    cartQuantitySchema.optional().default(1)
  ),
});

export const RemoveCartItemSchema = z.object({
  userId: clerkUserIdSchema,
  itemId: z.string().trim().cuid("Item ID is invalid."),
});

export const UpdateCartItemQuantitySchema = z.object({
  userId: clerkUserIdSchema,
  itemId: z.string().trim().cuid("Item ID is invalid."),
  quantity: cartQuantitySchema,
});

export const ClearCartSchema = z.object({
  userId: clerkUserIdSchema,
});
