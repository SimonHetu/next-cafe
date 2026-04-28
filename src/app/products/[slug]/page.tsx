import ProductDetails3D from "@/src/components/ui/animations/product-details-3d";
import { getProductBySlug } from "@/src/lib/products/product.service";
import { currentUser } from "@clerk/nextjs/server"
import type { Product, FlavorNote } from "@/src/generated/prisma/client";

// Extended product type with included flavor notes
type ProductWithFlavorNotes = Product & {
  flavorNotes: { flavorNote: FlavorNote }[];
};

export default async function ProductDetail({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const user = await currentUser()

  let product: ProductWithFlavorNotes | null = null;
  let error: string | null = null;

  try {
    product = await getProductBySlug(slug) as ProductWithFlavorNotes | null;
  } catch (err) {
    console.error('Failed to fetch product:', err);
    error = 'Failed to load product details. Please try again later.';
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Error</h2>
          <p className="text-base-content/70">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral mb-4">Product Not Found</h2>
          <p className="text-base-content/70">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  // Extract flavor notes from the nested structure
  const flavorNotes = product.flavorNotes?.map(pf => pf.flavorNote) || [];

  return (
    <div>
      <ProductDetails3D
        id={product.id}
        description={product.detailDescription}
        name={product.name}
        origin={product.origin ?? ""}
        price={product.price.toNumber()}
        roastLevel={product.roastLevel}
        flavorNotes={flavorNotes}
        userId={user?.id}
      />
    </div>
  );
}

