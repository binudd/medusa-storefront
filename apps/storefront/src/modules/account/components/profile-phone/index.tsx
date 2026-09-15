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

const ProfilePhone: React.FC<MyInformationProps> = ({ customer }) => {
  const updateCustomerPhone = async (
    _currentState: Record<string, unknown>,
    formData: FormData
  ) => {
    try {
      await updateCustomer({ phone: formData.get("phone") as string })
      return { success: true, error: null }
    } catch (error) {
      return { success: false, error: String(error) }
    }
  }

  const [state, formAction] = useActionState(updateCustomerPhone, {
    error: null as string | null,
    success: false,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (state.success) setSaved(true)
  }, [state])

  return (
    <form action={formAction} className="space-y-4" data-testid="account-phone-editor">
      <h2 className="text-sm font-medium">Phone</h2>
      <Field label="Phone" htmlFor="profile-phone">
        <Input
          id="profile-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={customer.phone ?? ""}
          data-testid="phone-input"
        />
      </Field>
      <ErrorMessage error={state.error} />
      {saved && (
        <p className="text-sm text-success" role="status">
          Phone updated.
        </p>
      )}
      <SubmitButton size="default" data-testid="save-button">
        Save phone
      </SubmitButton>
    </form>
  )
}

export default ProfilePhone
