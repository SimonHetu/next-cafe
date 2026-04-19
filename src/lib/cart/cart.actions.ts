"use server";

import { revalidatePath } from "next/cache";

import { CartService } from "@/src/lib/cart/cart.service";
import {
  AddToCartSchema,
  UpdateCartItemQuantitySchema,
  RemoveCartItemSchema,
} from "@/src/lib/cart/cart.schema";
import type { ActionState } from "@/src/lib/type";

export const initialAddToCartState: ActionState = {
  success: null,
};

async function getCurrentUserId(): Promise<string> {
  throw new Error("Authentication provider not configured.");
}

export async function addToCartAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const userId = await getCurrentUserId();

    const parsed = AddToCartSchema.safeParse({
      productId: formData.get("productId"),
      quantity: formData.get("quantity") ?? "1",
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid form data.",
      };
    }

    const { productId, quantity } = parsed.data;

    await CartService.addToCart(userId, productId, quantity);
    revalidatePath("/cart");

    return {
      success: true,
      message: "Product added to cart.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to add product to cart.",
    };
  }
}

export async function updateCartItemQuantityAction(
  itemId: string,
  quantity: number
): Promise<ActionState> {
  try {
    const userId = await getCurrentUserId();

    const parsed = UpdateCartItemQuantitySchema.safeParse({
      itemId,
      quantity,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid form data.",
      };
    }

    const {
      itemId: validatedItemId,
      quantity: validatedQuantity,
    } = parsed.data;

    await CartService.updateCartItemQuantity(
      userId,
      validatedItemId,
      validatedQuantity
    );
    revalidatePath("/cart");

    return {
      success: true,
      message: "Cart item updated.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update cart item.",
    };
  }
}

export async function removeCartItemAction(
  itemId: string
): Promise<ActionState> {
  try {
    const userId = await getCurrentUserId();

    const parsed = RemoveCartItemSchema.safeParse({
      itemId,
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid form data.",
      };
    }

    await CartService.removeCartItem(userId, parsed.data.itemId);
    revalidatePath("/cart");

    return {
      success: true,
      message: "Cart item removed.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove cart item.",
    };
  }
}

export async function clearCartAction(): Promise<ActionState> {
  try {
    const userId = await getCurrentUserId();

    await CartService.clearCart(userId);
    revalidatePath("/cart");

    return {
      success: true,
      message: "Cart cleared.",
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to clear cart.",
    };
  }
}