import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client/extension";
import "dotenv/config";


const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

// Prisma setup
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });


