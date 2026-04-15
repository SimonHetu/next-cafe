import prisma  from "@/src/lib/prisma";

export async function seedFlavorNotes() {
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