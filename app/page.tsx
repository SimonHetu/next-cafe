import Gallery from "./components/landing/gallery";
import HashedTitle from "./components/landing/hashed-title";
import { FadeInWithScroll } from "./components/ui/animations/fade-in-with-scroll";
import { ProductCard } from "./components/ui/product-card";
import { Product } from "./generated/prisma/client";
import { getFakeProduct } from "./lib/utils";
export default function Home() {

  const products: Product[] = getFakeProduct(3)

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
            {products.map((p: Product) =>
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
              />)
            }
          </FadeInWithScroll>
        </div>
      </div>
    </>
  );
}
