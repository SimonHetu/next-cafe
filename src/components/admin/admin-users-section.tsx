"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { AdminUserCard } from "@/src/components/admin/admin-user-card";
import { UserRole } from "@/src/generated/prisma/enums";

interface UserOrder {
  id: string;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  orders: UserOrder[];
  createdAt: Date;
}

interface AdminUsersSectionProps {
  users: User[];
}

export function AdminUsersSection({ users }: AdminUsersSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>

          {/* Filter */}
          <div>
            <label className="text-xs text-base-content/70 block mb-1">
              User Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as UserRole | "ALL")}
              className="select select-xs select-bordered w-full"
            >
              <option value="ALL">All Users</option>
              <option value="CUSTOMER">Customers</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3 p-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
            <p className="text-base-content/70 text-sm">
              {searchQuery || roleFilter !== "ALL"
                ? "No users found matching your filters."
                : "No users yet."}
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <AdminUserCard
              key={user.id}
              id={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              email={user.email}
              role={user.role}
              orders={user.orders}
              createdAt={user.createdAt}
            />
          ))
        )}
      </div>
    </div>
  );
}
