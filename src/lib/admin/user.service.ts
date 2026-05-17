"use server";

import prisma from "@/src/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { UserRole } from "@/src/generated/prisma/enums";
import logger from "@/src/lib/logger";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        orders: {
          select: {
            id: true,
            status: true,
            paymentStatus: true,
            createdAt: true,
          },
        },
        cart: {
          select: {
            id: true,
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    logger.error("admin_user_service.get_users_failed", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

export async function updateUserRole(userId: string, role: UserRole) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });
    return user;
  } catch (error) {
    logger.error("admin_user_service.update_role_failed", {
      userId,
      role,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    // Delete from Clerk
    const client = await clerkClient();
    try {
      await client.users.deleteUser(userId);
    } catch (clerkError) {
      console.warn("User not found in Clerk, proceeding with database deletion");
    }

    // Delete from database
    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true };
  } catch (error) {
    logger.error("admin_user_service.delete_user_failed", {
      userId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}