import prisma from "@/lib/prisma";
import { CreateProductInput } from "@/lib/products/product.types";
import { validateCreateProductInput } from "@/lib/products/product.validation";

export const ProductService = {
    async createProduct(data: CreateProductInput) {
        validateCreateProductInput(data);

        return prisma.product.create({
            data: {
                name: data.name.trim(),
                slug: data.slug.trim(),
                description: data.description.trim(),
                detailDescription: data.detailDescription.trim(),
                imageUrl: data.imageUrl.trim(),
                price: data.price,
                stockQuantity: data.stockQuantity ?? 0,
                isActive: data.isActive ?? true,
                roastLevel: data.roastLevel,
                origin: data.origin.trim(),

                flavorNotes: data.flavorNoteIds?.length
                    ? {
                          create: data.flavorNoteIds.map((flavorNoteId) => ({
                              flavorNote: {
                                  connect: {
                                      id: flavorNoteId,
                                  },
                              },
                          })),
                      }
                    : undefined,
            },

            include: {
                flavorNotes: {
                    include: {
                        flavorNote: true,
                    },
                },
            },
        });
    },

    async getProducts() {
        return prisma.product.findMany({
            include: {
                flavorNotes: {
                    include: {
                        flavorNote: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    async getProductBySlug(slug: string) {
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
    },
};