import prisma from "../prisma";
import { Prisma, OrderStatus, PaymentStatus } from "@/src/app/generated/prisma/browser";

const ZERO = new Prisma.Decimal(0);

export async function getCartByUserId(userId: string) {
  return prisma.order.findFirst({
    where: {
      userId,
      status: OrderStatus.CART,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrCreateCart(userId: string) {
  const existingCart = await getCartByUserId(userId);

  if (existingCart) {
    return existingCart;
  }

  return prisma.order.create({
    data: {
      userId,
      status: OrderStatus.CART,
      paymentStatus: PaymentStatus.UNPAID,
      subtotal: ZERO,
      shippingCost: ZERO,
      total: ZERO,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function recalculateCartTotals(orderId: string) {
  const items = await prisma.item.findMany({
    where: { orderId },
  });

  const subtotal = items.reduce((sum, item) => {
    return sum.plus(item.unitPrice.mul(item.quantity));
  }, ZERO);

  const shippingCost = ZERO;
  const total = subtotal.plus(shippingCost);

  return prisma.order.update({
    where: { id: orderId },
    data: {
      subtotal,
      shippingCost,
      total,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number = 1
) {
  if (!userId) {
    throw new Error("User is required.");
  }

  if (!productId) {
    throw new Error("Product ID is required.");
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("Quantity must be a positive integer.");
  }

  const cart = await getOrCreateCart(userId);

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  if (!product.isActive) {
    throw new Error("Product is not available.");
  }

  const existingItem = await prisma.item.findUnique({
    where: {
      orderId_productId: {
        orderId: cart.id,
        productId,
      },
    },
  });

  const nextQuantity = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  if (product.stockQuantity < nextQuantity) {
    throw new Error("Not enough stock available.");
  }

  if (existingItem) {
    await prisma.item.update({
      where: { id: existingItem.id },
      data: {
        quantity: nextQuantity,
      },
    });
  } else {
    await prisma.item.create({
      data: {
        orderId: cart.id,
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
      },
    });
  }

  return recalculateCartTotals(cart.id);
}

export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
) {
  if (!userId) {
    throw new Error("User is required.");
  }

  if (!itemId) {
    throw new Error("Item ID is required.");
  }

  if (!Number.isInteger(quantity)) {
    throw new Error("Quantity must be an integer.");
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      order: true,
      product: true,
    },
  });

  if (!item) {
    throw new Error("Cart item not found.");
  }

  if (item.order.userId !== userId || item.order.status !== OrderStatus.CART) {
    throw new Error("Unauthorized cart access.");
  }

  if (quantity <= 0) {
    await prisma.item.delete({
      where: { id: itemId },
    });

    return recalculateCartTotals(item.orderId);
  }

  if (item.product.stockQuantity < quantity) {
    throw new Error("Not enough stock available.");
  }

  await prisma.item.update({
    where: { id: itemId },
    data: {
      quantity,
    },
  });

  return recalculateCartTotals(item.orderId);
}

export async function removeCartItem(
  userId: string,
  itemId: string
) {
  if (!userId) {
    throw new Error("User is required.");
  }

  if (!itemId) {
    throw new Error("Item ID is required.");
  }

  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: {
      order: true,
    },
  });

  if (!item) {
    throw new Error("Cart item not found.");
  }

  if (item.order.userId !== userId || item.order.status !== OrderStatus.CART) {
    throw new Error("Unauthorized cart access.");
  }

  await prisma.item.delete({
    where: { id: itemId },
  });

  return recalculateCartTotals(item.orderId);
}

export async function clearCart(userId: string) {
  if (!userId) {
    throw new Error("User is required.");
  }

  const cart = await prisma.order.findFirst({
    where: {
      userId,
      status: OrderStatus.CART,
    },
  });

  if (!cart) {
    return null;
  }

  await prisma.item.deleteMany({
    where: {
      orderId: cart.id,
    },
  });

  return prisma.order.update({
    where: { id: cart.id },
    data: {
      subtotal: ZERO,
      shippingCost: ZERO,
      total: ZERO,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}

export const CartService = {
  getCartByUserId,
  getOrCreateCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};