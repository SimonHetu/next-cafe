import { z } from "zod";
import { RoastLevel } from "@/src/generated/prisma/enums";
import {
  LIMITS,
  moneyAmountSchema,
  productIdSchema,
  productSlugSchema,
  stockQuantitySchema,
} from "@/src/lib/validation/limits";

const imagePathRegex =
  /^(https?:\/\/.+\.(?:png|jpg|jpeg|gif|webp|svg|bmp))|(\/[a-zA-Z0-9._-]+)+\.(png|jpg|jpeg|gif|webp|svg|bmp)$/i;

export const imageSchema = z
  .string()
  .trim()
  .min(1, "Image URL is required.")
  .max(
    LIMITS.IMAGE_URL_MAX,
    `Image URL must be at most ${LIMITS.IMAGE_URL_MAX} characters.`
  )
  .refine((v) => imagePathRegex.test(v), {
    message: "Must be a valid image URL or local path.",
  })
  .refine(
    async (v) => {
      // Verification si image externe est accessible
      if (v.startsWith("http://") || v.startsWith("https://")) {
        try {
          const res = await fetch(v, { method: "HEAD" });
          if (!res.ok) return false;
          const ct = res.headers.get("content-type") ?? "";
          return ct.startsWith("image/");
        } catch {
          return false;
        }
      }
      // Image locale; l'extension est vérifiée, nous avons un fallback si le fichier n'existe pas
      return true;
    },
    { message: "Image URL not reachable or not an image." }
  );

export const CreateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(
      LIMITS.PRODUCT_NAME_MAX,
      `Name must be at most ${LIMITS.PRODUCT_NAME_MAX} characters.`
    ),
  slug: productSlugSchema,
  description: z
    .string()
    .trim()
    .min(1, "Short description is required.")
    .max(
      LIMITS.PRODUCT_DESCRIPTION_MAX,
      `Description must be at most ${LIMITS.PRODUCT_DESCRIPTION_MAX} characters.`
    ),
  detailDescription: z
    .string()
    .trim()
    .min(1, "Detailed description is required.")
    .max(
      LIMITS.PRODUCT_DETAIL_MAX,
      `Detailed description must be at most ${LIMITS.PRODUCT_DETAIL_MAX} characters.`
    ),
  imageUrl: imageSchema,
  price: moneyAmountSchema,
  roastLevel: z.enum(RoastLevel),
  origin: z
    .string()
    .trim()
    .min(1, "Origin is required.")
    .max(
      LIMITS.PRODUCT_ORIGIN_MAX,
      `Origin must be at most ${LIMITS.PRODUCT_ORIGIN_MAX} characters.`
    ),
});

export const UpdateProductSchema = CreateProductSchema.extend({
  productId: productIdSchema,
});

export const UpdateProductStockSchema = z.object({
  productId: productIdSchema,
  newStock: stockQuantitySchema,
});

export const ToggleProductActiveSchema = z.object({
  productId: productIdSchema,
});

export const DeleteProductSchema = z.object({
  productId: productIdSchema,
});
