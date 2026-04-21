import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/src/lib/products/product.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const sort = searchParams.get('sort');
    const roast = searchParams.get('roast');
    const origin = searchParams.get('origin');

    const products = await getProducts(origin ?? "", roast ?? "", sort ?? "newest");

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
