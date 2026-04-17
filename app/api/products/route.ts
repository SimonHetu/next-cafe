import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/products/product.service";

export async function GET() {
    try {
        const products = await ProductService.getProducts();

        return NextResponse.json(products);
    } catch {
        return NextResponse.json(
            { message: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const product = await ProductService.createProduct(body);

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: error instanceof Error
                        ? error.message
                        : "Failed to create product",
            },
            { status: 400 }
        );
    }
}