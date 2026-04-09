import { PrismaClient } from "../../app/generated/prisma/client";

export async function seedProductFlavorNotes(prisma: PrismaClient) {
  const products = await prisma.product.findMany();
  const notes = await prisma.flavorNote.findMany();

  const getNote = (name: string) =>
    notes.find((n) => n.name === name);

  const getProduct = (slug: string) =>
    products.find((p) => p.slug === slug);

  const relations = [
    {
      product: "python-press",
      notes: ["Floral", "Jasmine", "Citrus"],
    },
    {
      product: "ruby-roast",
      notes: ["Chocolate", "Vanilla", "Creamy"],
    },
    {
      product: "go-brew",
      notes: ["Citrus", "Lemon"],
    },
    {
      product: "c-brew",
      notes: ["Smoky", "Dark Chocolate"],
    },
    {
      product: "cpp-press",
      notes: ["Chocolate", "Cinnamon", "Smoky"],
    },
    {
      product: "csharp-shot",
      notes: ["Caramel", "Almond"],
    },
    {
      product: "azure-blend",
      notes: ["Berry", "Blueberry"],
    },
    {
      product: "boolean-brew",
      notes: ["Honey", "Creamy"],
    },
    {
      product: "true-roast",
      notes: ["Dark Chocolate", "Smoky"],
    },
    {
      product: "false-start-decaf",
      notes: ["Vanilla", "Creamy"],
    },
    {
      product: "null-brew-exception",
      notes: ["Smoky", "Ashy"],
    },
  ];

  for (const rel of relations) {
    const product = getProduct(rel.product);

    if (!product) continue;

    for (const noteName of rel.notes) {
      const note = getNote(noteName);
      if (!note) continue;

      await prisma.productFlavorNote.create({
        data: {
          productId: product.id,
          flavorNoteId: note.id,
        },
      });
    }
  }
}