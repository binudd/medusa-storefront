import { HttpTypes } from "@medusajs/types"

import { storeConfig } from "@/config"
import { convertToLocale } from "@lib/util/money"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/common/localized-link"
import { CartTotals } from "@/components/commerce/cart-totals"
import { formatAddressLine } from "@/components/commerce/address-fields"
import { OrderLineItem } from "@/components/commerce/order-line-item"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate = ({ order }: OrderDetailsTemplateProps) => {
  const shipping = order.shipping_methods?.[0]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            Order #{order.display_id}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Placed {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="muted">
            {order.fulfillment_status.replaceAll("_", " ")}
          </Badge>
          <Badge variant="outline">
            {order.payment_status.replaceAll("_", " ")}
          </Badge>
        </div>
      </div>
      <Button asChild variant="link" className="h-auto w-fit px-0">
        <LocalizedLink href="/account/orders" data-testid="back-to-overview-button">
          ← Back to orders
        </LocalizedLink>
      </Button>

      <div data-testid="order-details-container">
        <p className="text-sm text-muted-foreground">
          Confirmation sent to{" "}
          <span className="text-foreground" data-testid="order-email">
            {order.email}
          </span>
        </p>
        <div className="mt-6 divide-y border-y" data-testid="products-table">
          {order.items
            ?.slice()
            .sort((a, b) =>
              (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            )
            .map((item) => (
              <OrderLineItem
                key={item.id}
                item={item}
                currencyCode={order.currency_code}
              />
            ))}
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div data-testid="shipping-address-summary">
            <h2 className="text-sm font-medium">Shipping address</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
              <br />
              {formatAddressLine(order.shipping_address)}
            </p>
          </div>
          <div data-testid="shipping-method-summary">
            <h2 className="text-sm font-medium">Method</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {shipping?.name}
              {shipping
                ? ` · ${convertToLocale({
                    amount: shipping.total ?? 0,
                    currency_code: order.currency_code,
                  })}`
                : null}
            </p>
          </div>
        </div>
        <div className="mt-8 rounded-md border p-5">
          <CartTotals totals={order} />
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Need help?{" "}
          <a
            className="underline-offset-4 hover:underline"
            href={`mailto:${storeConfig.brand.supportEmail}`}
          >
            {storeConfig.brand.supportEmail}
          </a>
        </p>
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
