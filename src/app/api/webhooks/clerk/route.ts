import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import prisma from "@/src/lib/prisma";
import logger from "@/src/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      await prisma.user.upsert({
        where: { id: id },
        update: {}, // No update on create - handles duplicate webhooks
        create: {
          id: id,
          email: email_addresses[0]?.email_address ?? "",
          firstName: first_name ?? "",
          lastName: last_name ?? "",
        },
      });
    }

    if (evt.type === "user.updated") {
      const { id, email_addresses, first_name, last_name } = evt.data;
      await prisma.user.upsert({
        where: { id: id },
        update: {
          email: email_addresses[0]?.email_address ?? "",
          firstName: first_name ?? "",
          lastName: last_name ?? "",
        },
        create: {
          id: id,
          email: email_addresses[0]?.email_address ?? "",
          firstName: first_name ?? "",
          lastName: last_name ?? "",
        },
      });
    }

    if (evt.type === "user.deleted") {
      const { id } = evt.data;
      if (!id) {
        logger.warn("clerk_webhook.user_deleted_missing_id");
      } else {
        const result = await prisma.user.deleteMany({ where: { id } });
        if (result.count === 0) {
          logger.info("clerk_webhook.user_already_absent", { userId: id });
        } else {
          logger.info("clerk_webhook.user_deleted", { userId: id });
        }
      }
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (err) {
    logger.error("clerk_webhook.verification_failed", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return new Response("Invalid webhook", { status: 400 });
  }
}
