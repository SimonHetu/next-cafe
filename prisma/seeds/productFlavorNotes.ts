import prisma from "@/src/lib/prisma";

export async function seedProductFlavorNotes() {

  // Charge tous les produits et FN
  const products = await prisma.product.findMany();
  const notes = await prisma.flavorNote.findMany();

  // Trouve une note via son nom
  const getNote = (name: string) =>
    notes.find((n) => n.name === name);

  // Trouve un produit via son slug
  const getProduct = (slug: string) =>
    products.find((p) => p.slug === slug);

  // Définition des relations
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
      notes: ["Smoky", "Chocolate"],
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
      notes: ["Chocolate", "Smoky"],
    },
    {
      product: "false-start-decaf",
      notes: ["Vanilla", "Creamy"],
    },
    {
      product: "null-brew-exception",
      notes: ["Smoky", "Cinnamon"],
    },
  ];

  // Parcourt chaque relation produit / notes
  for (const rel of relations) {
    // Convertit le slug en objet produit
    const product = getProduct(rel.product);
    if (!product) continue;

    // Parcourt les notes associées au produit
    for (const noteName of rel.notes) {
      const note = getNote(noteName);
      if (!note) continue;

      // Crée la relation en DB
      await prisma.productFlavorNote.create({
        data: {
          product: { connect: { id: product.id } },
          flavorNote: { connect: { id: note.id } },
        },
      });
    }
  }
}
