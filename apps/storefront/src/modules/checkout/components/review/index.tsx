"use client"

import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "next/navigation"

import { storeConfig } from "@/config"
import { LocalizedLink } from "@/components/common/localized-link"

import { CheckoutStep } from "../checkout-step"
import { PaymentButton } from "../payment-button"

export function Review({ cart }: { cart: HttpTypes.StoreCart }) {
  const searchParams = useSearchParams()
  const isOpen = searchParams.get("step") === "review"

  const giftCards = (cart as unknown as { gift_cards?: unknown[] }).gift_cards
  const paidByGiftcard = Boolean(giftCards?.length) && cart.total === 0

  const previousStepsCompleted =
    cart.shipping_address &&
    (cart.shipping_methods?.length ?? 0) > 0 &&
    (cart.payment_collection || paidByGiftcard)

  const legal = storeConfig.footer.legal

  return (
    <CheckoutStep index={4} title="Review" isOpen={isOpen} isComplete={false}>
      {isOpen && previousStepsCompleted && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            By placing your order you confirm that you have read and accept our{" "}
            {legal.length > 0
              ? legal.map((link, i) => (
                  <span key={link.href}>
                    <LocalizedLink href={link.href} className="underline underline-offset-4 hover:text-foreground">
                      {link.label}
                    </LocalizedLink>
                    {i < legal.length - 2 ? ", " : i === legal.length - 2 ? " and " : ""}
                  </span>
                ))
              : "terms of sale and privacy policy"}
            .
          </p>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </div>
      )}
    </CheckoutStep>
  )
}
