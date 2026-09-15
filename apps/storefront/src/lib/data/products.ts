"use server"

import { sdk } from "@lib/config"
import { OptionValueIds } from "@lib/util/product-option-filters"
import {
  getMinPrice,
  isProductInStock,
  sortProducts,
  SortOptions,
} from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

type ProductListQueryParams = (HttpTypes.FindParams &
  HttpTypes.StoreProductListParams) & {
  options?: string[]
  option_value_id?: string | string[]
}

const PRODUCT_LIST_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: ProductListQueryParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields: PRODUCT_LIST_FIELDS,
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

export type ProductFilters = {
  /** Minimum price in major currency units (e.g. 10 = 10.00). */
  minPrice?: number
  /** Maximum price in major currency units. */
  maxPrice?: number
  /** Only include products with at least one purchasable variant. */
  inStock?: boolean
}

/**
 * Fetches up to 100 products into the Next.js cache, then filters, sorts and
 * paginates them in memory. The store API does not yet support price sorting
 * or price/availability filtering, so this is done here in one place.
 */
export const listProductsWithSort = async ({
  page = 1,
  queryParams,
  sortBy = "created_at",
  countryCode,
  optionValueIds,
  filters,
}: {
  page?: number
  queryParams?: ProductListQueryParams
  sortBy?: SortOptions
  countryCode: string
  optionValueIds?: OptionValueIds
  filters?: ProductFilters
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: ProductListQueryParams
  /** Min/max price across the unfiltered result set, for filter UI bounds. */
  priceRange: { min: number; max: number } | null
}> => {
  const limit = queryParams?.limit || 12
  const optionFilters = Array.from(
    new Set((optionValueIds || []).filter(Boolean))
  )

  const {
    response: { products },
  } = await listProducts({
    pageParam: 1,
    queryParams: {
      ...queryParams,
      ...(optionFilters.length ? { option_value_id: optionFilters } : {}),
      limit: 100,
    },
    countryCode,
  })

  const prices = products
    .map(getMinPrice)
    .filter((p): p is number => p !== null)
  const priceRange = prices.length
    ? { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
    : null

  const filtered = products.filter((product) => {
    if (filters?.inStock && !isProductInStock(product)) return false

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      const price = getMinPrice(product)
      if (price === null) return false
      if (filters.minPrice !== undefined && price < filters.minPrice)
        return false
      if (filters.maxPrice !== undefined && price > filters.maxPrice)
        return false
    }

    return true
  })

  const sortedProducts = sortProducts(filtered, sortBy)

  const safePage = Math.max(page, 1)
  const offset = (safePage - 1) * limit
  const filteredCount = sortedProducts.length
  const nextPage = filteredCount > offset + limit ? safePage + 1 : null
  const paginatedProducts = sortedProducts.slice(offset, offset + limit)

  return {
    response: {
      products: paginatedProducts,
      count: filteredCount,
    },
    nextPage,
    queryParams,
    priceRange,
  }
}

/**
 * Product options (e.g. Size, Color) with their values, used to build filters.
 */
export const listProductOptions = async (): Promise<
  HttpTypes.StoreProductOption[]
> => {
  const next = {
    ...(await getCacheOptions("product_options")),
  }

  return sdk.client
    .fetch<{ product_options?: HttpTypes.StoreProductOption[] }>(
      "/store/product-options",
      {
        method: "GET",
        query: {
          is_exclusive: false,
          fields: "*values",
        },
        next,
        cache: "force-cache",
      }
    )
    .then((res) => res.product_options ?? [])
    .catch(() => [])
}

/**
 * Full-text search across products for the given region.
 */
export const searchProducts = async ({
  q,
  countryCode,
  limit = 8,
  page = 1,
}: {
  q: string
  countryCode: string
  limit?: number
  page?: number
}): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> => {
  const query = q.trim()
  if (!query) {
    return { products: [], count: 0 }
  }

  const { response } = await listProducts({
    pageParam: page,
    countryCode,
    queryParams: { q: query, limit },
  })

  return response
}

/**
 * Region-priced products for a set of ids, returned in the requested order.
 */
export const listProductsByIds = async ({
  ids,
  countryCode,
}: {
  ids: string[]
  countryCode: string
}): Promise<HttpTypes.StoreProduct[]> => {
  if (!ids.length) return []

  const { response } = await listProducts({
    countryCode,
    queryParams: { id: ids, limit: ids.length },
  })

  const byId = new Map(response.products.map((p) => [p.id, p]))
  return ids
    .map((id) => byId.get(id))
    .filter((p): p is HttpTypes.StoreProduct => Boolean(p))
}
