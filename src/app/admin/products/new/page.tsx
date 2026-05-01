import { ProductForm } from "@/src/components/admin/product-form";
import { isAdmin } from "@/src/lib/admin/admin.service";
import { currentUser } from "@clerk/nextjs/server";

export default async function NewProductPage() {
  const user = await currentUser();

  if (!user) {
    return <div>You must be logged in to view this page</div>;
  }

  if (!(await isAdmin(user.id))) {
    return <div>You must be an admin to add new products.</div>;
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Add product</h1>
      <ProductForm mode="create" />
    </div>
  );
}
