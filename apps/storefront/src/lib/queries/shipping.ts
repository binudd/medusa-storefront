"use client"

import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { HttpTypes } from "@medusajs/types"
import { useQueries } from "@tanstack/react-query"

import { queryKeys } from "./keys"

/**
 * Calculates prices for shipping options with `price_type === "calculated"`.
 * Returns a map of optionId -> amount plus an aggregate loading flag.
 */
export function useCalculatedShippingPrices(
  cartId: string,
  options: HttpTypes.StoreCartShippingOption[]
) {
  const calculated = options.filter((o) => o.price_type === "calculated")

  const results = useQueries({
    queries: calculated.map((option) => ({
      queryKey: queryKeys.shipping.optionPrice(cartId, option.id),
      queryFn: () => calculatePriceForShippingOption(option.id, cartId),
      staleTime: 60 * 1000,
    })),
  })

  const prices: Record<string, number> = {}
  results.forEach((result, i) => {
    const amount = result.data?.amount
    if (typeof amount === "number") {
      prices[calculated[i].id] = amount
    }
  })

  return {
    prices,
    isLoading: results.some((r) => r.isPending),
  }
}
