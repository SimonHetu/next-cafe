"use client";

import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { AdminOrderCard } from "@/src/components/admin/admin-order-card";
import { OrderStatus, PaymentStatus } from "@/src/generated/prisma/enums";

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

interface Order {
  id: string;
  userId: string | null;
  user: OrderUser | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  items: OrderItem[];
  taxAmount: number | null;
  createdAt: Date;
}

interface AdminOrdersSectionProps {
  orders: Order[];
}

export function AdminOrdersSection({ orders }: AdminOrdersSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "ALL">(
    "ALL"
  );

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.lastName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "ALL" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="border border-base-content/10 rounded-lg overflow-y-auto max-h-[800px] relative">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-base-100 border-b border-base-content/10 p-4">
        <div className="space-y-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-base-200 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Search order ID, email, or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-base-content/70 block mb-1">
                Order Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as OrderStatus | "ALL")
                }
                className="select select-xs select-bordered w-full"
              >
                <option value="ALL">All Statuses</option>
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
                value={paymentFilter}
                onChange={(e) =>
                  setPaymentFilter(e.target.value as PaymentStatus | "ALL")
                }
                className="select select-xs select-bordered w-full"
              >
                <option value="ALL">All Payments</option>
                <option value="UNPAID">Unpaid</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3 p-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
            <p className="text-base-content/70 text-sm">
              {searchQuery || statusFilter !== "ALL" || paymentFilter !== "ALL"
                ? "No orders found matching your filters."
                : "No orders yet."}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <AdminOrderCard
              key={order.id}
              id={order.id}
              userId={order.userId}
              user={order.user}
              status={order.status}
              paymentStatus={order.paymentStatus}
              items={order.items}
              taxAmount={order.taxAmount}
              createdAt={order.createdAt}
            />
          ))
        )}
      </div>
    </div>
  );
}
