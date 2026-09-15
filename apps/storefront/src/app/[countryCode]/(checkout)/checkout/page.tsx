import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getCheckoutStep } from "@lib/util/get-checkout-step"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import { CheckoutForm } from "@modules/checkout/templates/checkout-form"
import { CheckoutSummary } from "@modules/checkout/templates/checkout-summary"

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ step?: string }>
}) {
  const { countryCode } = await params
  const { step } = await searchParams
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  if (!step) {
    redirect(`/${countryCode}/checkout?step=${getCheckoutStep(cart)}`)
  }

  const customer = await retrieveCustomer().catch(() => null)

  return (
    <div className="lg:content-container lg:grid lg:grid-cols-[1fr_400px] lg:gap-16 lg:py-12 xl:gap-24">
      <div className="contents lg:block">
        <div className="order-first lg:hidden">
          <CheckoutSummary cart={cart} />
        </div>
        <div className="content-container py-8 lg:px-0 lg:py-0">
          <PaymentWrapper cart={cart}>
            <CheckoutForm cart={cart} customer={customer} />
          </PaymentWrapper>
        </div>
      </div>
      <div className="hidden lg:block">
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}
