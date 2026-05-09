"use client";

import Link from "next/link";
import { Coffee, Trash2, Minus, Plus } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  getGuestCart,
  updateGuestCartItem,
  removeGuestCartItem,
  clearGuestCart,
  getGuestCartTotal,
  EMPTY_CART,
  type GuestCartItem,
} from "@/src/lib/cart/guest-cart";
import { CartItemCard } from "@/src/components/ui/cart-item-card";
import { GuestCheckoutButton } from "@/src/components/ui/guest-checkout-button";
import { calculateTaxes } from "@/src/lib/tax";

// Un peu d'auto magie ici. 
// En gros à chaque fois que le signal to premier callback est lancer, 
// React va appeler getGuestCart() pour rafraichir le ui.
function useGuestCartItems(): GuestCartItem[] {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("guest-cart-updated", callback);
      return () => window.removeEventListener("guest-cart-updated", callback);
    },
    () => getGuestCart(),
    () => EMPTY_CART
  );
}

export default function GuestCartView() {
  const items = useGuestCartItems();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Coffee className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
          <h2 className="text-2xl font-bold text-base-content mb-2">Your cart is empty</h2>
          <p className="text-base-content/70 max-w-md mx-auto mb-6">
            Looks like you haven&apos;t added any coffee yet.
          </p>
          <Link href="/products" className="btn btn-accent">
            Browse Coffee
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getGuestCartTotal();
  const { gst, qst, total } = calculateTaxes(subtotal);

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <CartItemCard
            key={item.productId}
            imageUrl={item.imageUrl}
            name={item.productName}
            unitPrice={item.unitPrice}
            quantity={item.quantity}
            decrementButton={
              <button
                className="btn btn-sm btn-square btn-outline"
                onClick={() =>
                  updateGuestCartItem(item.productId, item.quantity - 1)
                }
              >
                <Minus className="w-3 h-3" />
              </button>
            }
            incrementButton={
              <button
                className="btn btn-sm btn-square btn-outline"
                onClick={() =>
                  updateGuestCartItem(item.productId, item.quantity + 1)
                }
              >
                <Plus className="w-3 h-3" />
              </button>
            }
            removeButton={
              <button
                className="btn btn-sm btn-ghost text-error"
                onClick={() => removeGuestCartItem(item.productId)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            }
          />
        ))}
      </div>

      <div className="divider" />

      <div className="space-y-1 text-right">
        <p className="text-sm text-base-content/70">
          Subtotal: <span className="font-medium">${subtotal.toFixed(2)}</span>
        </p>
        <p className="text-sm text-base-content/70">
          GST (5%): <span className="font-medium">${gst.toFixed(2)}</span>
        </p>
        <p className="text-sm text-base-content/70">
          QST (9.975%): <span className="font-medium">${qst.toFixed(2)}</span>
        </p>
        <p className="text-lg">
          Total:{" "}
          <span className="text-2xl font-bold">${total.toFixed(2)}</span>
        </p>
        <p className="text-xs text-base-content/50">Estimated taxes</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button className="btn btn-outline btn-error" onClick={clearGuestCart}>
          Clear Cart
        </button>
        <GuestCheckoutButton items={items} />
      </div>
    </div>
  );
}
