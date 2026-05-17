import Link from "next/link";
import Stripe from "stripe";
import { CircleCheck, Coffee } from "lucide-react";
import { ClearGuestCartOnMount } from "./clear-guest-cart-on-mount";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

function formatCad(amountCents: number | null | undefined): string {
  if (amountCents == null) {
    return "";
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amountCents / 100);
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Coffee className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
          <h1 className="text-2xl font-bold text-base-content mb-2">
            Something is missing
          </h1>
          <p className="text-base-content/70 mb-6">
            We could not confirm this checkout. If you paid, look for a receipt
            in your inbox. You can also return to your cart and try again.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/cart" className="btn btn-outline">
              View cart
            </Link>
            <Link href="/products" className="btn btn-accent">
              Browse coffee
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Coffee className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
          <h1 className="text-2xl font-bold text-base-content mb-2">
            Could not load checkout
          </h1>
          <p className="text-base-content/70 mb-6">
            This link may be invalid or expired. If you finished paying, check
            your email for a receipt. Otherwise head back to your cart.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/cart" className="btn btn-outline">
              View cart
            </Link>
            <Link href="/products" className="btn btn-accent">
              Browse coffee
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (session.payment_status === "paid") {
    const total = formatCad(session.amount_total);
    return (
      <>
        <ClearGuestCartOnMount shouldClear />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <CircleCheck className="w-16 h-16 mx-auto mb-4 text-success" />
            <h1 className="text-2xl font-bold text-base-content mb-2">
              Thank you for your order
            </h1>
            <p className="text-base-content/70 mb-2">
              Your payment went through and we are preparing your coffee.
            </p>
            {total ? (
              <p className="text-lg font-semibold text-base-content mb-6">
                Total paid: {total}
              </p>
            ) : (
              <div className="mb-6" />
            )}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/products" className="btn btn-accent">
                Keep shopping
              </Link>
              <Link href="/" className="btn btn-outline">
                Home
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Coffee className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
        <h1 className="text-2xl font-bold text-base-content mb-2">
          Almost there
        </h1>
        <p className="text-base-content/70 mb-6">
          We are still processing this payment. It may take a moment. Check
          your email for updates, or return to the shop.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/products" className="btn btn-accent">
            Browse coffee
          </Link>
          <Link href="/cart" className="btn btn-outline">
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}
