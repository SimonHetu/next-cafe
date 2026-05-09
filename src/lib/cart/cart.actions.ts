"use server";

import { revalidatePath } from "next/cache";
import logger from "@/src/lib/logger";
import { CartService } from "@/src/lib/cart/cart.service";
import {
  AddToCartSchema,
  UpdateCartItemQuantitySchema,
  RemoveCartItemSchema,
  ClearCartSchema,
} from "@/src/lib/cart/cart.schema";
import { currentUser } from "@clerk/nextjs/server";

export type CartActionState = { message: string } | null;

export async function addToCartAction(
  _prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const parsed = AddToCartSchema.safeParse({
    userId: formData.get("userId"),
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    return { message: "Invalid form data." };
  }

  try {
    const { userId, productId, quantity } = parsed.data;
    await CartService.addToCart(userId, productId, quantity);
    revalidatePath("/cart");
    return null;
  } catch (error) {
    logger.error("cart_action.add_to_cart_failed", {
      action: "addToCartAction",
      userId: parsed.data.userId,
      productId: parsed.data.productId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      message:
        error instanceof Error ? error.message : "Failed to add product to cart.",
    };
  }
}

export async function removeCartItemAction(
  _prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const parsed = RemoveCartItemSchema.safeParse({
    userId: formData.get("userId"),
    itemId: formData.get("itemId"),
  });

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  try {
    const { userId, itemId } = parsed.data;
    await CartService.removeCartItem(userId, itemId);
    revalidatePath("/cart");
    return null;
  } catch (error) {
    logger.error("cart_action.remove_item_failed", {
      action: "removeCartItemAction",
      userId: parsed.data.userId,
      itemId: parsed.data.itemId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      message:
        error instanceof Error ? error.message : "Failed to remove product.",
    };
  }
}

export async function updateCartItemQuantityAction(
  _prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const parsed = UpdateCartItemQuantitySchema.safeParse({
    userId: formData.get("userId"),
    itemId: formData.get("itemId"),
    quantity: formData.get("quantity"),
  });

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  try {
    const { userId, itemId, quantity } = parsed.data;
    await CartService.updateCartItemQuantity(userId, itemId, quantity);
    revalidatePath("/cart");
    return null;
  } catch (error) {
    logger.error("cart_action.update_quantity_failed", {
      action: "updateCartItemQuantityAction",
      userId: parsed.data.userId,
      itemId: parsed.data.itemId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      message:
        error instanceof Error ? error.message : "Failed to update quantity.",
    };
  }
}

export async function clearCartAction(
  _prevState: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const parsed = ClearCartSchema.safeParse({
    userId: formData.get("userId"),
  });

  if (!parsed.success) {
    return {
      message: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }

  try {
    await CartService.clearCart(parsed.data.userId);
    revalidatePath("/cart");
    return null;
  } catch (error) {
    logger.error("cart_action.clear_failed", {
      action: "clearCartAction",
      userId: parsed.data.userId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      message:
        error instanceof Error ? error.message : "Failed to clear cart.",
    };
  }
}

export async function getCartCountAction(): Promise<number> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return 0;
    const cart = await CartService.getOrCreateCart(clerkUser.id);
    return (
      cart?.items.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      ) ?? 0
    );
  } catch (error) {
    logger.warn("cart_action.get_cart_count_failed", {
      action: "getCartCountAction",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return 0;
  }
}
