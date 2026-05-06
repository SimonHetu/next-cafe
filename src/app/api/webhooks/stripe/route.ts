import prisma from "@/src/lib/prisma";
import { OrderStatus, PaymentStatus } from "@/src/generated/prisma/enums";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const payload = await req.text();
  if (!payload) {
    return new Response("Bad request", { status: 400 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Bad request", { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    // If error is on our side (no secret for example)
    // we should return a 200 and log the failure or stripe
    // will keep on trying again and again
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Success", { status: 200 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("Stripe webhook verification failed:", err);
    return new Response("Bad request", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleCheckoutSessionCompleted(session);
    } catch (err) {
      console.error("Failed to process checkout session:", err);
      // Return 500 so Stripe retries
      return new Response("Internal server error", { status: 500 });
    }
  }

  return new Response("Success", { status: 200 });
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const cartId = session.metadata?.cartId;

  if (!cartId) {
    throw new Error("Missing cartId in session metadata");
  }

  if (cartId === "GUEST_CHECKOUT") {
    await handleGuestCheckout(session);
  } else {
    await handleAuthenticatedCheckout(session, cartId);
  }
}

async function handleAuthenticatedCheckout(
  session: Stripe.Checkout.Session,
  cartId: string
) {
  // Fetch cart with items and products
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!cart) {
    throw new Error(`Cart not found: ${cartId}`);
  }

  if (cart.items.length === 0) {
    throw new Error(`Cart is empty: ${cartId}`);
  }

  await prisma.$transaction(async (tx) => {
    // Create order
    const order = await tx.order.create({
      data: {
        userId: cart.userId,
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
      },
    });

    // Move items from cart to order and decrement stock
    for (const item of cart.items) {
      // Update item to belong to order instead of cart
      await tx.item.update({
        where: { id: item.id },
        data: {
          orderId: order.id,
          cartId: null,
        },
      });

      // Decrement stock
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    // Delete the cart
    await tx.cart.delete({
      where: { id: cartId },
    });
  });
}

async function handleGuestCheckout(session: Stripe.Checkout.Session) {
  const itemsJson = session.metadata?.items;
  if (!itemsJson) {
    throw new Error("Missing items in guest checkout metadata");
  }

  interface GuestItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }

  const items: GuestItem[] = JSON.parse(itemsJson);

  await prisma.$transaction(async (tx) => {
    // Create order without user
    const order = await tx.order.create({
      data: {
        userId: null,
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
      },
    });

    // Create items and decrement stock
    for (const item of items) {
      await tx.item.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
      });

      // Decrement stock
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });
    }
  });
}
