"use client"

import { useActionState, useEffect, useState } from "react"

import { updateCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@/components/common/error-message"
import { Field } from "@/components/commerce/address-fields"
import { SubmitButton } from "@modules/checkout/components/submit-button"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileName: React.FC<MyInformationProps> = ({ customer }) => {
  const updateCustomerName = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    try {
      await updateCustomer({
        first_name: formData.get("first_name") as string,
        last_name: formData.get("last_name") as string,
      })
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  const [state, formAction] = useActionState(updateCustomerName, {
    error: null as string | null,
    success: false,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (state.success) setSaved(true)
  }, [state])

  return (
    <form action={formAction} className="space-y-4" data-testid="account-name-editor">
      <h2 className="text-sm font-medium">Name</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="First name" htmlFor="profile-first-name">
          <Input
            id="profile-first-name"
            name="first_name"
            required
            defaultValue={customer.first_name ?? ""}
            data-testid="first-name-input"
          />
        </Field>
        <Field label="Last name" htmlFor="profile-last-name">
          <Input
            id="profile-last-name"
            name="last_name"
            required
            defaultValue={customer.last_name ?? ""}
            data-testid="last-name-input"
          />
        </Field>
      </div>
      <ErrorMessage error={state.error} />
      {saved && (
        <p className="text-sm text-success" role="status" data-testid="success-message">
          Name updated.
        </p>
      )}
      <SubmitButton size="default" data-testid="save-button">
        Save name
      </SubmitButton>
    </form>
  )
}

export default ProfileName
