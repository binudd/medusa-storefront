import { HttpTypes } from "@medusajs/types"

export const isSimpleProduct = (product: HttpTypes.StoreProduct): boolean => {
  return (
    product.options?.length === 1 && product.options[0].values?.length === 1
  )
}

/** Whether a specific variant can currently be purchased. */
export function isVariantInStock(
  variant: HttpTypes.StoreProductVariant | undefined
): boolean {
  if (!variant) return false
  if (!variant.manage_inventory) return true
  if (variant.allow_backorder) return true
  return (variant.inventory_quantity ?? 0) > 0
}

/** Map a variant's option values to `{ [optionId]: value }`. */
export function variantOptionsMap(
  variant: HttpTypes.StoreProductVariant
): Record<string, string> {
  return (variant.options ?? []).reduce<Record<string, string>>((acc, o) => {
    if (o.option_id) acc[o.option_id] = o.value
    return acc
  }, {})
}

/**
 * Images to display for the current selection: variant-specific images when
 * the variant has any, otherwise the product's images.
 */
export function imagesForVariant(
  product: HttpTypes.StoreProduct,
  variant?: HttpTypes.StoreProductVariant
): HttpTypes.StoreProductImage[] {
  const all = product.images ?? []
  if (!variant?.images?.length) return all
  const ids = new Set(variant.images.map((i) => i.id))
  const matched = all.filter((i) => ids.has(i.id))
  return matched.length ? matched : all
}