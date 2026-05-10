"use server";

import { revalidatePath } from "next/cache";
import logger from "@/src/lib/logger";
import { ProductService } from "@/src/lib/products/product.service";
import {
  CreateProductSchema,
  DeleteProductSchema,
  ToggleProductActiveSchema,
  UpdateProductSchema,
  UpdateProductStockSchema,
} from "@/src/lib/products/products.schema";
import { toPublicErrorMessage } from "@/src/lib/public-error";

export async function createProductAction(input: unknown) {
  const parsed = await CreateProductSchema.safeParseAsync(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }
  try {
    const {
      name,
      slug,
      description,
      detailDescription,
      imageUrl,
      price,
      roastLevel,
      origin,
    } = parsed.data;
    await ProductService.createProduct(
      name,
      slug,
      description,
      detailDescription,
      imageUrl,
      price,
      roastLevel,
      origin
    );
    revalidatePath("/admin");
    revalidatePath("/products");
    return { success: true };
  } catch (error) {
    logger.error("product_action.create_failed", {
      action: "createProductAction",
      slug: parsed.data.slug,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: toPublicErrorMessage(error, "Failed to create product"),
    };
  }
}

export async function updateProductAction(productId: string, input: unknown) {
  const parsed = await UpdateProductSchema.safeParseAsync({
    ...(input as Record<string, unknown>),
    productId,
  });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }
  try {
    const {
      productId: id,
      name,
      slug,
      description,
      detailDescription,
      imageUrl,
      price,
      roastLevel,
      origin,
    } = parsed.data;
    const updated = await ProductService.updateProduct(
      id,
      name,
      slug,
      description,
      detailDescription,
      imageUrl,
      price,
      roastLevel,
      origin
    );
    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath(`/products/${updated.slug}`);
    return { success: true };
  } catch (error) {
    logger.error("product_action.update_failed", {
      action: "updateProductAction",
      productId: parsed.data.productId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: toPublicErrorMessage(error, "Failed to update product"),
    };
  }
}

export async function updateProductStockAction(productId: string, newStock: unknown) {
  const parsed = UpdateProductStockSchema.safeParse({ productId, newStock });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }
  try {
    await ProductService.updateProductStock(parsed.data.productId, parsed.data.newStock);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    logger.error("product_action.update_stock_failed", {
      action: "updateProductStockAction",
      productId: parsed.data.productId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: toPublicErrorMessage(error, "Failed to update stock"),
    };
  }
}

export async function toggleProductActiveAction(productId: string) {
  const parsed = ToggleProductActiveSchema.safeParse({ productId });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }
  try {
    await ProductService.toggleProductActive(parsed.data.productId);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    logger.error("product_action.toggle_active_failed", {
      action: "toggleProductActiveAction",
      productId: parsed.data.productId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: toPublicErrorMessage(error, "Failed to toggle status"),
    };
  }
}

export async function deleteProductAction(productId: string) {
  const parsed = DeleteProductSchema.safeParse({ productId });
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid form data.",
    };
  }
  try {
    const deleted = await ProductService.deleteProduct(parsed.data.productId);
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/products");
    revalidatePath(`/products/${deleted.slug}`);
    return { success: true };
  } catch (error) {
    logger.error("product_action.delete_failed", {
      action: "deleteProductAction",
      productId: parsed.data.productId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: toPublicErrorMessage(error, "Failed to delete product"),
    };
  }
}
