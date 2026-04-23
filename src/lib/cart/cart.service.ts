import { Cart, Order } from "@/src/generated/prisma/client";
import prisma from "../prisma";
import { Prisma, OrderStatus, PaymentStatus } from "@/src/app/generated/prisma/browser";
const ZERO = new Prisma.Decimal(0);

export async function getOrCreateCart(userId: string): Promise<Cart> {
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
  }
  );
}

export async function addToCart(
  userId: string,
  productId: string,
  quantityToAdd: number
) {
  const cart = await getOrCreateCart(userId);
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
  // Get cart for user
  await prisma.item.deleteMany({
    where: { AND: { cartId: cart.id, id: itemId } }
  })
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
  clearCart,
};
