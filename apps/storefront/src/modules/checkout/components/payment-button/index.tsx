"use client"

import { HttpTypes } from "@medusajs/types"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useParams } from "next/navigation"
import * as React from "react"

import { isManual, isStripeLike } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/common/error-message"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

/**
 * Final "Place order" control. Dispatches to the provider-specific flow; the
 * Stripe branch confirms the PaymentIntent inline and only redirects when
 * the chosen method requires it.
 */
export function PaymentButton({ cart, "data-testid": dataTestId }: PaymentButtonProps) {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  if (isStripeLike(paymentSession?.provider_id)) {
    return <StripePaymentButton notReady={notReady} cart={cart} data-testid={dataTestId} />
  }
  if (isManual(paymentSession?.provider_id)) {
    return <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
  }
  return (
    <Button size="lg" className="w-full" disabled>
      Select a payment method
    </Button>
  )
}

function usePlaceOrder() {
  const [submitting, setSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const complete = async () => {
    await placeOrder()
      .catch((err: Error) => setErrorMessage(err.message))
      .finally(() => setSubmitting(false))
  }

  return { submitting, setSubmitting, errorMessage, setErrorMessage, complete }
}

function StripePaymentButton({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) {
  const { submitting, setSubmitting, errorMessage, setErrorMessage, complete } =
    usePlaceOrder()
  const stripe = useStripe()
  const elements = useElements()
  const { countryCode } = useParams<{ countryCode: string }>()

  const handlePayment = async () => {
    if (!stripe || !elements || !cart) return

    setSubmitting(true)
    setErrorMessage(null)

    await stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/api/payment-return?cart_id=${cart.id}&country_code=${countryCode}`,
          payment_method_data: {
            billing_details: {
              name: `${cart.billing_address?.first_name} ${cart.billing_address?.last_name}`,
              address: {
                city: cart.billing_address?.city ?? undefined,
                country: cart.billing_address?.country_code ?? undefined,
                line1: cart.billing_address?.address_1 ?? undefined,
                line2: cart.billing_address?.address_2 ?? undefined,
                postal_code: cart.billing_address?.postal_code ?? undefined,
                state: cart.billing_address?.province ?? undefined,
              },
              email: cart.email,
              phone: cart.billing_address?.phone ?? undefined,
            },
          },
        },
        // Only leave the site when the selected method actually requires it, so
        // card payments still complete inline.
        redirect: "if_required",
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent
          if (pi && (pi.status === "requires_capture" || pi.status === "succeeded")) {
            return complete()
          }
          setErrorMessage(error.message || null)
          setSubmitting(false)
          return
        }

        if (
          paymentIntent.status === "requires_capture" ||
          paymentIntent.status === "succeeded"
        ) {
          return complete()
        }

        setSubmitting(false)
      })
  }

  return (
    <div className="space-y-3">
      <Button
        size="lg"
        className="w-full"
        disabled={!stripe || !elements || notReady}
        onClick={() => void handlePayment()}
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage error={errorMessage} data-testid="stripe-payment-error-message" />
    </div>
  )
}

function ManualTestPaymentButton({
  notReady,
  "data-testid": dataTestId,
}: {
  notReady: boolean
  "data-testid"?: string
}) {
  const { submitting, setSubmitting, errorMessage, setErrorMessage, complete } =
    usePlaceOrder()

  return (
    <div className="space-y-3">
      <Button
        size="lg"
        className="w-full"
        disabled={notReady}
        isLoading={submitting}
        onClick={() => {
          setErrorMessage(null)
          setSubmitting(true)
          void complete()
        }}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage error={errorMessage} data-testid="manual-payment-error-message" />
    </div>
  )
}
