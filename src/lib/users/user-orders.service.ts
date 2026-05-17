"use server";

import  prisma  from "@/src/lib/prisma";
import  logger  from "@/src/lib/logger";

export async function getUserOrders(userId: string) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId,
        status: {
          not: "CART",
        },
      },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            unitPrice: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format decimal values to numbers
    return orders.map((order) => ({
      ...order,
      taxAmount: order.taxAmount?.toNumber() ?? null,
      items: order.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toNumber(),
      })),
    }));
  } catch (error) {
    logger.error("user_orders_service.get_orders_failed", {
      userId,
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    throw error;
  }
}
