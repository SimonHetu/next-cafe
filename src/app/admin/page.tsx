import { isAdmin } from '@/src/lib/admin/admin.service';
import { getProducts } from '@/src/lib/products/product.service';
import { currentUser } from "@clerk/nextjs/server";
import { Coffee } from "lucide-react";
import { AdminProductsSection } from '@/src/components/admin/admin-products-section';

export default async function AdminPage() {
  const user = await currentUser();
  if (!user) {
    return <div>You must be logged in to view this page</div>
  }
  if (!(await isAdmin(user.id))) {
    return <div>You are not an admin</div>
  }

  const products = await getProducts();
  const formattedProducts = products.map(product => ({
    ...product,
    price: product.price.toNumber()
  }));

  if (formattedProducts.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <Coffee className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
            <h2 className="text-2xl font-bold text-base-content mb-2">
              There is currently no product.
            </h2>
            <p className="text-base-content/70 max-w-md mx-auto mb-6">
              Looks like you haven&apos;t added any coffee yet.
            </p>
          </div>
        </div>
      );
    }
  
  return (
    <div className="min-h-screen px-4 py-12 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Welcome Administrator : {user.firstName}</h1>

      <section>
        <h2 className="text-2xl font-bold mb-6">Products management</h2>

        <AdminProductsSection products={formattedProducts} />

        <div className="divider" />
      </section>
    </div>
  );
}