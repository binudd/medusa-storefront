"use client"

import { HttpTypes } from "@medusajs/types"
import { ShoppingBag } from "lucide-react"
import * as React from "react"

import { useCart } from "@lib/queries/cart"
import { getCheckoutStep } from "@lib/util/get-checkout-step"
import { getFreeShippingProgress } from "@lib/util/free-shipping"
import { storeConfig } from "@/config"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { EmptyState } from "@/components/common/empty-state"
import { LocalizedLink } from "@/components/common/localized-link"
import { CartLineItem } from "@/components/commerce/cart-line-item"
import { CartTotals } from "@/components/commerce/cart-totals"
import { FreeShippingProgress } from "@/components/commerce/free-shipping-progress"
import { PromoCodeForm } from "@/components/commerce/promo-code-form"

import { CartPageSkeleton } from "./cart-page-skeleton"

type CartTemplateProps = {
  isSignedIn: boolean
  shippingOptions: HttpTypes.StoreCartShippingOption[]
}

/**
 * Full cart page. Reads the same TanStack cart query as the drawer so
 * quantity changes are optimistic and shared across both surfaces.
 */
export function CartTemplate({ isSignedIn, shippingOptions }: CartTemplateProps) {
  const { data: cart, isPending, isError, refetch } = useCart()

  const items = React.useMemo(
    () =>
      [...(cart?.items ?? [])].sort((a, b) =>
        (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
      ),
    [cart?.items]
  )

  if (isPending && !cart) {
    return <CartPageSkeleton />
  }

  if (isError && !cart) {
    return (
      <div className="content-container py-16">
        <EmptyState
          title="We couldn't load your cart"
          description="Please check your connection and try again."
          action={<Button onClick={() => refetch()}>Retry</Button>}
        />
      </div>
    )
  }

  if (!cart || items.length === 0) {
    return (
      <div className="content-container py-16 lg:py-24" data-testid="cart-container">
        <EmptyState
          icon={<ShoppingBag />}
          title="Your bag is empty"
          description="Browse the collection and add something you love."
          action={
            <Button asChild size="lg">
              <LocalizedLink href="/store">Continue shopping</LocalizedLink>
            </Button>
          }
        />
      </div>
    )
  }

  const count = items.reduce((acc, i) => acc + i.quantity, 0)
  const progress = storeConfig.features.shippingProgress
    ? getFreeShippingProgress(cart, shippingOptions)
    : null

  return (
    <div className="content-container py-8 lg:py-12" data-testid="cart-container">
      <h1 className="text-3xl font-medium sm:text-4xl">
        Bag <span className="text-muted-foreground">({count})</span>
      </h1>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <section aria-label="Items in your bag">
          {!isSignedIn && (
            <div className="mb-6 flex flex-col gap-3 rounded-md border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">Already have an account?</p>
                <p className="text-sm text-muted-foreground">
                  Sign in to use saved addresses and track orders.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" data-testid="sign-in-button">
                <LocalizedLink href="/account">Sign in</LocalizedLink>
              </Button>
            </div>
          )}

          {progress && (
            <div className="mb-6">
              <FreeShippingProgress progress={progress} />
            </div>
          )}

          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="py-6 first:pt-0">
                <CartLineItem item={item} currencyCode={cart.currency_code} />
              </li>
            ))}
          </ul>
        </section>

        <aside aria-label="Order summary">
          <div className="space-y-6 rounded-md border p-6 lg:sticky lg:top-[calc(var(--header-height)+var(--announcement-height)+2rem)]">
            <h2 className="text-lg font-medium">Summary</h2>
            <PromoCodeForm promotions={cart.promotions} />
            <Separator />
            <CartTotals totals={cart} />
            <Button asChild size="lg" className="w-full" data-testid="checkout-button">
              <LocalizedLink href={`/checkout?step=${getCheckoutStep(cart)}`}>
                Go to checkout
              </LocalizedLink>
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Taxes and shipping calculated at checkout.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
