"use client";

export function AdminProductCardSkeleton() {
  return (
    <div className="w-full border border-base-content/10 bg-base-100 transition-all duration-500 flex items-stretch gap-4 p-6">
      {/* Image */}
      <div className="relative w-32 h-32 shrink-0 overflow-hidden">
        <div className="skeleton w-full h-full" />
      </div>

      {/* Info produits */}
      <div className="flex-1 min-w-0">
        <div className="skeleton h-6 w-1/3 mb-2" />
        <div className="skeleton h-4 w-1/2 mb-3" />
        <div className="flex items-center gap-2 mt-2">
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-4 w-24" />
        </div>

        {/* Gestion stock */}
        <div className="flex items-center gap-4 mt-4">
          <div className="skeleton h-4 w-28" />
          <div className="skeleton h-8 w-24" />
          <div className="skeleton h-4 w-28" />
        </div>
      </div>

      <div className="flex flex-col items-end justify-between shrink-0">
        <div className="flex gap-2">
          <div className="skeleton h-8 w-10" />
          <div className="skeleton h-8 w-10" />
        </div>

        <div className="skeleton h-8 w-20 mt-2" />
      </div>
    </div>
  );
}
