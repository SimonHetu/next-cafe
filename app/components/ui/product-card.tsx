import { Decimal } from "@prisma/client/runtime/client"
import { RoastLevel } from "../../generated/prisma/enums"
import { RoastBadge } from "./roast-badge"
import { LucideShoppingCart } from "lucide-react"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string
  price: Decimal
  roastLevel: RoastLevel
  stockQuantity: number
  origin: string | null
}

export function ProductCard({ id, name, slug, description, imageUrl, price, roastLevel, stockQuantity, origin }: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`}>
      <div className="card bg-base-100 w-96 border-accent border-2 shadow-sm shadow-accent hover:scale-102 transition-transform duration-500">
        <figure>
          <img src={imageUrl}
            alt={`Product ${name} image`} />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <p>{description}</p>
          <RoastBadge roastLevel={roastLevel} />
          <div className="card-actions justify-between">
            <span className="flex font-black gap-2 text-whei text-5xl">
              $<p >{Math.trunc(price.toNumber()).toString()}</p>
            </span>
            <button className="btn btn-accent px-5 py-6"><LucideShoppingCart /></button>
          </div>
        </div>
      </div>
    </Link>
  )
}
