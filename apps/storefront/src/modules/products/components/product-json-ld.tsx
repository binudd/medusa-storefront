import { HttpTypes } from "@medusajs/types"

import { getBaseURL } from "@lib/util/env"
import { isVariantInStock } from "@lib/util/product"
import { storeConfig } from "@/config"

/**
 * schema.org Product structured data. Uses calculated variant prices from the
 * region-priced product; amounts are already in major units.
 */
export function ProductJsonLd({
  product,
  countryCode,
}: {
  product: HttpTypes.StoreProduct
  countryCode: string
}) {
  const url = `${getBaseURL()}/${countryCode}/products/${product.handle}`
  const offers = (product.variants ?? [])
    .filter((v) => v.calculated_price?.calculated_amount != null)
    .map((v) => ({
      "@type": "Offer",
      sku: v.sku ?? undefined,
      url: `${url}?v_id=${v.id}`,
      price: v.calculated_price?.calculated_amount,
      priceCurrency: v.calculated_price?.currency_code?.toUpperCase(),
      availability: isVariantInStock(v)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    }))

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    image: product.images?.map((i) => i.url) ?? (product.thumbnail ? [product.thumbnail] : []),
    sku: product.variants?.[0]?.sku ?? undefined,
    brand: { "@type": "Brand", name: storeConfig.brand.name },
    url,
    offers: offers.length ? offers : undefined,
  }

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; escape `<` to avoid breaking out of the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  )
}
