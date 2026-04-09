import { PrismaClient } from "../../app/generated/prisma/client";

export async function seedProfiles(prisma: PrismaClient) {
  const users = await prisma.user.findMany();

  for (const user of users) {
    await prisma.profile.create({
      data: {
        userId: user.id,
        bio: `Profil de ${user.firstName}`,
        avatarUrl: null,
      },
    });
  }
}