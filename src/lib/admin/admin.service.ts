"use server";

import prisma from "@/src/lib/prisma";
import { UserRole } from "@/src/generated/prisma/enums";
import logger from "@/src/lib/logger";

export async function isAdmin(userId: string) {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    return dbUser?.role === UserRole.ADMIN;
  } catch (error) {
    logger.error("admin_service.is_admin_failed", {
      userId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}