"use client";

import { useEffect } from "react";
import { clearGuestCart } from "@/src/lib/cart/guest-cart";

export function ClearGuestCartOnMount({ shouldClear }: { shouldClear: boolean }) {
  useEffect(() => {
    if (shouldClear) {
      clearGuestCart();
    }
  }, [shouldClear]);
  return null;
}
