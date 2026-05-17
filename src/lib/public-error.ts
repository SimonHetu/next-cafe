/**
 * Messages thrown intentionally from domain services for user-facing feedback.
 * Any other Error.message is treated as internal and must not be returned to clients.
 */
const DOMAIN_USER_MESSAGES = new Set<string>([
  // cart.service
  "Cart not found",
  "Product is not available",
  // product.service
  "Stock quantity cannot be negative",
  "Product not found",
  "Missing required fields",
  "Price cannot be negative",
  "Product slug already exists",
  "Cannot delete this product because it is referenced in cart/order items",
]);

/** Stable copy for checkout failures (Stripe / server); safe to show in the UI. */
export const CHECKOUT_GENERIC_ERROR_MESSAGE =
  "We couldn't start checkout. Please try again in a moment.";

export function toPublicErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && DOMAIN_USER_MESSAGES.has(error.message)) {
    return error.message;
  }
  return fallback;
}
