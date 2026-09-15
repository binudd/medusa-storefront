"use client"

import { useActionState } from "react"

import { createTransferRequest } from "@lib/data/orders"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@/components/common/error-message"
import { Field } from "@/components/commerce/address-fields"
import { SubmitButton } from "@modules/checkout/components/submit-button"

export default function TransferRequestForm() {
  const [state, formAction] = useActionState(createTransferRequest, {
    success: false,
    error: null,
    order: null,
  })

  return (
    <div className="rounded-md border p-5">
      <h2 className="text-sm font-medium">Order transfers</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Have an order under another email? Request to connect it to this
        account.
      </p>
      <form action={formAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Field label="Order ID" htmlFor="transfer-order-id" className="flex-1">
          <Input
            id="transfer-order-id"
            name="order_id"
            placeholder="order_..."
          />
        </Field>
        <div className="sm:pt-6">
          <SubmitButton variant="outline" size="default">
            Request transfer
          </SubmitButton>
        </div>
      </form>
      <ErrorMessage error={state.error} className="mt-3" />
      {state.success && state.order && (
        <p className="mt-3 text-sm text-success" role="status">
          Transfer requested for order {state.order.id}. We emailed{" "}
          {state.order.email}.
        </p>
      )}
    </div>
  )
}
