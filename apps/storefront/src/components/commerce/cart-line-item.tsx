"use client"

import { HttpTypes } from "@medusajs/types"
import { Trash2 } from "lucide-react"
import * as React from "react"

import { convertToLocale } from "@lib/util/money"
import { useDeleteLineItem, useUpdateLineItem } from "@lib/queries/cart"
import { storeConfig } from "@/config"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/common/localized-link"
import { toast } from "@/components/ui/sonner"

import { ProductImage } from "./product-image"
import { QuantitySelector } from "./quantity-selector"

type CartLineItemProps = {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
  variant?: "full" | "compact"
  onNavigate?: () => void
}

function optionsLabel(variant?: HttpTypes.StoreProductVariant | null) {
  const values = variant?.options?.map((o) => o.value).filter(Boolean)
  return values?.length ? values.join(" / ") : variant?.title ?? null
}

/**
 * A single cart line. Quantity changes and removals are optimistic and roll
 * back on failure (see `useUpdateLineItem` / `useDeleteLineItem`).
 */
export function CartLineItem({
  item,
  currencyCode,
  variant = "full",
  onNavigate,
}: CartLineItemProps) {
  const onError = React.useCallback((error: Error) => {
    toast.error("Could not update your cart", { description: error.message })
  }, [])

  const update = useUpdateLineItem({ onError })
  const remove = useDeleteLineItem({ onError })

  const busy = update.isPending || remove.isPending
  const compact = variant === "compact"

  const hasDiscount = (item.total ?? 0) < (item.original_total ?? 0)
  const unit = (item.total ?? 0) / Math.max(item.quantity, 1)

  const maxQuantity = item.variant?.manage_inventory && !item.variant.allow_backorder
    ? Math.max(1, Math.min(storeConfig.product.maxQuantity, item.variant.inventory_quantity ?? storeConfig.product.maxQuantity))
    : storeConfig.product.maxQuantity

  return (
    <div
      className={cn(
        "grid gap-4",
        compact ? "grid-cols-[72px_1fr]" : "grid-cols-[96px_1fr] sm:grid-cols-[120px_1fr]",
        busy && "opacity-70"
      )}
      data-testid="cart-item"
      aria-busy={busy}
    >
      <LocalizedLink
        href={`/products/${item.product_handle}`}
        onClick={onNavigate}
        className="block"
        tabIndex={-1}
        aria-hidden
      >
        <ProductImage
          src={item.thumbnail ?? item.variant?.product?.thumbnail}
          alt={item.product_title ?? item.title}
          sizes="120px"
          className="rounded-md"
        />
      </LocalizedLink>

      <div className="flex min-w-0 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <LocalizedLink
              href={`/products/${item.product_handle}`}
              onClick={onNavigate}
              className="line-clamp-2 text-sm font-medium hover:underline"
              data-testid="product-title"
            >
              {item.product_title ?? item.title}
            </LocalizedLink>
            {optionsLabel(item.variant) && (
              <p
                className="mt-0.5 text-xs text-muted-foreground"
                data-testid="cart-item-variant"
              >
                {optionsLabel(item.variant)}
              </p>
            )}
            {!compact && (
              <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                {convertToLocale({ amount: unit, currency_code: currencyCode })}{" "}
                each
              </p>
            )}
          </div>
          <div className="shrink-0 text-right text-sm tabular-nums">
            <div
              className={cn("font-medium", hasDiscount && "text-sale")}
              data-testid="product-price"
            >
              {convertToLocale({
                amount: item.total ?? 0,
                currency_code: currencyCode,
              })}
            </div>
            {hasDiscount && (
              <div className="text-xs text-muted-foreground line-through">
                {convertToLocale({
                  amount: item.original_total ?? 0,
                  currency_code: currencyCode,
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            max={maxQuantity}
            disabled={busy}
            onChange={(quantity) =>
              update.mutate({ lineId: item.id, quantity })
            }
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-destructive"
            disabled={busy}
            onClick={() => remove.mutate({ lineId: item.id })}
            aria-label={`Remove ${item.product_title ?? item.title} from cart`}
            data-testid="cart-item-remove-button"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  )
}
