import { CartItemCardSkeleton } from "@/src/components/ui/cart-item-card-skeleton";

export default function CartLoading() {
  return (
    <div className="min-h-screen px-4 py-12 max-w-screen-2xl mx-auto">
      <div className="mb-8">
        <div className="skeleton h-12 w-full max-w-[1100px] mb-3" />
      </div>

      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CartItemCardSkeleton key={i} />
        ))}
      </div>

      <div className="divider" />

      <div className="flex justify-between items-center">
        <div className="skeleton h-12 w-36" />

        <div className="text-right space-y-3">
          <div className="skeleton h-6 w-40 ml-auto" />
          <div className="skeleton h-12 w-44 ml-auto" />
        </div>
      </div>
    </div>
  );
}
