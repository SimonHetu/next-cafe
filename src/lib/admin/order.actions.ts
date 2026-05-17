"use server";

import { revalidatePath } from "next/cache";
import {
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from "@/src/lib/admin/order.service";
import { OrderStatus, PaymentStatus } from "@/src/generated/prisma/enums";

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
) {
  try {
    await updateOrderStatus(orderId, status);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update order status",
    };
  }
}

export async function updatePaymentStatusAction(
  orderId: string,
  paymentStatus: PaymentStatus
) {
  try {
    await updatePaymentStatus(orderId, paymentStatus);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update payment status",
    };
  }
}

export async function deleteOrderAction(orderId: string) {
  try {
    await deleteOrder(orderId);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete order",
    };
  }
}
