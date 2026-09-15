"use client"

import { useParams } from "next/navigation"
import * as React from "react"

import { useProductsByIds } from "@lib/queries/products"
import { useRecentlyViewedStore } from "@/store/recently-viewed.store"
import { SectionHeading } from "@/components/common/section-heading"
import { ProductGrid, ProductGridSkeleton } from "@/components/commerce/product-grid"

/**
 * Records the current product and renders the customer's recently viewed
 * items. Ids live in Zustand (persisted); product data is fetched fresh so
 * prices are always region-correct.
 */
export function RecentlyViewed({
  currentProduct,
}: {
  currentProduct: { id: string; handle: string; title: string; thumbnail: string | null }
}) {
  const { countryCode } = useParams<{ countryCode: string }>()
  const add = useRecentlyViewedStore((s) => s.add)
  const items = useRecentlyViewedStore((s) => s.items)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setHydrated(true)
    add(currentProduct)
    // Only record once per product view.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct.id])

  const ids = React.useMemo(
    () => items.filter((i) => i.id !== currentProduct.id).map((i) => i.id).slice(0, 4),
    [items, currentProduct.id]
  )

  const { data, isPending } = useProductsByIds({ ids, countryCode })

  if (!hydrated || ids.length === 0) return null
  if (!isPending && !data?.length) return null

  return (
    <section className="content-container pb-16 lg:pb-24" aria-labelledby="recent-heading">
      <SectionHeading eyebrow="Recently viewed" title="Pick up where you left off" className="mb-8" />
      {isPending ? (
        <ProductGridSkeleton count={ids.length} columns={4} />
      ) : (
        <ProductGrid products={data ?? []} columns={4} />
      )}
    </section>
  )
}
