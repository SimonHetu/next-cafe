import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/src/lib/products/product.service";
import { apiErrorLog } from "@/src/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const sort = searchParams.get("sort");
    const roast = searchParams.get("roast");
    const origin = searchParams.get("origin");

    const products = await getProducts(origin ?? "", roast ?? "", sort ?? "newest");

    return NextResponse.json(products);
  } catch (err) {
    apiErrorLog("GET /api/products", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
