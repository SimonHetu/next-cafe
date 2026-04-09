import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

import { seedUsers } from "./seeds/users";
import { seedProfiles } from "./seeds/profiles";
import { seedAddresses } from "./seeds/addresses";
import { seedProducts } from "./seeds/products";
import { seedFlavorNotes } from "./seeds/flavorNotes";
import { seedProductFlavorNotes } from "./seeds/productFlavorNotes";
import { seedOrders } from "./seeds/orders";

// Database config
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

// Prisma setup
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// Execution des seeds en ordre pour les relations
async function main() {
  console.log("Reset DB...");

  await prisma.item.deleteMany();
  await prisma.productFlavorNote.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.flavorNote.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding...");

  await seedUsers(prisma);
  await seedProfiles(prisma);
  await seedAddresses(prisma);
  await seedProducts(prisma);
  await seedFlavorNotes(prisma);
  await seedProductFlavorNotes(prisma);
  await seedOrders(prisma);

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