"use client";

import { OrderStatus, PaymentStatus } from "@/src/generated/prisma/enums";
import { ShoppingBag, Package, CreditCard } from "lucide-react";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface ProfileOrderCardProps {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  taxAmount: number | null;
  createdAt: Date;
}

const statusColors = {
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

const statusIcons = {
  PENDING: Package,
  CONFIRMED: Package,
  SHIPPED: Package,
  DELIVERED: Package,
  CANCELLED: Package,
};

export function ProfileOrderCard({
  id,
  status,
  paymentStatus,
  items,
  taxAmount,
  createdAt,
}: ProfileOrderCardProps) {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const finalTotal = taxAmount ? totalAmount + taxAmount : totalAmount;

  return (
    <div className="w-full border border-base-content/10 bg-base-100 transition-all duration-300 hover:border-base-content/25 hover:shadow-md hover:shadow-primary/5 p-4 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-base-content/50" />
            <p className="font-mono text-sm text-base-content/70">Order {id.slice(0, 8)}</p>
          </div>
          <p className="text-xs text-base-content/50">
            {new Date(createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary">${finalTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-1">
          <Package className="w-3 h-3" />
          <span
            className={`badge badge-sm ${
              statusColors[status as keyof typeof statusColors] || "badge-gray"
            }`}
          >
            {status}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <CreditCard className="w-3 h-3" />
          <span
            className={`badge badge-sm ${
              paymentStatusColors[paymentStatus as keyof typeof paymentStatusColors]
            }`}
          >
            {paymentStatus}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="text-sm mb-3 p-3 bg-base-200 rounded max-h-40 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-xs mb-2">
            <span>{item.productName}</span>
            <div className="text-right">
              <span className="text-base-content/60">x{item.quantity}</span>
              <span className="ml-3 font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
        {taxAmount && taxAmount > 0 && (
          <div className="flex justify-between text-xs border-t border-base-content/10 pt-2 mt-2">
            <span>Tax</span>
            <span className="font-semibold">${taxAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Pricing Summary */}
      <div className="flex justify-between items-center text-sm pt-3 border-t border-base-content/10">
        <span className="text-base-content/70">Subtotal</span>
        <span>${totalAmount.toFixed(2)}</span>
      </div>
      {taxAmount && taxAmount > 0 && (
        <div className="flex justify-between items-center text-sm py-1">
          <span className="text-base-content/70">Tax</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between items-center text-sm font-bold pt-1">
        <span>Total</span>
        <span className="text-primary">${finalTotal.toFixed(2)}</span>
      </div>
    </div>
  );
}
