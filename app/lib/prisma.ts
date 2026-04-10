import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";


const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing");
}

// Prisma setup
const adapter = new PrismaNeon({ connectionString, });
const prisma = new PrismaClient({ adapter });

export default prisma;

