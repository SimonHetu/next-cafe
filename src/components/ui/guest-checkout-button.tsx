"use client";

import { GuestCartItem } from "@/src/lib/cart/guest-cart";
import { createGuestCheckoutSession } from "@/src/lib/stripe/checkout";
import { CHECKOUT_GENERIC_ERROR_MESSAGE } from "@/src/lib/public-error";
import { useTransition } from "react";

type CheckoutButtonProps = {
  items: GuestCartItem[];     
  disabled?: boolean;   
};

export function GuestCheckoutButton({
  items,
  disabled = false,
}: CheckoutButtonProps) {

  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await createGuestCheckoutSession(items);
      } catch {
        alert(CHECKOUT_GENERIC_ERROR_MESSAGE);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}  
      disabled={disabled || isPending}
      className="toggle-btn inline-flex items-center gap-2 border bg-accent/70 px-4 py-2 text-sm font-semibold uppercase tracking-wide shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-info-content hover:bg-info-content/10 hover:shadow-md pointer-events-auto">
      {isPending ? 'Redirecting to Stripe...' : 'Pay with Stripe'}
    </button>
  );
}