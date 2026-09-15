"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import * as React from "react"

import { storeConfig } from "@/config"
import { useCart } from "@lib/queries/cart"
import { getCheckoutStep } from "@lib/util/get-checkout-step"
import { getFreeShippingProgress } from "@lib/util/free-shipping"
import { useCartUiStore } from "@/store/cart-ui.store"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/common/empty-state"
import { LocalizedLink } from "@/components/common/localized-link"
import { CartLineItem } from "@/components/commerce/cart-line-item"
import { CartTotals } from "@/components/commerce/cart-totals"
import { FreeShippingProgress } from "@/components/commerce/free-shipping-progress"

type CartDrawerProps = {
  shippingOptions: HttpTypes.StoreCartShippingOption[]
}

/**
 * Slide-over cart. Data comes from the TanStack cart query; visibility from
 * the cart UI store so `AddToCart` can open it after a successful add.
 */
export function CartDrawer({ shippingOptions }: CartDrawerProps) {
  const open = useCartUiStore((s) => s.drawerOpen)
  const setOpen = useCartUiStore((s) => s.setDrawerOpen)
  const pathname = usePathname()
  const { data: cart, isPending } = useCart()

  // Close the drawer on navigation.
  React.useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  const items = React.useMemo(
    () =>
      [...(cart?.items ?? [])].sort((a, b) =>
        (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
      ),
    [cart?.items]
  )
  const count = items.reduce((acc, i) => acc + i.quantity, 0)
  const progress = storeConfig.features.shippingProgress
    ? getFreeShippingProgress(cart, shippingOptions)
    : null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="p-0" data-testid="nav-cart-dropdown">
        <SheetHeader>
          <SheetTitle>
            Cart{" "}
            <span className="text-muted-foreground">({count})</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        {isPending && !cart ? (
          <div className="space-y-6 p-5">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="grid grid-cols-[72px_1fr] gap-4">
                <Skeleton className="aspect-product" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            compact
            icon={<ShoppingBag />}
            title="Your cart is empty"
            description="Browse the collection and add something you love."
            action={
              <Button asChild>
                <LocalizedLink href="/store">Continue shopping</LocalizedLink>
              </Button>
            }
            className="flex-1"
          />
        ) : (
          <>
            {progress && (
              <div className="border-b px-5 py-3">
                <FreeShippingProgress progress={progress} />
              </div>
            )}
            <ul className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
              {items.map((item) => (
                <li key={item.id}>
                  <CartLineItem
                    item={item}
                    currencyCode={cart!.currency_code}
                    variant="compact"
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
            <SheetFooter>
              <CartTotals totals={cart!} compact />
              <Button asChild size="lg" className="w-full" data-testid="go-to-cart-button">
                <LocalizedLink href={`/checkout?step=${getCheckoutStep(cart!)}`}>
                  Checkout
                </LocalizedLink>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <LocalizedLink href="/cart">View cart</LocalizedLink>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
