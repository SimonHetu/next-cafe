"use server";

import prisma from "@/src/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { UserRole } from "@/src/generated/prisma/enums";

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
    console.error("Error fetching users:", error);
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
    console.error("Error updating user role:", error);
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
    console.error("Error deleting user:", error);
    throw error;
  }
}