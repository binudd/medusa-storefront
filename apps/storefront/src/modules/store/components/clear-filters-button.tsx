"use client"

import { Button } from "@/components/ui/button"

import { useListingParams } from "../hooks/use-listing-params"

export function ClearFiltersButton() {
  const { clearFilters } = useListingParams()
  return (
    <Button variant="outline" onClick={clearFilters}>
      Clear filters
    </Button>
  )
}
