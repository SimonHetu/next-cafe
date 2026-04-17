export function PriceTag({ price }: { price: number }) {
  return (
    <span className="flex font-black gap-2 text-whei text-5xl">
      $<p >{price.toFixed(2)}</p>
    </span>
  )
}
