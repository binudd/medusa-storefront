import { HttpTypes } from "@medusajs/types"

import { convertToLocale } from "@lib/util/money"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/common/empty-state"
import { LocalizedLink } from "@/components/common/localized-link"
import { ProductImage } from "@/components/commerce/product-image"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (!orders?.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="When you place an order, the details will live here."
        action={
          <Button asChild>
            <LocalizedLink href="/store" data-testid="continue-shopping-button">
              Continue shopping
            </LocalizedLink>
          </Button>
        }
      />
    )
  }

  return (
    <div className="flex flex-col gap-4" data-testid="no-orders-container">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

function OrderCard({ order }: { order: HttpTypes.StoreOrder }) {
  const itemCount =
    order.items?.reduce((acc, item) => acc + item.quantity, 0) ?? 0

  return (
    <article
      className="rounded-md border p-4 sm:p-5"
      data-testid="order-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium" data-testid="order-display-id">
            Order #{order.display_id}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            <span data-testid="order-created-at">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
            {" · "}
            <span data-testid="order-amount">
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </span>
            {` · ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
          </p>
        </div>
        <Badge variant="muted">{order.fulfillment_status.replaceAll("_", " ")}</Badge>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto">
        {order.items?.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="w-16 shrink-0"
            data-testid="order-item"
          >
            <ProductImage
              src={item.thumbnail}
              alt={item.title}
              sizes="64px"
              className="rounded-md"
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Button asChild variant="outline" size="sm">
          <LocalizedLink
            href={`/account/orders/details/${order.id}`}
            data-testid="order-details-link"
          >
            See details
          </LocalizedLink>
        </Button>
      </div>
    </article>
  )
}

export default OrderOverview
