import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

import { seedUsers } from "./seeds/users";
import { seedProducts } from "./seeds/products";
import { seedFlavorNotes } from "./seeds/flavorNotes";
import { seedProductFlavorNotes } from "./seeds/productFlavorNotes";
import { seedOrders } from "./seeds/orders";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding...");

  await seedUsers(prisma);
  await seedProducts(prisma);
  await seedFlavorNotes(prisma);
  await seedProductFlavorNotes(prisma);
  await seedOrders(prisma);

  console.log("Seeding done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });