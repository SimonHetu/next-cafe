import { faker } from "@faker-js/faker";
import { FlavorNote, Prisma, Product, RoastLevel } from "@/src/generated/prisma/client";

const roastLevels = [RoastLevel.LIGHT, RoastLevel.MEDIUM, RoastLevel.DARK];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export function getFakeProduct(n: number): Product[] {
  if (n <= 0) {
    return [];
  }

  return Array.from({ length: n }, () => {
    const name = faker.commerce.productName();
    const createdAt = faker.date.past({ years: 1 });
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
    const priceValue = faker.number.float({ min: 7, max: 25, fractionDigits: 2 });
    const slugSuffix = faker.string.alphanumeric(4).toLowerCase();

    return {
      id: faker.string.uuid(),
      name,
      slug: `${slugify(name)}-${slugSuffix}`,
      description: faker.commerce.productDescription(),
      imageUrl: faker.image.url({ width: 640, height: 320 }),
      price: new Prisma.Decimal(priceValue),
      stockQuantity: faker.number.int({ min: 0, max: 100 }),
      isActive: faker.datatype.boolean(),
      roastLevel: faker.helpers.arrayElement(roastLevels),
      origin: faker.location.country(),
      createdAt,
      updatedAt,
    };
  });
}

export default function getFakeFlavorNotes(n: number): FlavorNote[] {
  if (n <= 0) {
    return [];
  }
  return Array.from({ length: n }, () => {
    const name = faker.word.noun();
    return {
      id: faker.string.uuid(),
      name,
    };
  });
}

export function getFakeContry(n: number): string[] {
  if (n <= 0) {
    return [];
  }
  return Array.from({ length: n }, () => faker.location.country());
}
