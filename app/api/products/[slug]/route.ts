import { NextResponse } from "next/server";
import { ProductService } from "@/lib/products/product.service";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Props) {
  try {
    const { slug } = await params;

    const product = await ProductService.getProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}