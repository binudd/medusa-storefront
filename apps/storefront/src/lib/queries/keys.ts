/**
 * Central query-key factory. Every TanStack Query key in the app is built
 * here so invalidation is predictable and typos are caught by the compiler.
 */
export const queryKeys = {
  cart: {
    all: ["cart"] as const,
    detail: () => [...queryKeys.cart.all, "detail"] as const,
  },
  customer: {
    all: ["customer"] as const,
    me: () => [...queryKeys.customer.all, "me"] as const,
  },
  products: {
    all: ["products"] as const,
    options: () => [...queryKeys.products.all, "options"] as const,
    byIds: (countryCode: string, ids: string[]) =>
      [...queryKeys.products.all, "byIds", countryCode, ...ids] as const,
    search: (countryCode: string, q: string, limit: number) =>
      [...queryKeys.products.all, "search", countryCode, q, limit] as const,
  },
  shipping: {
    all: ["shipping"] as const,
    optionPrice: (cartId: string, optionId: string) =>
      [...queryKeys.shipping.all, "price", cartId, optionId] as const,
  },
} as const
