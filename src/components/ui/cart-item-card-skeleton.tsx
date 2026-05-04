"use client";

export function CartItemCardSkeleton() {
  return (
    <div className="w-full border border-base-content/10 bg-base-100 p-4 flex items-center gap-6">
      <div className="skeleton h-32 w-32 shrink-0" />

      <div className="flex-1 min-w-0 space-y-4">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="skeleton h-9 w-9 rounded-md" />
        <div className="skeleton h-6 w-10" />
        <div className="skeleton h-9 w-9 rounded-md" />
        <div className="skeleton h-6 w-32" />
      </div>
    </div>
  );
}
