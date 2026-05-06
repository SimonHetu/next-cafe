import { CartItemCard } from "@/src/components/ui/cart-item-card";
import { PaymentStatus } from "@/src/generated/prisma/enums";
import { GuestCartItem } from "@/src/lib/cart/guest-cart";
import prisma from "@/src/lib/prisma";
import { Decimal } from "@prisma/client/runtime/wasm-compiler-edge";
import { NextRequest } from "next/server";
import { todo } from "node:test";
import Stripe from "stripe";

export async function POST(req: NextRequest){
    
    const payload = await req.text();
    if (!payload) {
        return new Response("Bad request", {status: 400})
    }

    const header = req.headers.get("stripe-signature")
    if (!header){
        return new Response("Bad request", {status: 400})
    }

    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret){
        // If error is on our side (no secrect for example)
        // we should return a 200 and log the failure if not stripe
        // will keep on trying again and again 
        // TODO: Add logging here. 
        return new Response("Success", {status: 200})
    }

    let event: Stripe.Event

    try {
        event = Stripe.webhooks.constructEvent(
            payload,
            header,
            secret,
        )
    } catch (error) {
        // TODO: Log the error
        return new Response("Bad request", {status: 400})
    }

    switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const cartId = paymentIntent.metadata.cartId
      if (cartId === "GUEST_CHECKOUT") {
        return new Response("Success", {status: 200})
      }

      // TODO: Fix Database

      return new Response("Success", {status: 200})
    case 'payment_intent.payment_failed':
      const paymentMethod = event.data.object;
      return new Response("Success", {status: 200})
    default:
      console.log(`Unhandled event type ${event.type}`);
      return new Response("Success", {status: 200})
    }

}