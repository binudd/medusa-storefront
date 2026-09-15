import { HttpTypes } from "@medusajs/types"
import { Suspense } from "react"

import { storeConfig } from "@/config"
import { LocalizedLink } from "@/components/common/localized-link"
import { ProductGridSkeleton } from "@/components/commerce/product-grid"

import { ProductActions } from "../components/product-actions"
import { ProductDetails } from "../components/product-details"
import { ProductGalleryIsland } from "../components/product-gallery-island"
import { ProductJsonLd } from "../components/product-json-ld"
import { RecentlyViewed } from "../components/recently-viewed"
import { RelatedProducts } from "../components/related-products"
import { ProductProvider } from "../context/product-context"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
  initialVariantId?: string
}

export function ProductTemplate({
  product,
  countryCode,
  initialVariantId,
}: ProductTemplateProps) {
  return (
    <ProductProvider product={product} initialVariantId={initialVariantId}>
      <ProductJsonLd product={product} countryCode={countryCode} />

      <div
        className="content-container py-6 lg:py-12"
        data-testid="product-container"
      >
        <nav aria-label="Breadcrumb" className="mb-4 lg:mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <li>
              <LocalizedLink href="/store" className="transition-colors hover:text-foreground">
                Shop
              </LocalizedLink>
            </li>
            {product.collection && (
              <li className="flex items-center gap-1.5">
                <span aria-hidden>/</span>
                <LocalizedLink
                  href={`/collections/${product.collection.handle}`}
                  className="transition-colors hover:text-foreground"
                >
                  {product.collection.title}
                </LocalizedLink>
              </li>
            )}
            <li className="flex items-center gap-1.5">
              <span aria-hidden>/</span>
              <span aria-current="page" className="text-foreground">
                {product.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="-mx-4 sm:mx-0 lg:col-span-7">
            <ProductGalleryIsland title={product.title} />
          </div>

          <div className="lg:col-span-5">
            <div className="space-y-8 lg:sticky lg:top-[calc(var(--header-height)+var(--announcement-height)+2rem)]">
              <header className="space-y-2">
                {product.collection && (
                  <LocalizedLink
                    href={`/collections/${product.collection.handle}`}
                    className="eyebrow hover:text-foreground"
                  >
                    {product.collection.title}
                  </LocalizedLink>
                )}
                <h1
                  className="text-3xl font-medium sm:text-4xl"
                  data-testid="product-title"
                >
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="text-muted-foreground">{product.subtitle}</p>
                )}
              </header>

              <ProductActions />

              <ProductDetails product={product} />
            </div>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="content-container py-16 lg:py-24">
            <ProductGridSkeleton count={4} columns={4} />
          </div>
        }
      >
        <RelatedProducts product={product} countryCode={countryCode} />
      </Suspense>

      {storeConfig.features.recentlyViewed && (
        <RecentlyViewed
          currentProduct={{
            id: product.id,
            handle: product.handle,
            title: product.title,
            thumbnail: product.thumbnail ?? null,
          }}
        />
      )}
    </ProductProvider>
  )
}
