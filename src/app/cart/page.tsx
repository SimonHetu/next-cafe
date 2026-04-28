import Link from "next/link";
import { Coffee, Trash2, Minus, Plus } from "lucide-react";
import { getOrCreateCart } from "@/src/lib/cart/cart.service";
import { currentUser } from "@clerk/nextjs/server";
import {
  updateCartItemQuantityAction,
  removeCartItemAction,
  clearCartAction,
} from "@/src/lib/cart/cart.actions";
import type { CartItemWithProduct } from "@/src/lib/cart/cart.service";
import { CartItemCard } from "@/src/components/ui/cart-item-card";
import { ActionForm } from "@/src/components/ui/action-form";
import GuestCartView from "./guest-cart-view";

export default async function CartPage() {
  const user = await currentUser();

  if (!user) {
    return <GuestCartView />;
  }

  const cart = await getOrCreateCart(user.id);
  const items: CartItemWithProduct[] = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Coffee className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
          <h2 className="text-2xl font-bold text-base-content mb-2">
            Your cart is empty
          </h2>
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

  const total = items.reduce(
    (sum: number, item: CartItemWithProduct) =>
      sum + item.unitPrice.toNumber() * item.quantity,
    0
  );

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="space-y-6">
        {items.map((item) => (
          <CartItemCard
            key={item.id}
            imageUrl={item.product?.imageUrl ?? undefined}
            name={item.productName}
            unitPrice={item.unitPrice.toNumber()}
            quantity={item.quantity}
            decrementButton={
              <ActionForm action={updateCartItemQuantityAction}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="itemId" value={item.id} />
                <input
                  type="hidden"
                  name="quantity"
                  value={Math.max(1, item.quantity - 1)}
                />
                <button
                  type="submit"
                  className="btn btn-sm btn-square btn-outline"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </ActionForm>
            }
            incrementButton={
              <ActionForm action={updateCartItemQuantityAction}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="itemId" value={item.id} />
                <input
                  type="hidden"
                  name="quantity"
                  value={item.quantity + 1}
                />
                <button
                  type="submit"
                  className="btn btn-sm btn-square btn-outline"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </ActionForm>
            }
            removeButton={
              <ActionForm action={removeCartItemAction}>
                <input type="hidden" name="userId" value={user.id} />
                <input type="hidden" name="itemId" value={item.id} />
                <button
                  type="submit"
                  className="btn btn-sm btn-ghost text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </ActionForm>
            }
          />
        ))}
      </div>

      <div className="divider" />

      <div className="flex justify-between items-center">
        <ActionForm action={clearCartAction}>
          <input type="hidden" name="userId" value={user.id} />
          <button type="submit" className="btn btn-outline btn-error">
            Clear Cart
          </button>
        </ActionForm>
        <div className="text-right">
          <p className="text-lg">
            Total:{" "}
            <span className="text-2xl font-bold">${total.toFixed(2)}</span>
          </p>
          <Link href="/products" className="btn btn-accent mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
