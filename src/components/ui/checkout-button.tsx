"use client"

import { createAuthenticatedCheckoutSession } from "@/src/lib/stripe/checkout";
import { useTransition } from "react";

type CheckoutButtonProps = {
  cartId: string;     
  disabled?: boolean;   
};

export function CheckoutButton({
  cartId,
  disabled = false,
}: CheckoutButtonProps) {

  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      try {
        await createAuthenticatedCheckoutSession(cartId);
      } catch (error) {
        console.error(error);

        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('Une erreur inconnue est survenue pendant le paiement.');
        }
      }
    }); 
  }

  return (
    <button
      type="button"
      onClick={handleClick}  
      disabled={disabled || isPending}
      className="toggle-btn mb-6 inline-flex items-center gap-2 border bg-accent/70 px-4 py-2 text-sm font-semibold uppercase tracking-wide shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-info-content hover:bg-info-content/10 hover:shadow-md pointer-events-auto">
      {isPending ? 'Redirection vers Stripe...' : 'Payer avec Stripe'}
    </button>
  );
}