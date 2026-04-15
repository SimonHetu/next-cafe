import { ProductCard } from "../components/ui/product-card"
import { ProductHero } from "../components/ui/animations/product-hero"
import { Product } from "../generated/prisma/client"
import { getFakeProduct } from "../lib/utils"
import { FadeInWithScroll } from "../components/ui/animations/fade-in-with-scroll"
import ProductFilter from "../components/ui/product-filter"

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

interface ProductPageData {
  error: string | null
  products: Product[]
  origins: string[]
}

async function getProductPageData(): Promise<ProductPageData> {
  try {
    const products = await Promise.resolve(getFakeProduct(21))
    const origins = ["Spain", "Brazil", "Italy"]

    return {
      error: null,
      products,
      origins,
    }
  } catch {
    return {
      error: "Could not load products. Please try again.",
      products: [],
      origins: [],
    }
  }
}

export default async function ProductPage({ searchParams }: PageProps) {
  const orderBy = searchParams.sort ?? 'best-sellers'
  const roastLevel = searchParams.roast ?? ''
  const origin = searchParams.origin ?? ''

  const { error, products, origins } = await getProductPageData()

  if (error) {
    return (
      <>
        <ProductHero />
        <ProductFilter origins={origins} />
        <div className="alert alert-error mx-auto mt-6 max-w-6xl text-sm">
          {error}
        </div>
      </>
    )
  }

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
