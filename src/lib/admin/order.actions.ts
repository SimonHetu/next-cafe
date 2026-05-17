"use server";

import { revalidatePath } from "next/cache";
import logger from "@/src/lib/logger";
import {
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} from "@/src/lib/admin/order.service";
import { OrderStatus, PaymentStatus } from "@/src/generated/prisma/enums";
import { toPublicErrorMessage } from "@/src/lib/public-error";

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
) {
  try {
    await updateOrderStatus(orderId, status);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    logger.error("admin_order_action.update_status_failed", {
      orderId,
      status,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: toPublicErrorMessage(error, "Failed to update order status"),
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
    logger.error("admin_order_action.update_payment_status_failed", {
      orderId,
      paymentStatus,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: toPublicErrorMessage(error, "Failed to update payment status"),
    };
  }
}

export async function deleteOrderAction(orderId: string) {
  try {
    await deleteOrder(orderId);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    logger.error("admin_order_action.delete_order_failed", {
      orderId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: toPublicErrorMessage(error, "Failed to delete order"),
    };
  }
}
