"use server"

import { RoastLevel } from "@/src/app/generated/prisma/enums";
import prisma from "@/src/lib/prisma";
import { CreateProductInput } from "@/src/lib/products/product.types";
import { validateCreateProductInput } from "@/src/lib/products/product.validation";



export async function getProducts(origin: string, roast: string, orderBy: string) {
  const orderByOptions: Record<string, Record<any, string>> = {
    "a-z": { name: "asc" },
    "price-asc": { price: "asc" },
    "price-desc": { price: "desc" },
    "best-seller": { createdAt: "asc" },
    "newest": { createdAt: "desc" },
  }
  const roastMap: Record<string, RoastLevel> = {
    light: RoastLevel.LIGHT,
    medium: RoastLevel.MEDIUM,
    dark: RoastLevel.DARK,
  };
  const roastLevel = roastMap[roast.toLowerCase()];

  const where: Record<any, any> = {}
  if (origin) where.origin = origin;
  if (roastLevel) where.roastLevel = roastLevel;

  return prisma.product.findMany({
    include: {
      flavorNotes: {
        include: {
          flavorNote: true,
        },
      },
    },

    where: where,
    orderBy: orderByOptions[orderBy],
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      flavorNotes: {
        include: {
          flavorNote: true,
        },
      },
    },
  });
}
