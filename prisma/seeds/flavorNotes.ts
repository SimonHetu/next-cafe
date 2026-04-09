import { PrismaClient } from "../../app/generated/prisma/client";

export async function seedFlavorNotes(prisma: PrismaClient) {
  await prisma.flavorNote.createMany({
    data: [
      "Chocolate",
      "Caramel",
      "Honey",
      "Berry",
      "Strawberry",
      "Blueberry",
      "Citrus",
      "Orange",
      "Lemon",
      "Floral",
      "Jasmine",
      "Hazelnut",
      "Almond",
      "Vanilla",
      "Cinnamon",
      "Creamy",
      "Smoky",
    ].map((name) => ({ name })),
  });
}