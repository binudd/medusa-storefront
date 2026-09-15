import { HttpTypes } from "@medusajs/types"
import { Suspense } from "react"

import type { HomeSection } from "@/config/types"
import { storeConfig } from "@/config"
import { ProductGridSkeleton } from "@/components/commerce/product-grid"

import { Editorial } from "./editorial"
import { FeaturedCollections } from "./featured-collections"
import { Hero } from "./hero"
import { NewsletterSection } from "./newsletter-section"
import { ProductRail } from "./product-rail"
import { PromoTiles } from "./promo-tiles"
import { ValueProps } from "./value-props"

function RailFallback() {
  return (
    <div className="content-container py-16 lg:py-24">
      <ProductGridSkeleton count={4} />
    </div>
  )
}

/**
 * Renders the home page from `storeConfig.home.sections`. Data-backed
 * sections stream in independently via Suspense.
 */
export function HomeSections({ region }: { region: HttpTypes.StoreRegion }) {
  return (
    <>
      {storeConfig.home.sections.map((section, index) =>
        renderSection(section, index, region)
      )}
    </>
  )
}

function renderSection(
  section: HomeSection,
  index: number,
  region: HttpTypes.StoreRegion
) {
  const key = `${section.type}-${index}`

  switch (section.type) {
    case "hero":
      return <Hero key={key} config={section.config} />
    case "value-props":
      return <ValueProps key={key} items={section.items} />
    case "featured-collections":
      return (
        <Suspense key={key} fallback={<RailFallback />}>
          <FeaturedCollections
            region={region}
            handles={section.handles}
            limit={section.limit}
            title={section.title}
          />
        </Suspense>
      )
    case "product-rail":
      return (
        <Suspense key={key} fallback={<RailFallback />}>
          <ProductRail
            region={region}
            collectionHandle={section.collectionHandle}
            title={section.title}
            limit={section.limit}
          />
        </Suspense>
      )
    case "new-arrivals":
      return (
        <Suspense key={key} fallback={<RailFallback />}>
          <ProductRail
            region={region}
            newest
            title={section.title ?? "New arrivals"}
            limit={section.limit}
          />
        </Suspense>
      )
    case "editorial":
      return <Editorial key={key} config={section.config} />
    case "promo-tiles":
      return <PromoTiles key={key} tiles={section.tiles} />
    case "newsletter":
      return storeConfig.features.newsletter ? (
        <NewsletterSection key={key} />
      ) : null
    default:
      return null
  }
}
