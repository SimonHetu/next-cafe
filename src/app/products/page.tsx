import { ProductCard } from "@/src/components/ui/product-card"
import { ProductHero } from "@/src/components/ui/animations/product-hero"
import { Product } from "@/src/generated/prisma/client"
import {  getFakeProduct } from "@/src/lib/utils"
import { FadeInWithScroll } from "@/src/components/ui/animations/fade-in-with-scroll"
import ProductFilter from "@/src/components/ui/product-filter"

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductPage({ searchParams }: PageProps) {
  const orderBy = searchParams.sort ?? 'best-sellers'
  const roastLevel = searchParams.roast ?? ''
  const origin = searchParams.origin ?? ''

  const products: Product[] = getFakeProduct(21)
  const origins: string[] = ["Spain", "Brazil", "Italy"]

  return (
    <>
      <ProductHero />
      <ProductFilter origins={origins} />
      <div>
        <FadeInWithScroll className="grid grid-cols-1 place-items-center gap-4 md:grid-cols-2 lg:grid-cols-3 mt-5">
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
    </>
  )
}
