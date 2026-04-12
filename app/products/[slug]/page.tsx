export default async function ProductDetail({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  return (
    <div>
      <p>Details for {slug}</p>
    </div>
  )
}

