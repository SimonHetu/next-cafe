import prisma from "@/src/lib/prisma";

type ClerkLikeUser = {
  id: string;
  emailAddresses: readonly { emailAddress: string }[];
  firstName?: string | null;
  lastName?: string | null;
};

/** Same fields as the Clerk webhook — keeps `User` row in sync for cart FKs. */
export async function upsertLocalUserFromClerk(user: ClerkLikeUser): Promise<void> {
  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const firstName = user.firstName ?? "";
  const lastName = user.lastName ?? "";

  await prisma.user.upsert({
    where: { id: user.id },
    update: { email, firstName, lastName },
    create: {
      id: user.id,
      email,
      firstName,
      lastName,
    },
  });
}
