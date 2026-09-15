"use client"

import * as React from "react"

import { useProductOptions } from "@lib/queries/products"
import { convertToLocale } from "@lib/util/money"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"

import { useListingParams } from "../hooks/use-listing-params"

type ProductFiltersProps = {
  priceRange: { min: number; max: number } | null
  currencyCode: string
  /** Hide option filters (e.g. on collection pages where they rarely apply). */
  showOptions?: boolean
  className?: string
}

/**
 * Filter panel. Rendered in a sidebar on desktop and inside a Sheet on
 * mobile; both share this component and the URL as state.
 */
export function ProductFilters({
  priceRange,
  currencyCode,
  showOptions = true,
  className,
}: ProductFiltersProps) {
  const { params, update, clearFilters, activeFilterCount } = useListingParams()
  const { data: options, isPending: optionsPending } =
    useProductOptions(showOptions)

  const defaultOpen = [
    "availability",
    "price",
    ...(options?.map((o) => o.id) ?? []),
  ]

  return (
    <div className={cn("space-y-1", className)} data-testid="product-filters">
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-medium">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1.5 text-muted-foreground">
              ({activeFilterCount})
            </span>
          )}
        </p>
        {activeFilterCount > 0 && (
          <Button variant="link" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={defaultOpen}>
        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-3">
              <Checkbox
                id="filter-in-stock"
                checked={params.inStock}
                onCheckedChange={(checked) =>
                  update({ inStock: checked === true })
                }
              />
              <Label htmlFor="filter-in-stock" className="font-normal">
                In stock only
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>

        {priceRange && priceRange.max > priceRange.min && (
          <AccordionItem value="price">
            <AccordionTrigger>Price</AccordionTrigger>
            <AccordionContent>
              <PriceFilter
                bounds={priceRange}
                value={[
                  params.minPrice ?? priceRange.min,
                  params.maxPrice ?? priceRange.max,
                ]}
                currencyCode={currencyCode}
                onCommit={([min, max]) =>
                  update({
                    minPrice: min > priceRange.min ? min : null,
                    maxPrice: max < priceRange.max ? max : null,
                  })
                }
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {showOptions && optionsPending && (
          <div className="space-y-3 py-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}

        {showOptions &&
          options?.map((option) => {
            const values = (option.values ?? []).filter(
              (v): v is typeof v & { id: string; value: string } =>
                !!v.id && !!v.value
            )
            if (!values.length) return null
            const selectedCount = values.filter((v) =>
              params.optionValueIds.includes(v.id)
            ).length

            return (
              <AccordionItem key={option.id} value={option.id}>
                <AccordionTrigger>
                  <span>
                    {option.title}
                    {selectedCount > 0 && (
                      <span className="ml-1.5 text-muted-foreground">
                        ({selectedCount})
                      </span>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {values.map((value) => {
                      const selected = params.optionValueIds.includes(value.id)
                      return (
                        <button
                          key={value.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            update({
                              optionValueIds: selected
                                ? params.optionValueIds.filter(
                                    (id) => id !== value.id
                                  )
                                : [...params.optionValueIds, value.id],
                            })
                          }
                          className={cn(
                            "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm transition-colors duration-fast",
                            selected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-input bg-card text-foreground hover:border-foreground/60"
                          )}
                        >
                          {value.value}
                        </button>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
      </Accordion>
    </div>
  )
}

function PriceFilter({
  bounds,
  value,
  currencyCode,
  onCommit,
}: {
  bounds: { min: number; max: number }
  value: [number, number]
  currencyCode: string
  onCommit: (value: [number, number]) => void
}) {
  const [local, setLocal] = React.useState<[number, number]>(value)

  React.useEffect(() => {
    setLocal(value)
  }, [value])

  const fmt = (amount: number) =>
    convertToLocale({
      amount,
      currency_code: currencyCode,
      maximumFractionDigits: 0,
    })

  return (
    <div className="space-y-3 px-1">
      <Slider
        min={bounds.min}
        max={bounds.max}
        step={1}
        value={local}
        minStepsBetweenThumbs={1}
        thumbLabels={["Minimum price", "Maximum price"]}
        onValueChange={(v) => setLocal([v[0], v[1]])}
        onValueCommit={(v) => onCommit([v[0], v[1]])}
      />
      <div className="flex items-center justify-between text-sm tabular-nums">
        <span>{fmt(local[0])}</span>
        <span>{fmt(local[1])}</span>
      </div>
    </div>
  )
}
