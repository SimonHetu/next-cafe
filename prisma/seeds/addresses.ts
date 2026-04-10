import { prisma } from "@/app/lib/prisma";

export async function seedAddresses() {
  // Récupèrer les users
  const users = await prisma.user.findMany();

  // user via son email
  const getUser = (email: string) =>
    users.find((u) => u.email === email);

  // Données d'adresses via email
  const addresses = [
    {
      email: "stephanie.cafeine@example.com",
      line1: "123 Rue du Café",
      city: "Montréal",
      stateProvince: "QC",
      postalCode: "H2X 1Y4",
      country: "Canada",
      phone: "514-555-0101",
    },
    {
      email: "lucien.boise@example.com",
      line1: "456 Avenue du Grain",
      city: "Québec",
      stateProvince: "QC",
      postalCode: "G1K 3A7",
      country: "Canada",
      phone: "418-555-0102",
    },
    {
      email: "camille.noisette@example.com",
      line1: "789 Boulevard Arabica",
      city: "Laval",
      stateProvince: "QC",
      postalCode: "H7N 5X2",
      country: "Canada",
      phone: "450-555-0103",
    },
  ];

  // Création des adresses et association aux users
  for (const addr of addresses) {
    const user = getUser(addr.email);
    // skip si inexistant
    if (!user) continue;

    await prisma.address.create({
      data: {
        // Lien avec le user FK
        userId: user.id,

        // Nom complet à partir du user
        fullName: `${user.firstName} ${user.lastName}`,

        // Données d'adresse
        line1: addr.line1,
        city: addr.city,
        stateProvince: addr.stateProvince,
        postalCode: addr.postalCode,
        country: addr.country,
        phone: addr.phone,
      },
    });
  }
}