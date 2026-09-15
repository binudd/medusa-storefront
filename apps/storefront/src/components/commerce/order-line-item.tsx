import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

import { ProductImage } from "@/components/commerce/product-image"

type OrderLineItemProps = {
  item: HttpTypes.StoreOrderLineItem
  currencyCode: string
}

export function OrderLineItem({ item, currencyCode }: OrderLineItemProps) {
  const options = item.variant?.options
    ?.map((option) => option.value)
    .filter(Boolean)
    .join(" / ")

  return (
    <div
      className="grid grid-cols-[72px_1fr_auto] items-start gap-4 py-4"
      data-testid="product-row"
    >
      <ProductImage
        src={item.thumbnail}
        alt={item.product_title ?? item.title}
        sizes="72px"
        className="rounded-md"
      />
      <div>
        <p className="text-sm font-medium" data-testid="product-name">
          {item.product_title ?? item.title}
        </p>
        {options && (
          <p className="mt-0.5 text-xs text-muted-foreground">{options}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Qty <span data-testid="product-quantity">{item.quantity}</span>
        </p>
      </div>
      <p className="text-sm tabular-nums">
        {convertToLocale({
          amount: item.total ?? 0,
          currency_code: currencyCode,
        })}
      </p>
    </div>
  )
}
