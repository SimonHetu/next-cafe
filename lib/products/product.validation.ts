import { CreateProductInput } from "@/lib/products/product.types";

export function validateCreateProductInput(data: CreateProductInput) {
    if (!data.name.trim()) throw new Error("Name is required");
    if (!data.slug.trim()) throw new Error("Slug is required");
    if (!data.description.trim()) throw new Error("Description is required");
    if (!data.detailDescription.trim()) throw new Error("Detail description is required");
    if (!data.imageUrl.trim()) throw new Error("Image URL is required");
    if (data.price < 0) throw new Error("Price must be greater than or equal to 0");
    if ((data.stockQuantity ?? 0) < 0) throw new Error("Stock must be greater than or equal to 0");
    if (!data.origin.trim()) throw new Error("Origin is required");
}