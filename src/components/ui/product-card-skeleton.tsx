"use client";

export function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-[440px] border border-base-content/10 bg-base-100 transition-all duration-500">
      <div className="relative aspect-4/3 w-full p-8 overflow-hidden">
        <div className="skeleton w-full h-full" />
      </div>

      <div className="p-6">
        <div className="skeleton h-7 w-4/5 mb-4" />
        <div className="skeleton h-4 w-full mb-2" />
        <div className="skeleton h-4 w-4/5 mb-4" />

        <div className="mt-3">
          <div className="skeleton h-6 w-24" />
        </div>

        <div className="mt-2">
          <div className="skeleton h-4 w-28" />
        </div>

        <div className="flex justify-between items-end mt-6">
          <div className="skeleton h-7 w-28" />
          <div className="skeleton h-12 w-12 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default ProductCardSkeleton;
