import { cookies as nextCookies } from "next/headers"

import { storeConfig } from "@/config"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/common/localized-link"
import { CartTotals } from "@/components/commerce/cart-totals"
import { formatAddressLine } from "@/components/commerce/address-fields"
import { OrderLineItem } from "@/components/commerce/order-line-item"
import { paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import OnboardingCta from "@modules/order/components/onboarding-cta"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const shipping = order.shipping_methods?.[0]
  const payment = order.payment_collections?.[0]?.payments?.[0]

  return (
    <div className="content-container max-w-3xl py-12 lg:py-16">
      {isOnboarding && <OnboardingCta orderId={order.id} />}
      <div data-testid="order-complete-container">
        <p className="eyebrow">Order confirmed</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight">
          Thank you for your order
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A confirmation has been sent to{" "}
          <span className="text-foreground" data-testid="order-email">
            {order.email}
          </span>
          . Order{" "}
          <span data-testid="order-id">#{order.display_id}</span>
          {" · "}
          <span data-testid="order-date">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </p>

        <section className="mt-10">
          <h2 className="text-lg font-medium">Items</h2>
          <div className="mt-2 divide-y border-y" data-testid="products-table">
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
        </section>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div data-testid="shipping-address-summary">
            <h2 className="text-sm font-medium">Delivery</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {order.shipping_address?.first_name}{" "}
              {order.shipping_address?.last_name}
              <br />
              {formatAddressLine(order.shipping_address)}
            </p>
            <p className="mt-3 text-sm text-muted-foreground" data-testid="shipping-method-summary">
              {shipping?.name}
              {shipping
                ? ` · ${convertToLocale({
                    amount: shipping.total ?? 0,
                    currency_code: order.currency_code,
                  })}`
                : null}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium">Payment</h2>
            <p className="mt-2 text-sm text-muted-foreground" data-testid="payment-method">
              {payment
                ? paymentInfoMap[payment.provider_id]?.title ?? payment.provider_id
                : "—"}
            </p>
            {payment && (
              <p className="mt-1 text-sm tabular-nums" data-testid="payment-amount">
                {convertToLocale({
                  amount: payment.amount,
                  currency_code: order.currency_code,
                })}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-md border p-5">
          <CartTotals totals={order} />
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Questions? Email{" "}
          <a
            className="underline-offset-4 hover:underline"
            href={`mailto:${storeConfig.brand.supportEmail}`}
          >
            {storeConfig.brand.supportEmail}
          </a>
          .
        </p>
        <Button asChild className="mt-6">
          <LocalizedLink href="/store">Continue shopping</LocalizedLink>
        </Button>
      </div>
    </div>
  )
}
