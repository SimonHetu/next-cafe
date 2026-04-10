import "dotenv/config";
import { prisma } from "@/app/lib/prisma";

import { seedUsers } from "./seeds/users";
import { seedProfiles } from "./seeds/profiles";
import { seedAddresses } from "./seeds/addresses";
import { seedProducts } from "./seeds/products";
import { seedFlavorNotes } from "./seeds/flavorNotes";
import { seedProductFlavorNotes } from "./seeds/productFlavorNotes";
import { seedOrders } from "./seeds/orders";

async function main() {
  console.log("Reset DB...");

  // Supprime les données des tables (en ordre de dépendances pour éviter les erreurs FK )
  await prisma.item.deleteMany();
  await prisma.productFlavorNote.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.flavorNote.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Execution des seeds en ordre pour les relations
  console.log("Seeding...");

  await seedUsers();
  await seedProfiles();
  await seedAddresses();
  await seedProducts();
  await seedFlavorNotes();
  await seedProductFlavorNotes();
  await seedOrders();

  console.log("Seeding done");
}

// Run script
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });