import { isAdmin } from '@/src/lib/admin/admin.service';
import { getProducts } from '@/src/lib/products/product.service';
import { getOrders } from '@/src/lib/admin/order.service';
import { getUsers } from '@/src/lib/admin/user.service';
import { currentUser } from "@clerk/nextjs/server";
import { Coffee, ShoppingBag, Users } from "lucide-react";
import { AdminProductsSection } from '@/src/components/admin/admin-products-section';
import { AdminOrdersSection } from '@/src/components/admin/admin-orders-section';
import { AdminUsersSection } from '@/src/components/admin/admin-users-section';

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

  const orders = await getOrders();
  const users = await getUsers();

  if (formattedProducts.length === 0 && orders.length === 0 && users.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <Coffee className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
            <h2 className="text-2xl font-bold text-base-content mb-2">
              Welcome to the Admin Dashboard
            </h2>
            <p className="text-base-content/70 max-w-md mx-auto">
              Start by adding products or wait for users and orders to appear.
            </p>
          </div>
        </div>
      );
    }
  
  return (
    <div className="min-h-screen px-4 py-12 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Welcome Administrator: {user.firstName}</h1>

      {/* Products Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Coffee className="w-6 h-6" />
          Products Management
        </h2>
        {formattedProducts.length === 0 ? (
          <div className="text-center py-8 text-base-content/70">
            <p>No products added yet.</p>
          </div>
        ) : (
          <AdminProductsSection products={formattedProducts} />
        )}
        <div className="divider" />
      </section>

      {/* Orders Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6" />
          Orders Management
        </h2>
        {orders.length === 0 ? (
          <div className="text-center py-8 text-base-content/70">
            <p>No orders yet.</p>
          </div>
        ) : (
          <AdminOrdersSection orders={orders} />
        )}
        <div className="divider" />
      </section>

      {/* Users Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Users Management
        </h2>
        {users.length === 0 ? (
          <div className="text-center py-8 text-base-content/70">
            <p>No users yet.</p>
          </div>
        ) : (
          <AdminUsersSection users={users} />
        )}
      </section>
    </div>
  );
}