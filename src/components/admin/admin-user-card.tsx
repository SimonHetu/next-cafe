"use client";

import { useState } from "react";
import { UserRole } from "@/src/generated/prisma/enums";
import { Trash2, Mail, Lock, User } from "lucide-react";
import {
  updateUserRoleAction,
  deleteUserAction,
} from "@/src/lib/admin/user.actions";

interface UserOrder {
  id: string;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}

interface AdminUserCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  orders: UserOrder[];
  createdAt: Date;
}

const roleColors = {
  CUSTOMER: "badge-info",
  ADMIN: "badge-warning",
};

export function AdminUserCard({
  id,
  firstName,
  lastName,
  email,
  role,
  orders,
  createdAt,
}: AdminUserCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  async function handleRoleChange(newRole: UserRole) {
    setIsLoading(true);
    const result = await updateUserRoleAction(id, newRole);
    setIsLoading(false);

    if (!result.success) {
      alert(result.error || "Failed to update role");
    }
  }

  async function handleDeleteUser() {
    if (
      !confirm(
        `Are you sure you want to delete ${firstName} ${lastName}? This action cannot be undone.`
      )
    ) {
      return;
    }
    setIsLoading(true);
    const result = await deleteUserAction(id);
    setIsLoading(false);

    if (!result.success) {
      alert(result.error || "Failed to delete user");
    }
  }

  return (
    <>
      <div className="w-full border border-base-content/10 bg-base-100 transition-all duration-500 hover:border-base-content/25 hover:shadow-lg hover:shadow-primary/5 p-4 rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-base-content/50" />
              <p className="text-sm font-semibold">
                {firstName} {lastName}
              </p>
            </div>
            <p className="text-xs text-base-content/70">{email}</p>
            <p className="text-xs text-base-content/50 mt-1">
              Joined {new Date(createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <span
              className={`badge badge-sm ${
                roleColors[role as keyof typeof roleColors]
              }`}
            >
              {role}
            </span>
            <button
              onClick={handleDeleteUser}
              disabled={isLoading}
              className="btn btn-xs btn-outline gap-1 hover:btn-error disabled:opacity-50"
              title="Delete user"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-3 p-2 bg-base-200 rounded text-sm">
          <div className="flex justify-between">
            <span className="text-base-content/70">Total Orders:</span>
            <span className="font-semibold">{orders.length}</span>
          </div>
          {orders.length > 0 && (
            <div className="flex justify-between text-xs mt-1">
              <span className="text-base-content/70">Latest Order:</span>
              <span>{new Date(orders[0].createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Role Control */}
        <div className="mb-3">
          <label className="text-xs text-base-content/70 block mb-1">
            User Role
          </label>
          <select
            value={role}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            disabled={isLoading}
            className={`select select-xs select-bordered w-full ${
              roleColors[role as keyof typeof roleColors]
            }`}
          >
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

      </div>
    </>
  );
}
