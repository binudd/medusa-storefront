import { HttpTypes } from "@medusajs/types"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

export const SORT_OPTIONS: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
]

export function isSortOption(value: unknown): value is SortOptions {
  return (
    value === "price_asc" || value === "price_desc" || value === "created_at"
  )
}

type PricedVariant = HttpTypes.StoreProductVariant & {
  calculated_price?: { calculated_amount?: number | null }
}

/**
 * Lowest calculated price across a product's variants, or null when unpriced.
 */
export function getMinPrice(product: HttpTypes.StoreProduct): number | null {
  const amounts = (product.variants as PricedVariant[] | undefined)
    ?.map((v) => v.calculated_price?.calculated_amount)
    .filter((a): a is number => typeof a === "number")

  if (!amounts?.length) return null
  return Math.min(...amounts)
}

/**
 * Whether at least one variant can be purchased right now.
 */
export function isProductInStock(product: HttpTypes.StoreProduct): boolean {
  return (product.variants ?? []).some((v) => {
    if (!v.manage_inventory) return true
    if (v.allow_backorder) return true
    return (v.inventory_quantity ?? 0) > 0
  })
}

/**
 * Sort products client-side until the store API supports sorting by price.
 * Returns a new array; does not mutate the input.
 */
export function sortProducts(
  products: HttpTypes.StoreProduct[],
  sortBy: SortOptions
): HttpTypes.StoreProduct[] {
  const sorted = [...products]

  if (sortBy === "price_asc" || sortBy === "price_desc") {
    const withPrice = sorted.map((product) => ({
      product,
      price: getMinPrice(product) ?? Number.POSITIVE_INFINITY,
    }))
    withPrice.sort((a, b) =>
      sortBy === "price_asc" ? a.price - b.price : b.price - a.price
    )
    return withPrice.map((p) => p.product)
  }

  sorted.sort(
    (a, b) =>
      new Date(b.created_at ?? 0).getTime() -
      new Date(a.created_at ?? 0).getTime()
  )

  return sorted
}
