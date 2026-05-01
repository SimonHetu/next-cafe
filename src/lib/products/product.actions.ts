"use server";

import { revalidatePath } from "next/cache";
import { RoastLevel } from "@/src/generated/prisma/enums";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  updateProductStock,
  toggleProductActive,
} from "@/src/lib/products/product.service";

type ProductFormInput = {
  name: string;
  slug: string;
  description: string;
  detailDescription: string;
  imageUrl: string;
  price: number;
  roastLevel: RoastLevel;
  origin: string;
};

export async function createProductAction(input: ProductFormInput) {
  try {
    await createProduct(
      input.name,
      input.slug,
      input.description,
      input.detailDescription,
      input.imageUrl,
      input.price,
      input.roastLevel,
      input.origin
    );
    revalidatePath("/admin");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export async function updateProductAction(productId: string, input: ProductFormInput) {
  try {
    const updated = await updateProduct(
      productId,
      input.name,
      input.slug,
      input.description,
      input.detailDescription,
      input.imageUrl,
      input.price,
      input.roastLevel,
      input.origin
    );
    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath(`/products/${updated.slug}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update product",
    };
  }
}

export async function updateProductStockAction(
  productId: string,
  newStock: number
) {
  try {
    await updateProductStock(productId, newStock);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update stock",
    };
  }
}

export async function toggleProductActiveAction(productId: string) {
  try {
    await toggleProductActive(productId);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle status",
    };
  }
}

export async function deleteProductAction(productId: string) {
  try {
    const deleted = await deleteProduct(productId);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath(`/products/${deleted.slug}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete product",
    };
  }
}
