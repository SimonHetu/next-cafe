const GUEST_CART_KEY = "next-cafe-guest-cart";

export interface GuestCartItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl?: string;
}

function dispatchUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("guest-cart-updated"));
  }
}

const EMPTY_CART: GuestCartItem[] = [];
export { EMPTY_CART };

let cachedRaw: string | null = null;
let cachedCart: GuestCartItem[] = EMPTY_CART;

export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (raw === cachedRaw) {
      return cachedCart;
    }
    cachedRaw = raw;
    cachedCart = raw ? JSON.parse(raw) : EMPTY_CART;
    return cachedCart;
  } catch {
    return EMPTY_CART;
  }
}

function saveGuestCart(items: GuestCartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  dispatchUpdate();
}

export function addToGuestCart(item: GuestCartItem) {
  const cart = getGuestCart();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveGuestCart(cart);
}

export function updateGuestCartItem(productId: string, quantity: number) {
  const cart = getGuestCart();
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;
  if (quantity <= 0) {
    removeGuestCartItem(productId);
    return;
  }
  item.quantity = quantity;
  saveGuestCart(cart);
}

export function removeGuestCartItem(productId: string) {
  const cart = getGuestCart().filter((i) => i.productId !== productId);
  saveGuestCart(cart);
}

export function clearGuestCart() {
  saveGuestCart(EMPTY_CART);
}

export function getGuestCartCount(): number {
  return getGuestCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function getGuestCartTotal(): number {
  return getGuestCart().reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
}
