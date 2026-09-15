"use client"

import { ShoppingBag } from "lucide-react"

import { useCartItemCount } from "@lib/queries/cart"
import { useCartUiStore } from "@/store/cart-ui.store"
import { Button } from "@/components/ui/button"

export function CartButton() {
  const count = useCartItemCount()
  const openDrawer = useCartUiStore((s) => s.openDrawer)

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={openDrawer}
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
      data-testid="nav-cart-link"
    >
      <ShoppingBag className="size-5" />
      <span
        aria-live="polite"
        aria-atomic
        className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-2xs font-medium leading-4 text-primary-foreground tabular-nums"
        data-testid="cart-count"
      >
        {count}
      </span>
    </Button>
  )
}
