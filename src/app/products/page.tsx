import { ProductCard } from "@/src/components/ui/product-card"
import { ProductHero } from "@/src/components/ui/animations/product-hero"
import { Product } from "@/src/generated/prisma/client"
import { FadeInWithScroll } from "@/src/components/ui/animations/fade-in-with-scroll"
import ProductFilter from "@/src/components/ui/product-filter"
import { getProducts } from "@/src/lib/products/product.service"
import { currentUser } from "@clerk/nextjs/server"
import { Coffee } from "lucide-react"

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ProductPage({ searchParams }: PageProps) {
  const p = await searchParams
  const orderBy = p.sort ?? 'best-sellers'
  const roastLevel = p.roast ?? ''
  const origin = p.origin ?? ''
  const clerkUser = await currentUser()
  const userId = clerkUser?.id
  console.log(userId)

  let products: Product[] = []
  let error: string | null = null

  try {
    products = await getProducts(origin as string ?? '', roastLevel as string ?? '', orderBy as string ?? 'newest')
  } catch (err) {
    console.error('Failed to fetch products:', err)
    error = 'Failed to load products. Please try again later.'
  }

  const origins: string[] = ["Spain", "Brazil", "Italy"]

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Error</h2>
          <p className="text-base-content/70">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ProductHero />
      <ProductFilter origins={origins} />
      <div>
        {products.length === 0 ? (
          <div className="min-h-100 flex items-center justify-center">
            <div className="text-center">
              <Coffee className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
              <h2 className="text-2xl font-bold text-base-content mb-2">No products found</h2>
              <p className="text-base-content/70 max-w-md mx-auto">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
            </div>
          </div>
        ) : (
          <FadeInWithScroll className="grid grid-cols-1 place-items-center gap-6 md:grid-cols-2 lg:grid-cols-3 mt-5 px-4 md:px-6 max-w-7xl mx-auto">
            {products.map((p) =>
              <ProductCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                imageUrl={p.imageUrl ?? ""}
                price={p.price.toNumber()}
                roastLevel={p.roastLevel}
                stockQuantity={p.stockQuantity}
                origin={p.origin}
                description={p.description}
                userId={userId}
              />)
            }
          </FadeInWithScroll>
        )}
      </div>
    </>
  )
}
