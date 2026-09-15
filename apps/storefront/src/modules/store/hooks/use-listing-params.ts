"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import {
  OPTION_VALUE_QUERY_KEY,
  parseListingParams,
} from "@lib/util/product-option-filters"

type Patch = {
  sortBy?: string | null
  minPrice?: number | null
  maxPrice?: number | null
  inStock?: boolean | null
  optionValueIds?: string[] | null
  page?: number | null
  q?: string | null
}

/**
 * Single source of truth for listing filters: the URL. Components read the
 * parsed params and write patches; any filter change resets pagination.
 */
export function useListingParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()

  const params = React.useMemo(
    () => parseListingParams(searchParams),
    [searchParams]
  )

  const update = React.useCallback(
    (patch: Patch, { keepPage = false }: { keepPage?: boolean } = {}) => {
      const next = new URLSearchParams(searchParams.toString())

      const setOrDelete = (key: string, value: string | null | undefined) => {
        if (value === null || value === undefined || value === "") {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      }

      if ("sortBy" in patch) setOrDelete("sortBy", patch.sortBy)
      if ("q" in patch) setOrDelete("q", patch.q)
      if ("minPrice" in patch)
        setOrDelete(
          "minPrice",
          patch.minPrice === null || patch.minPrice === undefined
            ? null
            : String(patch.minPrice)
        )
      if ("maxPrice" in patch)
        setOrDelete(
          "maxPrice",
          patch.maxPrice === null || patch.maxPrice === undefined
            ? null
            : String(patch.maxPrice)
        )
      if ("inStock" in patch) setOrDelete("inStock", patch.inStock ? "1" : null)
      if ("optionValueIds" in patch) {
        next.delete(OPTION_VALUE_QUERY_KEY)
        patch.optionValueIds?.forEach((id) =>
          next.append(OPTION_VALUE_QUERY_KEY, id)
        )
      }
      if ("page" in patch) {
        setOrDelete(
          "page",
          patch.page && patch.page > 1 ? String(patch.page) : null
        )
      } else if (!keepPage) {
        next.delete("page")
      }

      const query = next.toString()
      const href = query ? `${pathname}?${query}` : pathname
      const current = searchParams.toString()
      const currentHref = current ? `${pathname}?${current}` : pathname

      if (href !== currentHref) {
        startTransition(() => {
          router.push(href, { scroll: "page" in patch })
        })
      }
    },
    [pathname, router, searchParams]
  )

  const clearFilters = React.useCallback(() => {
    update({
      minPrice: null,
      maxPrice: null,
      inStock: null,
      optionValueIds: null,
    })
  }, [update])

  const activeFilterCount =
    params.optionValueIds.length +
    (params.inStock ? 1 : 0) +
    (params.minPrice !== undefined || params.maxPrice !== undefined ? 1 : 0)

  return { params, update, clearFilters, activeFilterCount, isPending }
}
