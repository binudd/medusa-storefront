import { SearchX } from "lucide-react"

import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { parseListingParams } from "@lib/util/product-option-filters"
import { isSortOption } from "@lib/util/sort-products"
import { storeConfig } from "@/config"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/common/empty-state"
import { LocalizedLink } from "@/components/common/localized-link"
import { ProductGrid } from "@/components/commerce/product-grid"

import { ClearFiltersButton } from "../components/clear-filters-button"
import { ListingToolbar } from "../components/listing-toolbar"
import { Pagination } from "../components/pagination"
import { ProductFilters } from "../components/product-filters"

export type Breadcrumb = { label: string; href?: string }

type ProductListingProps = {
  countryCode: string
  searchParams: Record<string, string | string[] | undefined>
  title: string
  description?: string | null
  breadcrumbs?: Breadcrumb[]
  collectionId?: string
  categoryId?: string
  /** Full-text query (search page). */
  q?: string
  /** Child categories to surface as quick links. */
  childLinks?: { label: string; href: string }[]
  showOptionFilters?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

/**
 * Shared product listing used by /store, /collections/[handle],
 * /categories/[...category] and /search. Reads filters from the URL, fetches
 * region-priced products server-side and renders the grid with client-side
 * filter controls.
 */
export async function ProductListing({
  countryCode,
  searchParams,
  title,
  description,
  breadcrumbs,
  collectionId,
  categoryId,
  q,
  childLinks,
  showOptionFilters = true,
  emptyTitle = "No products found",
  emptyDescription = "Try adjusting your filters or browse the full range.",
}: ProductListingProps) {
  const region = await getRegion(countryCode)
  if (!region) return null

  const parsed = parseListingParams(searchParams)
  const sortBy = isSortOption(parsed.sortBy)
    ? parsed.sortBy
    : storeConfig.catalog.defaultSort
  const limit = storeConfig.catalog.pageSize

  const { response, priceRange } = await listProductsWithSort({
    page: parsed.page,
    countryCode,
    sortBy,
    optionValueIds: parsed.optionValueIds,
    filters: {
      minPrice: parsed.minPrice,
      maxPrice: parsed.maxPrice,
      inStock: parsed.inStock,
    },
    queryParams: {
      limit,
      ...(collectionId ? { collection_id: [collectionId] } : {}),
      ...(categoryId ? { category_id: [categoryId] } : {}),
      ...(q ? { q } : {}),
    },
  }).catch(() => ({
    response: { products: [], count: 0 },
    priceRange: null,
  }))

  const totalPages = Math.ceil(response.count / limit)
  const hasFilters =
    parsed.optionValueIds.length > 0 ||
    parsed.inStock ||
    parsed.minPrice !== undefined ||
    parsed.maxPrice !== undefined

  return (
    <div className="content-container py-8 lg:py-12" data-testid="category-container">
      <header className="mb-8 max-w-2xl space-y-3">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {breadcrumbs.map((crumb, i) => (
                <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
                  {crumb.href ? (
                    <LocalizedLink
                      href={crumb.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {crumb.label}
                    </LocalizedLink>
                  ) : (
                    <span aria-current="page" className="text-foreground">
                      {crumb.label}
                    </span>
                  )}
                  {i < breadcrumbs.length - 1 && <span aria-hidden>/</span>}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1
          className="text-3xl font-medium sm:text-4xl"
          data-testid="store-page-title"
        >
          {title}
        </h1>
        {description && (
          <p className="text-base text-muted-foreground">{description}</p>
        )}
        {childLinks && childLinks.length > 0 && (
          <ul className="flex flex-wrap gap-2 pt-1">
            {childLinks.map((link) => (
              <li key={`${link.label}:${link.href}`}>
                <Button asChild variant="outline" size="sm">
                  <LocalizedLink href={link.href}>{link.label}</LocalizedLink>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-[calc(var(--header-height)+var(--announcement-height)+1.5rem)]">
            <ProductFilters
              priceRange={priceRange}
              currencyCode={region.currency_code}
              showOptions={showOptionFilters}
            />
          </div>
        </aside>

        <section aria-label="Products" className="min-w-0">
          <ListingToolbar
            count={response.count}
            priceRange={priceRange}
            currencyCode={region.currency_code}
            showOptions={showOptionFilters}
          />
          <div className="mt-6">
            {response.products.length > 0 ? (
              <>
                <ProductGrid
                  products={response.products}
                  columns={4}
                  priorityCount={4}
                />
                <Pagination
                  page={parsed.page}
                  totalPages={totalPages}
                  data-testid="product-pagination"
                />
              </>
            ) : (
              <EmptyState
                icon={<SearchX />}
                title={emptyTitle}
                description={emptyDescription}
                action={
                  hasFilters ? (
                    <ClearFiltersButton />
                  ) : (
                    <Button asChild variant="outline">
                      <LocalizedLink href="/store">Browse all products</LocalizedLink>
                    </Button>
                  )
                }
              />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
