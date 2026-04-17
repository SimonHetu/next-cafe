import Gallery from "@/src/components/landing/gallery";
import HashedTitle from "@/src/components/landing/hashed-title";
import { FadeInWithScroll } from "@/src/components/ui/animations/fade-in-with-scroll";
import { ProductCard } from "@/src/components/ui/product-card";
import { Product } from "@/src/generated/prisma/client";
import { getProducts } from "@/src/lib/products/product.service";

export default async function Home() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await getProducts("", "", "best-seller");
  } catch (err) {
    console.error("Failed to fetch products:", err);
    error = "Failed to load products. Please try again later.";
  }

  // Limit to 3 products for the home page
  const displayProducts = products.slice(0, 3);

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

  return (
    <>
      <Gallery />
      <div className="text-center px-10 py-20">
        <HashedTitle />
        <div>
          <FadeInWithScroll>
            <h1 className="text-4xl mb-10 italic font-bold">Our Best Sellers</h1>
          </FadeInWithScroll>
          <FadeInWithScroll className="grid grid-cols-1 mb-12 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
            {displayProducts.map((p: Product) => (
              <ProductCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                imageUrl={p.imageUrl ?? ""}
                price={p.price}
                roastLevel={p.roastLevel}
                stockQuantity={p.stockQuantity}
                origin={p.origin}
                description={p.description}
              />
            ))}
          </FadeInWithScroll>
        </div>
      </div>
    </>
  );
}
