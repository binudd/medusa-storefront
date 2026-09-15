"use client"

import { PaymentElement } from "@stripe/react-stripe-js"
import * as React from "react"

import { isManual } from "@lib/constants"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"

import { StripeContext } from "../payment-wrapper/stripe-wrapper"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { title: string; icon: React.JSX.Element }>
  children?: React.ReactNode
}

/** A selectable payment provider row inside the payment `RadioGroup`. */
export function PaymentContainer({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}: PaymentContainerProps) {
  const isDevelopment = process.env.NODE_ENV === "development"
  const selected = selectedPaymentOptionId === paymentProviderId
  const id = `payment-${paymentProviderId}`

  return (
    <div
      className={cn(
        "rounded-md border transition-colors duration-fast",
        selected ? "border-primary" : "border-input hover:border-foreground/60",
        disabled && "opacity-50"
      )}
    >
      <Label
        htmlFor={id}
        className="flex cursor-pointer items-center justify-between gap-4 px-4 py-4 text-sm font-normal"
      >
        <span className="flex items-center gap-3">
          <RadioGroupItem value={paymentProviderId} id={id} disabled={disabled} />
          <span>{paymentInfoMap[paymentProviderId]?.title || paymentProviderId}</span>
          {isManual(paymentProviderId) && isDevelopment && (
            <Badge variant="warning" className="hidden sm:inline-flex">
              Test only
            </Badge>
          )}
        </span>
        <span className="text-muted-foreground [&_svg]:size-5">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </Label>
      {children && <div className="border-t px-4 py-4">{children}</div>}
    </div>
  )
}

export function StripePaymentContainer({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  setError,
  setPaymentComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setError: (error: string | null) => void
  setPaymentComplete: (complete: boolean) => void
}) {
  const stripeReady = React.useContext(StripeContext)
  const selected = selectedPaymentOptionId === paymentProviderId

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
    >
      {selected &&
        (stripeReady ? (
          <div>
            <p className="mb-3 text-sm font-medium">Enter your payment details</p>
            <PaymentElement
              options={{ layout: "accordion" }}
              onChange={(e) => {
                setError(null)
                setPaymentComplete(e.complete)
              }}
              // Without a handler Stripe.js reports a failed mount as an
              // unhandled "payment Element loaderror" and the option renders
              // blank with no explanation. Surface it in the checkout's own
              // error slot instead.
              onLoadError={(e) => {
                setPaymentComplete(false)
                setError(e.error?.message ?? "Could not load the payment methods.")
              }}
            />
          </div>
        ) : (
          <div className="space-y-3" aria-busy>
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        ))}
    </PaymentContainer>
  )
}
