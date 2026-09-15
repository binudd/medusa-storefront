"use client"

import { AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { transferCart } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@/components/ui/button"

/**
 * Shown when a logged-in customer has a guest cart that failed to transfer.
 */
export function CartMismatchBanner({
  customer,
  cart,
}: {
  customer: HttpTypes.StoreCustomer
  cart: HttpTypes.StoreCart
}) {
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()
  const [failed, setFailed] = React.useState(false)

  if (!customer || !!cart.customer_id) {
    return null
  }

  return (
    <div
      role="status"
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-warning/10 px-4 py-2 text-center text-sm text-warning"
    >
      <span className="inline-flex items-center gap-1.5">
        <AlertTriangle className="size-4" aria-hidden />
        {failed
          ? "We still could not link your cart to your account."
          : "Your cart could not be linked to your account."}
      </span>
      <Button
        variant="link"
        size="sm"
        className="h-auto text-warning"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              setFailed(false)
              await transferCart()
              router.refresh()
            } catch {
              setFailed(true)
            }
          })
        }
      >
        {pending ? "Linking" : "Try again"}
      </Button>
    </div>
  )
}
