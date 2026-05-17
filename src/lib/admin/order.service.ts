"use server";

import prisma from "@/src/lib/prisma";
import { OrderStatus, PaymentStatus } from "@/src/generated/prisma/enums";

interface FormattedOrder {
  id: string;
  userId: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: {
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  taxAmount: number | null;
  createdAt: Date;
}

export async function getOrders(): Promise<FormattedOrder[]> {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
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

    // Convert Decimal to number for items and tax
    return orders.map(order => ({
      id: order.id,
      userId: order.userId,
      user: order.user ? {
        id: order.user.id,
        firstName: order.user.firstName,
        lastName: order.user.lastName,
        email: order.user.email,
      } : null,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items.map(item => ({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
      })),
      taxAmount: order.taxAmount ? Number(order.taxAmount) : null,
      createdAt: order.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus },
    });
    return order;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await prisma.order.delete({
      where: { id: orderId },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}
