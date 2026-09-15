"use client"

import {
  listProductOptions,
  listProductsByIds,
  searchProducts,
} from "@lib/data/products"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { queryKeys } from "./keys"

/**
 * Product options (Size, Color, ...) used to build listing filters. Rarely
 * changes, so it is cached for the session.
 */
export function useProductOptions(enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.options(),
    queryFn: () => listProductOptions(),
    staleTime: 10 * 60 * 1000,
    enabled,
  })
}

/**
 * Region-priced products for a known set of ids (recently viewed, wishlist).
 * Results keep the requested order.
 */
export function useProductsByIds({
  ids,
  countryCode,
}: {
  ids: string[]
  countryCode: string
}) {
  return useQuery({
    queryKey: queryKeys.products.byIds(countryCode, ids),
    queryFn: () => listProductsByIds({ ids, countryCode }),
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Debounced product search. Pass an already-debounced `q`; the hook skips
 * requests for empty queries and keeps the previous results while typing.
 */
export function useProductSearch({
  q,
  countryCode,
  limit = 8,
  enabled = true,
}: {
  q: string
  countryCode: string
  limit?: number
  enabled?: boolean
}) {
  const trimmed = q.trim()
  return useQuery({
    queryKey: queryKeys.products.search(countryCode, trimmed, limit),
    queryFn: () => searchProducts({ q: trimmed, countryCode, limit }),
    enabled: enabled && trimmed.length > 1,
    placeholderData: keepPreviousData,
    staleTime: 2 * 60 * 1000,
  })
}
