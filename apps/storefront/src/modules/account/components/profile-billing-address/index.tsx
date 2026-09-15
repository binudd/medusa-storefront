"use client"

import { useActionState, useEffect, useMemo, useState } from "react"

import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { ErrorMessage } from "@/components/common/error-message"
import {
  AddressFields,
  emptyAddressValues,
  toCountryOptions,
  type AddressFieldKey,
  type AddressValues,
} from "@/components/commerce/address-fields"
import { SubmitButton } from "@modules/checkout/components/submit-button"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
  regions: HttpTypes.StoreRegion[]
}

const ProfileBillingAddress: React.FC<MyInformationProps> = ({
  customer,
  regions,
}) => {
  const countries = useMemo(
    () => toCountryOptions(regions.flatMap((region) => region.countries ?? [])),
    [regions]
  )

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  const [values, setValues] = useState<AddressValues>(
    emptyAddressValues(billingAddress)
  )

  const initialState: Record<string, unknown> = {
    isDefaultBilling: true,
    isDefaultShipping: false,
    error: false,
    success: false,
  }

  if (billingAddress) {
    initialState.addressId = billingAddress.id
  }

  const [state, formAction] = useActionState(
    billingAddress ? updateCustomerAddress : addCustomerAddress,
    initialState
  )
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (state.success) setSaved(true)
  }, [state])

  const onChange = (key: AddressFieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form
      action={formAction}
      className="space-y-4"
      data-testid="account-billing-address-editor"
    >
      <input type="hidden" name="addressId" value={billingAddress?.id ?? ""} />
      <h2 className="text-sm font-medium">Billing address</h2>
      <AddressFields
        prefix=""
        values={values}
        onChange={onChange}
        countries={countries}
        show={{ company: true, address_2: true, phone: true }}
        testIdPrefix="billing"
      />
      <ErrorMessage error={typeof state.error === "string" ? state.error : null} />
      {saved && (
        <p className="text-sm text-success" role="status">
          Billing address saved.
        </p>
      )}
      <SubmitButton size="default" data-testid="save-button">
        Save billing address
      </SubmitButton>
    </form>
  )
}

export default ProfileBillingAddress
