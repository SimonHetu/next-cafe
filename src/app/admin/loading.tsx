import { AdminProductsSectionSkeleton } from "@/src/components/ui/admin-products-skeleton";

export default function AdminLoading() {
  return (
    <div className="min-h-screen px-4 py-12 max-w-6xl mx-auto space-y-8">
      <div>
        <div className="skeleton h-10 w-120 mb-2" />           {/* 'Welcome Administrator titre' */}
      </div>

      <section>
        <div className="skeleton h-8 w-56 mb-6" />           {/* 'Products management' */}
        <AdminProductsSectionSkeleton />            {/* Products management section skeleton */}    
        <div className="divider" />
      </section>
    </div>
  );
}