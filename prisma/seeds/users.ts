import { prisma } from "@/app/lib/prisma";
import { UserRole } from "../../app/generated/prisma/enums";

export async function seedUsers() {
  await prisma.user.createMany({
    data: [
      {
        id: "stephanie.uid",
        firstName: "Stéphanie",
        lastName: "Caféine",
        email: "stephanie.cafeine@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        id: "fanny.uid",
        firstName: "Fanny",
        lastName: "Brume",
        email: "fanny.brume@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        id: "lucien.uid",
        firstName: "Lucien",
        lastName: "Boisé",
        email: "lucien.boise@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        id: "emilie.uid",
        firstName: "Émilie",
        lastName: "Velours",
        email: "emilie.velours@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        id: "thomas.uid",
        firstName: "Thomas",
        lastName: "Corsé",
        email: "thomas.corse@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        id: "camille.uid",
        firstName: "Camille",
        lastName: "Noisette",
        email: "camille.noisette@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        id: "julien.uid",
        firstName: "Julien",
        lastName: "Aurore",
        email: "julien.aurore@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        id: "chloe.uid",
        firstName: "Chloé",
        lastName: "Moka",
        email: "chloe.moka@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        id: "antoine.uid",
        firstName: "Antoine",
        lastName: "Rivière",
        email: "antoine.riviere@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        id: "sophie.uid",
        firstName: "Sophie",
        lastName: "Lumière",
        email: "sophie.lumiere@example.com",
        role: UserRole.CUSTOMER,
      },
      {
        id: "admin.uid",
        firstName: "Admin",
        lastName: "Admin",
        email: "admin@cafe.dev",
        role: UserRole.ADMIN,
      },
    ],
  });
}