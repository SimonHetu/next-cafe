import { RoastLevel } from "@/src/generated/prisma/enums";
import prisma from "@/src/lib/prisma";

export async function getProducts(origin?: string, roast?: string, orderBy?: string, isActive?: boolean) {
  const orderByOptions: Record<string, Record<any, string>> = {
    "a-z": { name: "asc" },
    "price-asc": { price: "asc" },
    "price-desc": { price: "desc" },
    "best-seller": { createdAt: "asc" },
    "newest": { createdAt: "desc" },
  }
  if (!orderBy || !orderByOptions[orderBy]) {
    orderBy = "a-z";
  }
  const roastMap: Record<string, RoastLevel> = {
    light: RoastLevel.LIGHT,
    medium: RoastLevel.MEDIUM,
    dark: RoastLevel.DARK,
  };
  const roastLevel = roast ? roastMap[roast.toLowerCase()] : null;
  const where: Record<any, any> = {}
  if (origin) where.origin = origin;
  if (roast) where.roastLevel = roastLevel;
  if (isActive !== undefined) where.isActive = isActive;

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

export async function getProductById(productId: string) {
  return prisma.product.findUnique({
    where: { id: productId },
  });
}

export async function updateProductStock(
  productId: string,
  newStockQuantity: number
) {
  if (newStockQuantity < 0) {
    throw new Error("Stock quantity cannot be negative");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { stockQuantity: newStockQuantity },
  });

  return updated;
}

export async function createProduct(
  name: string,
  slug: string,
  description: string,
  detailDescription: string,
  imageUrl: string,
  price: number,
  roastLevel: RoastLevel,
  origin: string,
  stockQuantity: number = 0,
  isActive: boolean = true
) {
  if (!name || !slug || !description || !detailDescription || !imageUrl || !origin) {
    throw new Error("Missing required fields");
  }

  if (price < 0) {
    throw new Error("Price cannot be negative");
  }

  if (stockQuantity < 0) {
    throw new Error("Stock quantity cannot be negative");
  }

  const existingSlug = await prisma.product.findUnique({
    where: { slug },
  });

  if (existingSlug) {
    throw new Error("Product slug already exists");
  }

  const created = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      detailDescription,
      imageUrl,
      price,
      roastLevel,
      origin,
      stockQuantity,
      isActive,
    },
  });

  return created;
}

export async function updateProduct(
  productId: string,
  name?: string,
  slug?: string,
  description?: string,
  detailDescription?: string,
  imageUrl?: string,
  price?: number,
  roastLevel?: RoastLevel,
  origin?: string
) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (slug && slug !== product.slug) {
    const existingSlug = await prisma.product.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      throw new Error("Product slug already exists");
    }
  }

  if (price !== undefined && price < 0) {
    throw new Error("Price cannot be negative");
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      ...(name && { name }),
      ...(slug && { slug }),
      ...(description && { description }),
      ...(detailDescription && { detailDescription }),
      ...(imageUrl && { imageUrl }),
      ...(price !== undefined && { price }),
      ...(roastLevel && { roastLevel }),
      ...(origin && { origin }),
    },
  });

  return updated;
}

export async function toggleProductActive(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const updated = await prisma.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  });

  return updated;
}

export async function deleteProduct(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      _count: {
        select: {
          items: true,
        },
      },
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product._count.items > 0) {
    throw new Error(
      "Cannot delete this product because it is referenced in cart/order items"
    );
  }

  const deleted = await prisma.$transaction(async (tx) => {
    await tx.productFlavorNote.deleteMany({
      where: { productId },
    });

    return tx.product.delete({
      where: { id: productId },
    });
  });

  return deleted;
}

export const ProductService = {
  createProduct,
  deleteProduct,
  updateProduct,
  updateProductStock,
  toggleProductActive,
};
