import { prisma } from "@/app/lib/prisma";

export async function seedProfiles() {
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