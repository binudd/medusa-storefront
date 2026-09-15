import { HttpTypes } from "@medusajs/types"

export type FreeShippingProgress = {
  shippingOptionId: string
  currencyCode: string
  currentAmount: number
  targetAmount: number
  targetReached: boolean
  targetRemaining: number
  /** 0-100 */
  percentage: number
}

function computeTarget(
  cart: HttpTypes.StoreCart,
  priceRule: { operator?: string | null; value: string }
) {
  const currentAmount = cart.item_total ?? 0
  const targetAmount = parseFloat(priceRule.value)

  let targetReached: boolean
  let targetRemaining: number

  switch (priceRule.operator) {
    case "gt":
      targetReached = currentAmount > targetAmount
      targetRemaining = targetReached ? 0 : targetAmount + 1 - currentAmount
      break
    case "gte":
      targetReached = currentAmount >= targetAmount
      targetRemaining = targetReached ? 0 : targetAmount - currentAmount
      break
    case "lt":
      targetReached = targetAmount > currentAmount
      targetRemaining = targetReached ? 0 : currentAmount + 1 - targetAmount
      break
    case "lte":
      targetReached = targetAmount >= currentAmount
      targetRemaining = targetReached ? 0 : currentAmount - targetAmount
      break
    default:
      targetReached = currentAmount === targetAmount
      targetRemaining = targetReached ? 0 : Math.max(targetAmount - currentAmount, 0)
  }

  return {
    currentAmount,
    targetAmount,
    targetReached,
    targetRemaining,
    percentage: Math.min(
      100,
      Math.max(0, targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0)
    ),
  }
}

/**
 * Finds a shipping option with a zero-amount price gated by an `item_total`
 * rule in the cart's currency, and computes progress toward it. Returns null
 * when the merchant has not configured a conditional free-shipping price.
 */
export function getFreeShippingProgress(
  cart: HttpTypes.StoreCart | null | undefined,
  shippingOptions: HttpTypes.StoreCartShippingOption[] | null | undefined
): FreeShippingProgress | null {
  if (!cart || !shippingOptions?.length) return null

  for (const option of shippingOptions) {
    if (!option.calculated_price) continue

    for (const price of option.prices ?? []) {
      if (price.currency_code !== cart.currency_code) continue
      if (price.amount !== 0) continue

      const rule = (price.price_rules ?? []).find(
        (r) => r.attribute === "item_total"
      )
      if (!rule) continue

      return {
        shippingOptionId: option.id,
        currencyCode: cart.currency_code,
        ...computeTarget(cart, rule),
      }
    }
  }

  return null
}
