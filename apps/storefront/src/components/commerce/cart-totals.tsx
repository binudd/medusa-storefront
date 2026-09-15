import { convertToLocale } from "@lib/util/money"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

type Totals = {
  total?: number | null
  subtotal?: number | null
  tax_total?: number | null
  currency_code: string
  item_subtotal?: number | null
  shipping_subtotal?: number | null
  discount_subtotal?: number | null
}

type CartTotalsProps = {
  totals: Totals
  className?: string
  /** Hide shipping/tax rows for the compact drawer view. */
  compact?: boolean
}

export function CartTotals({ totals, className, compact }: CartTotalsProps) {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  const fmt = (amount?: number | null) =>
    convertToLocale({ amount: amount ?? 0, currency_code })

  return (
    <div className={cn("text-sm", className)}>
      {!compact && (
        <dl className="space-y-2 text-muted-foreground">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd
              className="tabular-nums text-foreground"
              data-testid="cart-subtotal"
              data-value={item_subtotal || 0}
            >
              {fmt(item_subtotal)}
            </dd>
          </div>
          {!!discount_subtotal && (
            <div className="flex items-center justify-between">
              <dt>Discount</dt>
              <dd
                className="tabular-nums text-success"
                data-testid="cart-discount"
                data-value={discount_subtotal || 0}
              >
                -{fmt(discount_subtotal)}
              </dd>
            </div>
          )}
          <div className="flex items-center justify-between">
            <dt>Shipping</dt>
            <dd
              className="tabular-nums text-foreground"
              data-testid="cart-shipping"
              data-value={shipping_subtotal || 0}
            >
              {shipping_subtotal ? fmt(shipping_subtotal) : "Calculated at checkout"}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>Taxes</dt>
            <dd
              className="tabular-nums text-foreground"
              data-testid="cart-taxes"
              data-value={tax_total || 0}
            >
              {fmt(tax_total)}
            </dd>
          </div>
        </dl>
      )}
      {compact && !!discount_subtotal && (
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Discount</span>
          <span className="tabular-nums text-success">-{fmt(discount_subtotal)}</span>
        </div>
      )}
      {!compact && <Separator className="my-4" />}
      <div className="flex items-baseline justify-between">
        <span className="font-medium">{compact ? "Subtotal" : "Total"}</span>
        <span
          className="text-lg font-medium tabular-nums"
          data-testid="cart-total"
          data-value={(compact ? item_subtotal : total) || 0}
        >
          {compact ? fmt(item_subtotal) : fmt(total)}
        </span>
      </div>
      {compact && (
        <p className="mt-1 text-xs text-muted-foreground">
          Shipping and taxes calculated at checkout.
        </p>
      )}
    </div>
  )
}
