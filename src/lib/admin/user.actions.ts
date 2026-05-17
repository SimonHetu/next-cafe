"use server";

import { revalidatePath } from "next/cache";
import {
  updateUserRole,
  deleteUser,
} from "@/src/lib/admin/user.service";
import { UserRole } from "@/src/generated/prisma/enums";

export async function updateUserRoleAction(userId: string, role: UserRole) {
  try {
    await updateUserRole(userId, role);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update user role",
    };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    await deleteUser(userId);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete user",
    };
  }
}
