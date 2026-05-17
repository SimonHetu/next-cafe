"use client";

import { useState } from "react";
import { OrderStatus, PaymentStatus } from "@/src/generated/prisma/enums";
import { Trash2, ShoppingBag, DollarSign } from "lucide-react";
import {
  updateOrderStatusAction,
  updatePaymentStatusAction,
  deleteOrderAction,
} from "@/src/lib/admin/order.actions";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface OrderUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AdminOrderCardProps {
  id: string;
  userId: string | null;
  user: OrderUser | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  taxAmount: number | null;
  createdAt: Date;
}

const statusColors = {
  CART: "badge-gray",
  PENDING: "badge-warning",
  CONFIRMED: "badge-info",
  SHIPPED: "badge-primary",
  DELIVERED: "badge-success",
  CANCELLED: "badge-error",
};

const paymentStatusColors = {
  UNPAID: "badge-error",
  PAID: "badge-success",
  FAILED: "badge-error",
  REFUNDED: "badge-warning",
};

export function AdminOrderCard({
  id,
  userId,
  user,
  status,
  paymentStatus,
  items,
  taxAmount,
  createdAt,
}: AdminOrderCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const finalTotal = taxAmount ? totalAmount + taxAmount : totalAmount;

  async function handleStatusChange(newStatus: OrderStatus) {
    setIsLoading(true);
    const result = await updateOrderStatusAction(id, newStatus);
    setIsLoading(false);

    if (!result.success) {
      alert(result.error || "Failed to update status");
    }
  }

  async function handlePaymentStatusChange(newPaymentStatus: PaymentStatus) {
    setIsLoading(true);
    const result = await updatePaymentStatusAction(id, newPaymentStatus);
    setIsLoading(false);

    if (!result.success) {
      alert(result.error || "Failed to update payment status");
    }
  }

  async function handleDeleteOrder() {
    if (!confirm("Are you sure you want to delete this order?")) {
      return;
    }
    setIsLoading(true);
    const result = await deleteOrderAction(id);
    setIsLoading(false);

    if (!result.success) {
      alert(result.error || "Failed to delete order");
    }
  }

  return (
    <div className="w-full border border-base-content/10 bg-base-100 transition-all duration-500 hover:border-base-content/25 hover:shadow-lg hover:shadow-primary/5 p-4 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-base-content/50" />
            <p className="font-mono text-sm text-base-content/70">Order {id.slice(0, 8)}</p>
          </div>
          {user && (
            <p className="text-sm font-semibold">
              {user.firstName} {user.lastName}
            </p>
          )}
          <p className="text-xs text-base-content/50">{user?.email}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-base-content/50">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="text-sm mb-3 p-2 bg-base-200 rounded max-h-24 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-xs mb-1">
            <span>{item.productName} x{item.quantity}</span>
            <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        {taxAmount && (
          <div className="flex justify-between text-xs border-t border-base-content/10 pt-1">
            <span>Tax</span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-semibold border-t border-base-content/10 pt-1">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Status Controls */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-base-content/70 block mb-1">
            Order Status
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            disabled={isLoading}
            className={`select select-xs select-bordered w-full ${
              statusColors[status as keyof typeof statusColors]
            }`}
          >
            <option value="CART">Cart</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-base-content/70 block mb-1">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) =>
              handlePaymentStatusChange(e.target.value as PaymentStatus)
            }
            disabled={isLoading}
            className={`select select-xs select-bordered w-full ${
              paymentStatusColors[paymentStatus as keyof typeof paymentStatusColors]
            }`}
          >
            <option value="UNPAID">Unpaid</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={handleDeleteOrder}
          disabled={isLoading}
          className="btn btn-xs btn-outline gap-1 hover:btn-error disabled:opacity-50"
          title="Delete order"
        >
          <Trash2 className="w-3 h-3" />
          Delete
        </button>
      </div>
    </div>
  );
}
