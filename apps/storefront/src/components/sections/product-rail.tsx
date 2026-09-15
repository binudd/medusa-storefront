import { HttpTypes } from "@medusajs/types"

import { getCollectionByHandle } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { SectionHeading } from "@/components/common/section-heading"
import { ProductGrid } from "@/components/commerce/product-grid"

type ProductRailProps = {
  region: HttpTypes.StoreRegion
  collectionHandle?: string
  title?: string
  limit?: number
  /** When true, ignores `collectionHandle` and shows newest products. */
  newest?: boolean
}

export async function ProductRail({
  region,
  collectionHandle,
  title,
  limit = 8,
  newest,
}: ProductRailProps) {
  let collection: HttpTypes.StoreCollection | null = null
  if (!newest && collectionHandle) {
    collection = await getCollectionByHandle(collectionHandle).catch(() => null)
    if (!collection) return null
  }

  const { response } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit,
      order: "-created_at",
      ...(collection ? { collection_id: [collection.id] } : {}),
    },
  }).catch(() => ({ response: { products: [], count: 0 } }))

  if (!response.products.length) return null

  const heading = title ?? collection?.title ?? "Products"
  const href = collection ? `/collections/${collection.handle}` : "/store"

  return (
    <section className="content-container py-16 lg:py-24">
      <SectionHeading title={heading} link={{ label: "View all", href }} />
      <div className="mt-8">
        <ProductGrid products={response.products} columns={4} />
      </div>
    </section>
  )
}
