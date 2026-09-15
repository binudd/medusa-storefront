import { VariantPrice } from "@/types/global"

import { cn } from "@/lib/utils"

type PriceProps = {
  price: VariantPrice | null | undefined
  /** Prefix with "From" when showing a product's cheapest variant. */
  from?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
  showDiscountPercent?: boolean
}

const sizeClass = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
}

/**
 * Formatted price with sale handling. Prices are pre-formatted by
 * `getProductPrice`, so this component is purely presentational.
 */
export function Price({
  price,
  from,
  size = "md",
  className,
  showDiscountPercent,
}: PriceProps) {
  if (!price) return null

  const isSale = price.price_type === "sale"

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-0.5 tabular-nums",
        sizeClass[size],
        className
      )}
    >
      <span
        className={cn("font-medium", isSale && "text-sale")}
        data-testid="product-price"
        data-value={price.calculated_price_number}
      >
        {from && <span className="font-normal text-muted-foreground">From </span>}
        {price.calculated_price}
      </span>
      {isSale && (
        <>
          <span
            className="text-muted-foreground line-through"
            data-testid="original-product-price"
            data-value={price.original_price_number}
          >
            {price.original_price}
          </span>
          {showDiscountPercent && (
            <span className="text-xs font-medium text-sale">
              -{price.percentage_diff}%
            </span>
          )}
        </>
      )}
    </div>
  )
}
