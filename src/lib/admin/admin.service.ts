"use server";

import prisma from "@/src/lib/prisma";
import { UserRole } from "@/src/generated/prisma/enums";

export async function isAdmin(userId: string) {
    const dbUser = await prisma.user.findUnique({
        where: { id: userId },
    })
    return dbUser?.role === UserRole.ADMIN;
}