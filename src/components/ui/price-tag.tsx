export function PriceTag({ price }: { price: number }) {
  return (
    <span className="text-4xl font-bold tracking-tight">
      ${price.toFixed(2)}
    </span>
  )
}
