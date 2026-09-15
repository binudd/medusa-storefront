"use client"

import type { VariantPrice } from "@/types/global"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Price } from "@/components/commerce/price"

import { useProductContext } from "../context/product-context"

type StickyAddToCartProps = {
  show: boolean
  price: VariantPrice | null | undefined
  label: string
  disabled: boolean
  isLoading: boolean
  needsSelection: boolean
  onAdd: () => void
  onSelectOptions: () => void
}

/**
 * Bottom bar on small screens that appears once the main purchase panel has
 * scrolled away. When options are incomplete it scrolls back to the panel.
 */
export function StickyAddToCart({
  show,
  price,
  label,
  disabled,
  isLoading,
  needsSelection,
  onAdd,
  onSelectOptions,
}: StickyAddToCartProps) {
  const { product } = useProductContext()

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 pb-safe backdrop-blur transition-transform duration-normal ease-out lg:hidden",
        show ? "translate-y-0" : "translate-y-full"
      )}
      aria-hidden={!show}
      data-testid="mobile-actions"
    >
      <div className="content-container flex items-center gap-3 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" data-testid="mobile-title">
            {product.title}
          </p>
          <Price price={price} size="sm" />
        </div>
        <Button
          size="lg"
          className="min-w-[140px]"
          onClick={needsSelection ? onSelectOptions : onAdd}
          disabled={needsSelection ? false : disabled}
          isLoading={isLoading}
          tabIndex={show ? 0 : -1}
          data-testid="mobile-cart-button"
        >
          {label}
        </Button>
      </div>
    </div>
  )
}
