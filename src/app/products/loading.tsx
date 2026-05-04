import ProductCardSkeleton from "@/src/components/ui/product-card-skeleton";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen px-4 py-12 max-w-7xl mx-auto">
      <div className="mb-8 space-y-3">
        <div className="skeleton h-10 w-48" />
        <div className="skeleton h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center px-4 md:px-6">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
