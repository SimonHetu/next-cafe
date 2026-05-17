"use client";

import { OrderStatus, PaymentStatus } from "@/src/generated/prisma/enums";
import { ProfileOrderCard } from "@/src/components/profile/profile-order-card";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  taxAmount: number | null;
  createdAt: Date;
}

interface ProfileOrdersSectionProps {
  orders: Order[];
  userName: string;
}

export function ProfileOrdersSection({ orders, userName }: ProfileOrdersSectionProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-base-content/50 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">No Orders Yet</h3>
        <p className="text-base-content/70">
          Your order history will appear here once you place your first order.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => (
        <ProfileOrderCard
          key={order.id}
          id={order.id}
          status={order.status}
          paymentStatus={order.paymentStatus}
          items={order.items}
          taxAmount={order.taxAmount}
          createdAt={order.createdAt}
        />
      ))}
    </div>
  );
}
