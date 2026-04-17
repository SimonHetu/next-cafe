import ProductDetails3D from "@/src/components/ui/animations/product-details-3d";
import getFakeFlavorNotes, { getFakeProduct } from "@/src/lib/utils";
import { FlavorNote, Product } from "@/src/generated/prisma/client";

export default async function ProductDetail({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  const product: Product = getFakeProduct(1)[0];
  const flavorNotes: FlavorNote[] = getFakeFlavorNotes(3);

  return (
    <div>
      <ProductDetails3D
        id={product.id}
        description={product.description}
        name={product.name}
        origin={product.origin ?? ""}
        price={product.price.toNumber()}
        roastLevel={product.roastLevel}
        flavorNotes={flavorNotes}
      />
    </div>
  )
}

