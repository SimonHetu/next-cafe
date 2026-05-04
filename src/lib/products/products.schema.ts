import { z } from "zod";
import { RoastLevel } from "@/src/generated/prisma/enums";

const imagePathRegex =
  /^(https?:\/\/.+\.(?:png|jpg|jpeg|gif|webp|svg|bmp))|(\/[a-zA-Z0-9._-]+)+\.(png|jpg|jpeg|gif|webp|svg|bmp)$/i;

export const imageSchema = z
  .string()
  .trim()
  .min(1, "Image URL is required.")
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
  name: z.string().trim().min(1, "Name is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  description: z.string().trim().min(1, "Short description is required."),
  detailDescription: z
    .string()
    .trim()
    .min(1, "Detailed description is required."),
  imageUrl: imageSchema,
  price: z.coerce.number().min(0, "Price cannot be negative."),
  roastLevel: z.enum(RoastLevel),
  origin: z.string().trim().min(1, "Origin is required."),
});

export const UpdateProductSchema = CreateProductSchema.extend({
  productId: z.string().trim().min(1, "Product ID is required."),
});

export const UpdateProductStockSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required."),
  newStock: z.coerce
    .number()
    .int("Stock quantity must be a whole number.")
    .min(0, "Stock quantity cannot be negative."),
});

export const ToggleProductActiveSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required."),
});

export const DeleteProductSchema = z.object({
  productId: z.string().trim().min(1, "Product ID is required."),
});

