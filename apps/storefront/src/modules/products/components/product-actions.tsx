"use client"

import { useParams } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { useAddToCart } from "@lib/queries/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { getProductPrice } from "@lib/util/get-product-price"
import { isVariantInStock } from "@lib/util/product"
import { storeConfig } from "@/config"
import { useCartUiStore } from "@/store/cart-ui.store"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/commerce/price"
import { QuantitySelector } from "@/components/commerce/quantity-selector"
import { VariantSelector } from "@/components/commerce/variant-selector"
import { ErrorMessage } from "@/components/common/error-message"

import { useProductContext } from "../context/product-context"
import { StickyAddToCart } from "./sticky-add-to-cart"

/**
 * Purchase panel: variant options, price, quantity and add-to-cart. The
 * sticky mobile bar mirrors the primary action once it scrolls out of view.
 */
export function ProductActions() {
  const { product, selection, setOption, selectedVariant, isComplete, isValueAvailable } =
    useProductContext()
  const { countryCode } = useParams<{ countryCode: string }>()
  const openDrawer = useCartUiStore((s) => s.openDrawer)
  const [quantity, setQuantity] = React.useState(1)
  const [error, setError] = React.useState<string | null>(null)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const panelInView = useIntersection(panelRef, "-80px")

  const addToCart = useAddToCart({
    onSuccess: () => {
      setError(null)
      toast.success("Added to bag", {
        description: product.title,
        action: { label: "View bag", onClick: openDrawer },
      })
      openDrawer()
    },
    onError: (err) => {
      setError(err.message || "We couldn't add this item. Please try again.")
    },
  })

  const inStock = isVariantInStock(selectedVariant)
  const hasOptions = (product.variants?.length ?? 0) > 1
  const { variantPrice, cheapestPrice } = getProductPrice({
    product,
    variantId: selectedVariant?.id,
  })
  const price = variantPrice ?? cheapestPrice

  const maxQuantity = React.useMemo(() => {
    const cap = storeConfig.product.maxQuantity
    if (!selectedVariant?.manage_inventory || selectedVariant.allow_backorder) {
      return cap
    }
    return Math.max(1, Math.min(cap, selectedVariant.inventory_quantity ?? 0))
  }, [selectedVariant])

  React.useEffect(() => {
    setQuantity((q) => Math.min(q, maxQuantity))
  }, [maxQuantity])

  const label = !isComplete
    ? hasOptions
      ? "Select options"
      : "Unavailable"
    : !inStock
      ? "Out of stock"
      : "Add to bag"

  const disabled = !isComplete || !inStock || addToCart.isPending

  const handleAdd = () => {
    if (!selectedVariant?.id) return
    addToCart.mutate({ variantId: selectedVariant.id, quantity, countryCode })
  }

  return (
    <>
      <div ref={panelRef} className="space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <Price
            price={price}
            from={!isComplete && (product.variants?.length ?? 0) > 1}
            size="lg"
            showDiscountPercent
          />
          {selectedVariant && (
            <p
              className="text-sm text-muted-foreground"
              aria-live="polite"
              data-testid="stock-status"
            >
              {inStock ? "In stock" : "Out of stock"}
            </p>
          )}
        </div>

        {hasOptions && (
          <VariantSelector
            options={product.options ?? []}
            selection={selection}
            onSelect={setOption}
            isValueAvailable={isValueAvailable}
            disabled={addToCart.isPending}
          />
        )}

        <div className="flex gap-3">
          <QuantitySelector
            value={quantity}
            onChange={setQuantity}
            min={1}
            max={maxQuantity}
            disabled={disabled}
            label="Quantity"
          />
          <Button
            size="lg"
            className="flex-1"
            onClick={handleAdd}
            disabled={disabled}
            isLoading={addToCart.isPending}
            data-testid="add-product-button"
          >
            {label}
          </Button>
        </div>

        <ErrorMessage error={error} data-testid="add-to-cart-error" />
      </div>

      <StickyAddToCart
        show={!panelInView}
        price={price}
        label={label}
        disabled={disabled}
        isLoading={addToCart.isPending}
        onAdd={handleAdd}
        onSelectOptions={() =>
          panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
        needsSelection={!isComplete && hasOptions}
      />
    </>
  )
}
