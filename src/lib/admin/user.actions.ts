"use server";

import { revalidatePath } from "next/cache";
import logger from "@/src/lib/logger";
import {
  updateUserRole,
  deleteUser,
} from "@/src/lib/admin/user.service";
import { UserRole } from "@/src/generated/prisma/enums";
import { toPublicErrorMessage } from "@/src/lib/public-error";

export async function updateUserRoleAction(userId: string, role: UserRole) {
  try {
    await updateUserRole(userId, role);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    logger.error("admin_user_action.update_role_failed", {
      userId,
      role,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: toPublicErrorMessage(error, "Failed to update user role"),
    };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    await deleteUser(userId);
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    logger.error("admin_user_action.delete_user_failed", {
      userId,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: toPublicErrorMessage(error, "Failed to delete user"),
    };
  }
}
