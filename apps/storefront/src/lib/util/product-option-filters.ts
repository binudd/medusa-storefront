export const OPTION_VALUE_QUERY_KEY = "optionValueIds"

export type OptionValueIds = string[]

type SearchParamsLike =
  | URLSearchParams
  | Record<string, string | string[] | undefined>

function isURLSearchParams(value: SearchParamsLike): value is URLSearchParams {
  return typeof (value as URLSearchParams).getAll === "function"
}

export const parseOptionValueIds = (
  searchParams: SearchParamsLike
): OptionValueIds => {
  if (isURLSearchParams(searchParams)) {
    const values = searchParams.getAll(OPTION_VALUE_QUERY_KEY)
    return Array.from(new Set(values.filter(Boolean)))
  }

  const paramValue = searchParams[OPTION_VALUE_QUERY_KEY]

  if (Array.isArray(paramValue)) {
    return Array.from(new Set(paramValue.filter(Boolean)))
  }

  if (typeof paramValue === "string" && paramValue.length > 0) {
    return paramValue.split(",").filter(Boolean)
  }

  return []
}

/**
 * Parses listing-page filter params from either server `searchParams` or a
 * client `URLSearchParams` instance so both sides share one definition.
 */
export function parseListingParams(searchParams: SearchParamsLike) {
  const get = (key: string): string | undefined => {
    if (isURLSearchParams(searchParams)) {
      return searchParams.get(key) ?? undefined
    }
    const value = searchParams[key]
    return Array.isArray(value) ? value[0] : value
  }

  const toNumber = (value?: string) => {
    if (value === undefined || value === "") return undefined
    const n = Number(value)
    return Number.isFinite(n) ? n : undefined
  }

  return {
    page: Math.max(1, toNumber(get("page")) ?? 1),
    sortBy: get("sortBy"),
    minPrice: toNumber(get("minPrice")),
    maxPrice: toNumber(get("maxPrice")),
    inStock: get("inStock") === "1",
    optionValueIds: parseOptionValueIds(searchParams),
    q: get("q"),
  }
}
