import { RoastLevel } from "@/app/generated/prisma/enums";

export type CreateProductInput = {
    name: string;
    slug: string;
    description: string;
    detailDescription: string;
    imageUrl: string;
    price: number;
    stockQuantity?: number;
    isActive?: boolean;
    roastLevel: RoastLevel;
    origin: string;
    flavorNoteIds?: string[];
}