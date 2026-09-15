"use client"

import { HttpTypes } from "@medusajs/types"
import { CreditCard } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import { ErrorMessage } from "@/components/common/error-message"

import { CheckoutStep } from "../checkout-step"
import { PaymentContainer, StripePaymentContainer } from "../payment-container"

type PaymentProps = {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: { id: string }[]
}

function isPaidByGiftcard(cart: HttpTypes.StoreCart) {
  const giftCards = (cart as unknown as { gift_cards?: unknown[] }).gift_cards
  return Boolean(giftCards?.length) && cart.total === 0
}

/**
 * Step 3: payment provider selection. Stripe-like providers initiate a
 * payment session up front so the Payment Element can mount; other providers
 * initiate on continue. Logic mirrors the Medusa starter.
 */
export function Payment({ cart, availablePaymentMethods }: PaymentProps) {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [paymentComplete, setPaymentComplete] = React.useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "payment"

  const paidByGiftcard = isPaidByGiftcard(cart)
  const paymentReady =
    (activeSession && (cart.shipping_methods?.length ?? 0) !== 0) || paidByGiftcard

  const goTo = (step: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("step", step)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
      try {
        await initiatePaymentSession(cart, { provider_id: method })
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      }
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputPaymentDetails =
        isStripeLike(selectedPaymentMethod) && !activeSession
      const checkActiveSession = activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, { provider_id: selectedPaymentMethod })
      }

      if (!shouldInputPaymentDetails) {
        return goTo("review")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    setError(null)
  }, [isOpen])

  const summaryTitle = paidByGiftcard
    ? "Gift card"
    : paymentInfoMap[activeSession?.provider_id ?? ""]?.title ||
      activeSession?.provider_id

  return (
    <CheckoutStep
      index={3}
      title="Payment"
      isOpen={isOpen}
      isComplete={Boolean(paymentReady)}
      canEdit={Boolean(paymentReady)}
      onEdit={() => goTo("payment")}
      editTestId="edit-payment-button"
    >
      {/* Keep the Stripe element mounted while the step is closed so the
          entered card details survive navigation between steps. */}
      <div className={isOpen ? "space-y-6" : "hidden"}>
        {!paidByGiftcard && availablePaymentMethods.length > 0 && (
          <RadioGroup
            value={selectedPaymentMethod}
            onValueChange={(value) => void setPaymentMethod(value)}
            aria-label="Payment method"
          >
            {availablePaymentMethods.map((method) =>
              isStripeLike(method.id) ? (
                <StripePaymentContainer
                  key={method.id}
                  paymentProviderId={method.id}
                  selectedPaymentOptionId={selectedPaymentMethod}
                  paymentInfoMap={paymentInfoMap}
                  setError={setError}
                  setPaymentComplete={setPaymentComplete}
                />
              ) : (
                <PaymentContainer
                  key={method.id}
                  paymentProviderId={method.id}
                  selectedPaymentOptionId={selectedPaymentMethod}
                  paymentInfoMap={paymentInfoMap}
                />
              )
            )}
          </RadioGroup>
        )}

        {!paidByGiftcard && availablePaymentMethods.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No payment methods are available for this region.
          </p>
        )}

        {paidByGiftcard && (
          <dl className="text-sm">
            <dt className="mb-1 font-medium">Payment method</dt>
            <dd className="text-muted-foreground" data-testid="payment-method-summary">
              Gift card
            </dd>
          </dl>
        )}

        <ErrorMessage error={error} data-testid="payment-method-error-message" />

        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => void handleSubmit()}
          isLoading={isLoading}
          disabled={
            (isStripeLike(selectedPaymentMethod) && !paymentComplete) ||
            (!selectedPaymentMethod && !paidByGiftcard)
          }
          data-testid="submit-payment-button"
        >
          {!activeSession && isStripeLike(selectedPaymentMethod)
            ? "Enter payment details"
            : "Continue to review"}
        </Button>
      </div>

      {!isOpen && paymentReady && (
        <dl className="grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="mb-1 font-medium">Payment method</dt>
            <dd className="text-muted-foreground" data-testid="payment-method-summary">
              {summaryTitle}
            </dd>
          </div>
          {activeSession && !paidByGiftcard && (
            <div>
              <dt className="mb-1 font-medium">Payment details</dt>
              <dd
                className="flex items-center gap-2 text-muted-foreground [&_svg]:size-4"
                data-testid="payment-details-summary"
              >
                {paymentInfoMap[selectedPaymentMethod]?.icon ?? <CreditCard />}
                <span>Confirmed at the next step</span>
              </dd>
            </div>
          )}
        </dl>
      )}
    </CheckoutStep>
  )
}
