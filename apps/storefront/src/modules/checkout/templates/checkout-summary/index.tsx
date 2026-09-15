import { HttpTypes } from "@medusajs/types"

import { convertToLocale } from "@lib/util/money"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { CartTotals } from "@/components/commerce/cart-totals"
import { ProductImage } from "@/components/commerce/product-image"
import { PromoCodeForm } from "@/components/commerce/promo-code-form"

function SummaryItems({ cart }: { cart: HttpTypes.StoreCart }) {
  const items = [...(cart.items ?? [])].sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )
  return (
    <ul className="space-y-4" data-testid="items-table">
      {items.map((item) => (
        <li key={item.id} className="flex gap-4" data-testid="product-row">
          <div className="relative w-16 flex-none">
            <ProductImage
              src={item.thumbnail}
              alt={item.product_title ?? item.title}
              sizes="64px"
              className="rounded-sm"
            />
            <span
              className="absolute -right-2 -top-2 inline-flex size-5 items-center justify-center rounded-full bg-foreground text-2xs font-medium text-background"
              aria-label={`Quantity ${item.quantity}`}
            >
              {item.quantity}
            </span>
          </div>
          <div className="min-w-0 flex-1 text-sm">
            <p className="truncate font-medium" data-testid="product-name">
              {item.product_title}
            </p>
            {item.variant?.title && item.variant.title !== "Default variant" && (
              <p className="text-muted-foreground" data-testid="product-variant">
                {item.variant.title}
              </p>
            )}
          </div>
          <p className="text-sm tabular-nums" data-testid="product-price">
            {convertToLocale({
              amount: item.total ?? 0,
              currency_code: cart.currency_code,
            })}
          </p>
        </li>
      ))}
    </ul>
  )
}

function SummaryBody({ cart }: { cart: HttpTypes.StoreCart }) {
  return (
    <div className="space-y-6">
      <SummaryItems cart={cart} />
      <Separator />
      <PromoCodeForm promotions={cart.promotions} />
      <Separator />
      <CartTotals totals={cart} />
    </div>
  )
}

/**
 * Order summary: sticky column on desktop, collapsible panel above the form
 * on small screens so the total is visible without scrolling.
 */
export function CheckoutSummary({ cart }: { cart: HttpTypes.StoreCart }) {
  const total = convertToLocale({
    amount: cart.total ?? 0,
    currency_code: cart.currency_code,
  })

  return (
    <>
      <Accordion type="single" collapsible className="border-y bg-surface lg:hidden">
        <AccordionItem value="summary" className="border-b-0">
          <AccordionTrigger className="content-container text-sm">
            <span className="flex flex-1 items-center justify-between pr-2">
              <span>Order summary</span>
              <span className="font-medium tabular-nums">{total}</span>
            </span>
          </AccordionTrigger>
          <AccordionContent className="content-container">
            <SummaryBody cart={cart} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <aside className="hidden lg:block" aria-label="Order summary">
        <div className="sticky top-24 rounded-md border p-6">
          <h2 className="mb-6 text-lg font-medium">Order summary</h2>
          <SummaryBody cart={cart} />
        </div>
      </aside>
    </>
  )
}
