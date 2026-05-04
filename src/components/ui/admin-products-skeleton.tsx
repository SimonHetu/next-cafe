import { AdminProductCardSkeleton } from "@/src/components/admin/admin-product-card-skeleton";

export function AdminProductsSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="border border-base-content/10 rounded-lg overflow-y-auto max-h-[700px] relative">
        {/* Skeleton barre de recherche */}
        <div className="sticky top-0 z-40 bg-base-100 border-b border-base-content/10 p-6 flex gap-4 items-center justify-between">
          <div className="flex-1 flex items-center gap-3 bg-base-200 rounded-lg px-4 py-3">
            <div className="skeleton h-5 w-5 mr-3" />
            <div className="skeleton h-5 w-72" />
          </div>
          <div className="skeleton h-10 w-36" />
        </div>

        {/* liste */}
        <div className="space-y-3 p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <AdminProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}