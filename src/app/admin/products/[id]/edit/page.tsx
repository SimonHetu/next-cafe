import { ProductForm } from "@/src/components/admin/product-form";
import { isAdmin } from "@/src/lib/admin/admin.service";
import { getProductById } from "@/src/lib/products/product.service";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await currentUser();

  if (!user) {
    return <div>You must be logged in to view this page</div>;
  }

  if (!(await isAdmin(user.id))) {
    return <div>You must be an admin to edit a product.</div>;
  }

  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit product</h1>
      <ProductForm
        mode="edit"
        productId={product.id}
        initialValues={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          detailDescription: product.detailDescription,
          imageUrl: product.imageUrl,
          price: product.price.toNumber(),
          roastLevel: product.roastLevel,
          origin: product.origin ?? "",
        }}
      />
    </div>
  );
}
