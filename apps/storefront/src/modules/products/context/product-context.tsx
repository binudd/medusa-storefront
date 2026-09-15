"use client"

import { HttpTypes } from "@medusajs/types"
import * as React from "react"

import { imagesForVariant, variantOptionsMap } from "@lib/util/product"
import { shallowEqual } from "@/lib/utils"

type Selection = Record<string, string | undefined>

type ProductContextValue = {
  product: HttpTypes.StoreProduct
  selection: Selection
  setOption: (optionId: string, value: string) => void
  selectedVariant: HttpTypes.StoreProductVariant | undefined
  /** Whether every option has a value and it maps to a real variant. */
  isComplete: boolean
  images: HttpTypes.StoreProductImage[]
  /** Option values that would produce a purchasable variant given the rest of the selection. */
  isValueAvailable: (optionId: string, value: string) => boolean
}

const ProductContext = React.createContext<ProductContextValue | null>(null)

const VARIANT_PARAM = "v_id"

/**
 * Holds variant selection for the PDP so the gallery, purchase panel and
 * sticky bar stay in sync without server round-trips. The selected variant
 * id is mirrored to `?v_id=` via `history.replaceState` for shareable links.
 */
export function ProductProvider({
  product,
  initialVariantId,
  children,
}: {
  product: HttpTypes.StoreProduct
  initialVariantId?: string
  children: React.ReactNode
}) {
  const variants = React.useMemo(() => product.variants ?? [], [product])

  const [selection, setSelection] = React.useState<Selection>(() => {
    const initial =
      variants.find((v) => v.id === initialVariantId) ??
      (variants.length === 1 ? variants[0] : undefined)
    return initial ? variantOptionsMap(initial) : {}
  })

  const selectedVariant = React.useMemo(
    () => variants.find((v) => shallowEqual(variantOptionsMap(v), selection)),
    [variants, selection]
  )

  const isComplete = !!selectedVariant

  const setOption = React.useCallback((optionId: string, value: string) => {
    setSelection((prev) => ({ ...prev, [optionId]: value }))
  }, [])

  const isValueAvailable = React.useCallback(
    (optionId: string, value: string) => {
      const candidate = { ...selection, [optionId]: value }
      const others = Object.entries(candidate).filter(
        ([, v]) => v !== undefined
      )
      return variants.some((v) => {
        const map = variantOptionsMap(v)
        return others.every(([id, val]) => map[id] === val)
      })
    },
    [variants, selection]
  )

  // Mirror selection to the URL without triggering a navigation.
  React.useEffect(() => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.href)
    const current = url.searchParams.get(VARIANT_PARAM)
    const next = selectedVariant?.id ?? null
    if (current === next) return
    if (next) url.searchParams.set(VARIANT_PARAM, next)
    else url.searchParams.delete(VARIANT_PARAM)
    window.history.replaceState(window.history.state, "", url)
  }, [selectedVariant?.id])

  const images = React.useMemo(
    () => imagesForVariant(product, selectedVariant),
    [product, selectedVariant]
  )

  const value = React.useMemo<ProductContextValue>(
    () => ({
      product,
      selection,
      setOption,
      selectedVariant,
      isComplete,
      images,
      isValueAvailable,
    }),
    [product, selection, setOption, selectedVariant, isComplete, images, isValueAvailable]
  )

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  )
}

export function useProductContext() {
  const ctx = React.useContext(ProductContext)
  if (!ctx) {
    throw new Error("useProductContext must be used within <ProductProvider>")
  }
  return ctx
}
