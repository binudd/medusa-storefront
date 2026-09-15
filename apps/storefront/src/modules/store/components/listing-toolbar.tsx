"use client"

import { SlidersHorizontal } from "lucide-react"

import { isSortOption, SORT_OPTIONS, SortOptions } from "@lib/util/sort-products"
import { storeConfig } from "@/config"
import { useUiStore } from "@/store/ui.store"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { useListingParams } from "../hooks/use-listing-params"
import { ProductFilters } from "./product-filters"

type ListingToolbarProps = {
  count: number
  priceRange: { min: number; max: number } | null
  currencyCode: string
  showOptions?: boolean
}

/**
 * Result count, sort select and (below `lg`) the filter sheet trigger.
 */
export function ListingToolbar({
  count,
  priceRange,
  currencyCode,
  showOptions = true,
}: ListingToolbarProps) {
  const { params, update, activeFilterCount, isPending } = useListingParams()
  const filtersOpen = useUiStore((s) => s.filtersOpen)
  const setFiltersOpen = useUiStore((s) => s.setFiltersOpen)

  const sort: SortOptions = isSortOption(params.sortBy)
    ? params.sortBy
    : storeConfig.catalog.defaultSort

  return (
    <div className="flex items-center justify-between gap-3">
      <p
        className="text-sm text-muted-foreground"
        aria-live="polite"
        aria-busy={isPending}
        data-testid="result-count"
      >
        {count} {count === 1 ? "product" : "products"}
      </p>

      <div className="flex items-center gap-2">
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setFiltersOpen(true)}
            data-testid="mobile-filters-button"
          >
            <SlidersHorizontal />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 rounded-full bg-primary px-1.5 text-2xs text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <SheetContent side="bottom" className="max-h-[85dvh] p-0">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription className="sr-only">
                Refine the product list
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-5 py-3">
              <ProductFilters
                priceRange={priceRange}
                currencyCode={currencyCode}
                showOptions={showOptions}
              />
            </div>
            <SheetFooter>
              <Button
                size="lg"
                className="w-full"
                onClick={() => setFiltersOpen(false)}
              >
                Show {count} {count === 1 ? "product" : "products"}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <Select
          value={sort}
          onValueChange={(value) => update({ sortBy: value })}
        >
          <SelectTrigger
            className="h-9 w-auto min-w-[160px] gap-2 text-sm"
            aria-label="Sort products"
            data-testid="sort-by-select"
          >
            <span className="text-muted-foreground">Sort:</span>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
