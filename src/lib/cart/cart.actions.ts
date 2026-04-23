"use server";

import { revalidatePath } from "next/cache";
import { CartService } from "@/src/lib/cart/cart.service";
import {
  AddToCartSchema,
  UpdateCartItemQuantitySchema,
  RemoveCartItemSchema,
  ClearCartSchema,
} from "@/src/lib/cart/cart.schema";
import type { ActionState } from "@/src/lib/type";


export async function addToCartAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = AddToCartSchema.safeParse({
      userId: formData.get("userId"),
      productId: formData.get("productId"),
      quantity: formData.get("quantity"),
    });

    if (!parsed.success) {
      const state: ActionState = {
        success: false,
        message: "Invalid form data.",
        error: parsed.error,
      };
      return state
    }

    const { userId, productId, quantity } = parsed.data;

    await CartService.addToCart(userId, productId, quantity);

    revalidatePath("/cart");

    return {
      success: true,
      message: "Product added to cart.",
    };
  } catch (error) {
    const state: ActionState = {
      success: false,
      message: "Failed to add product to cart.",
      error: error instanceof Error ? error : undefined,
    };
    return state
  }
}

export async function removeCartItemAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const parsed = RemoveCartItemSchema.safeParse({
      userId: formData.get("userId"),
      itemId: formData.get("itemId"),
    });

    if (!parsed.success) {
      const state: ActionState = {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid form data.",
        error: parsed.error
      };
      return state
    }

    const { userId, itemId } = parsed.data;

    await CartService.removeCartItem(userId, itemId);
    revalidatePath("/cart");

    return {
      success: true,
      message: "Cart item removed.",
    };
  } catch (error) {
    const state: ActionState = {
      success: false,
      message: "Failed to remove product.",
      error: error instanceof Error ? error : undefined,
    };
    return state
  }
}

export async function clearCartAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = ClearCartSchema.safeParse({
      userId: formData.get("userId")
    })

    if (!parsed.success) {
      const state: ActionState = {
        success: false,
        message: parsed.error.issues[0]?.message ?? "Invalid form data.",
        error: parsed.error
      };
      return state
    }


    await CartService.clearCart(parsed.data.userId);
    revalidatePath("/cart");

    return {
      success: true,
      message: "Cart cleared.",
    };
  } catch (error) {
    const state: ActionState = {
      success: false,
      message: "Failed to clear cart.",
      error: error instanceof Error ? error : undefined,
    };
    return state

  }
}
