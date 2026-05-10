import { NextResponse } from "next/server";
import { apiErrorLog } from "@/src/lib/logger";
import { getProductBySlug } from "@/src/lib/products/product.service";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Props) {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    apiErrorLog("GET /api/products/[slug]", {
      slug,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
