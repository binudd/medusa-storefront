import { HttpTypes } from "@medusajs/types"

import { listProducts } from "@lib/data/products"
import { SectionHeading } from "@/components/common/section-heading"
import { ProductGrid } from "@/components/commerce/product-grid"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
  limit?: number
}

/**
 * Products from the same collection (falling back to shared tags). Rendered
 * inside Suspense so it streams after the main PDP content.
 */
export async function RelatedProducts({
  product,
  countryCode,
  limit = 4,
}: RelatedProductsProps) {
  const queryParams: HttpTypes.StoreProductListParams = {
    limit: limit + 1,
    is_giftcard: false,
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  } else if (product.tags?.length) {
    queryParams.tag_id = product.tags.map((t) => t.id)
  } else {
    return null
  }

  const products = await listProducts({ queryParams, countryCode })
    .then(({ response }) =>
      response.products.filter((p) => p.id !== product.id).slice(0, limit)
    )
    .catch(() => [])

  if (!products.length) return null

  return (
    <section
      className="content-container py-16 lg:py-24"
      aria-labelledby="related-heading"
      data-testid="related-products-container"
    >
      <SectionHeading
        eyebrow="You may also like"
        title="Complete the look"
        link={
          product.collection
            ? {
                label: `Shop ${product.collection.title}`,
                href: `/collections/${product.collection.handle}`,
              }
            : undefined
        }
        className="mb-8"
      />
      <ProductGrid products={products} columns={4} />
    </section>
  )
}
