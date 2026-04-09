import { PrismaClient } from "../../app/generated/prisma/client";
import { UserRole } from "../../app/generated/prisma/enums";

export async function seedUsers(prisma: PrismaClient) {
  await prisma.user.createMany({
    data: [
      {
        firstName: "Stéphanie",
        lastName: "Caféine",
        email: "stephanie.cafeine@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        firstName: "Fanny",
        lastName: "Brume",
        email: "fanny.brume@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        firstName: "Lucien",
        lastName: "Boisé",
        email: "lucien.boise@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        firstName: "Émilie",
        lastName: "Velours",
        email: "emilie.velours@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        firstName: "Thomas",
        lastName: "Corsé",
        email: "thomas.corse@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        firstName: "Camille",
        lastName: "Noisette",
        email: "camille.noisette@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        firstName: "Julien",
        lastName: "Aurore",
        email: "julien.aurore@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        firstName: "Chloé",
        lastName: "Moka",
        email: "chloe.moka@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        firstName: "Antoine",
        lastName: "Rivière",
        email: "antoine.riviere@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        firstName: "Sophie",
        lastName: "Lumière",
        email: "sophie.lumiere@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        firstName: "Admin",
        lastName: "Admin",
        email: "admin@cafe.dev",
        role: UserRole.ADMIN,
      },
    ],
  });
}