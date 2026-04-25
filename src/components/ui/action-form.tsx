"use client";

import { useState, useTransition } from "react";
import type { CartActionState } from "@/src/lib/cart/cart.actions";

interface ActionFormProps {
  action: (
    prevState: CartActionState,
    formData: FormData
  ) => Promise<CartActionState>;
  children: React.ReactNode;
  className?: string;
}

/**
 * ActionForm est un wrapper autour de useActionState qui nous permet de passer
 * le formulaire avec une action et l'état initial directement dans les composantes.
 */
export function ActionForm({ action, children, className }: ActionFormProps) {
  const [state, setState] = useState<CartActionState>(null);
  const [, startTransition] = useTransition();

  const formAction = (formData: FormData) => {
    startTransition(async () => {
      const result = await action(state, formData);
      setState(result);
      if (result === null) {
        window.dispatchEvent(new Event("cart-updated"));
      }
    });
  };

  return (
    <form action={formAction} className={className}>
      {children}
      {state?.message && (
        <p className="text-error text-xs mt-1">{state.message}</p>
      )}
    </form>
  );
}
