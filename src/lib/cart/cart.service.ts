import prisma from "../prisma";
import type { Product } from "@/src/generated/prisma/client";
import type { Decimal } from "@prisma/client/runtime/client";

export type CartItemWithProduct = {
  id: string;
  orderId: string | null;
  cartId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: Decimal;
  product: Product;
};

export type CartWithItems = {
  id: string;
  userId: string | null;
  items: CartItemWithProduct[];
};

export async function getOrCreateCart(userId: string): Promise<CartWithItems | null> {
  if (!userId) return null;
  return prisma.cart.upsert({
    where: { userId: userId },
    update: {},
    create: {
      userId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  }) as Promise<CartWithItems>;
}

export async function addToCart(
  userId: string,
  productId: string,
  quantityToAdd: number
) {
  const cart = await getOrCreateCart(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }
  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } })

      if (!product || !product.isActive || product.stockQuantity < quantityToAdd) {
        throw new Error("Product is not available")
      }

      await tx.item.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id, productId: product.id
          }
        },
        update: {
          quantity: {
            increment: quantityToAdd
          }
        },
        create: {
          cartId: cart.id,
          productId: product.id,
          productName: product.name,
          quantity: quantityToAdd,
          unitPrice: product.price
        }
      })
    })
  } catch (e) {
    throw e
  }
}


export async function removeCartItem(
  userId: string,
  itemId: string
) {
  const cart = await getOrCreateCart(userId)
  if (!cart) {
    throw new Error("Cart not found");
  }
  await prisma.item.deleteMany({
    where: { AND: { cartId: cart.id, id: itemId } }
  })
}

export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
) {
  const cart = await getOrCreateCart(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }
  await prisma.item.updateMany({
    where: { AND: { cartId: cart.id, id: itemId } },
    data: { quantity },
  });
}

export async function clearCart(userId: string) {
  await prisma.cart.delete({
    where: { userId: userId }
  })
}

export const CartService = {
  getOrCreateCart,
  addToCart,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
};
