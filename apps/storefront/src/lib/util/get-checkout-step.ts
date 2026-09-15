import { HttpTypes } from "@medusajs/types"

/**
 * Next checkout URL step based on what the cart is still missing.
 * Used by the cart page, cart drawer, and the checkout landing redirect.
 */
export function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart.shipping_address?.address_1 || !cart.email) return "address"
  if (!cart.shipping_methods?.length) return "delivery"
  return "payment"
}
