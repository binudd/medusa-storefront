import { HttpTypes } from "@medusajs/types"

import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/common/empty-state"
import { LocalizedLink } from "@/components/common/localized-link"

import { Addresses } from "../../components/addresses"
import { Payment } from "../../components/payment"
import { Review } from "../../components/review"
import { Shipping } from "../../components/shipping"

export async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
}) {
  const [shippingMethods, paymentMethods] = await Promise.all([
    listCartShippingMethods(cart.id).catch(() => null),
    listCartPaymentMethods(cart.region?.id ?? "").catch(() => null),
  ])

  if (!shippingMethods || !paymentMethods) {
    return (
      <EmptyState
        title="Checkout is temporarily unavailable"
        description="We couldn't load shipping or payment options. Your bag has been saved — please try again in a moment."
        action={
          <Button asChild variant="outline">
            <LocalizedLink href="/cart">Back to bag</LocalizedLink>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-8">
      <Addresses cart={cart} customer={customer} />
      <Shipping cart={cart} availableShippingMethods={shippingMethods} />
      <Payment cart={cart} availablePaymentMethods={paymentMethods} />
      <Review cart={cart} />
    </div>
  )
}
