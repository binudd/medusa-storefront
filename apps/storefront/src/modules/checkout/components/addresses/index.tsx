"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import { useActionState } from "react"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AddressFields,
  type AddressFieldKey,
  type AddressValues,
  emptyAddressValues,
  Field,
  formatAddressLine,
} from "@/components/commerce/address-fields"
import { ErrorMessage } from "@/components/common/error-message"

import { AddressSelect } from "../address-select"
import { CheckoutStep } from "../checkout-step"
import { SubmitButton } from "../submit-button"

type AddressesProps = {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
}

/**
 * Step 1: contact + shipping (+ optional billing) address. Submits through
 * the existing `setAddresses` server action; controlled inputs keep the
 * customer's entries intact if the action returns an error.
 */
export function Addresses({ cart, customer }: AddressesProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "address"

  const countries = React.useMemo(
    () =>
      (cart.region?.countries ?? [])
        .filter((c): c is typeof c & { iso_2: string; display_name: string } =>
          Boolean(c.iso_2 && c.display_name)
        )
        .map((c) => ({ iso_2: c.iso_2, display_name: c.display_name })),
    [cart.region?.countries]
  )

  const [shipping, setShipping] = React.useState<AddressValues>(() => {
    const values = emptyAddressValues(cart.shipping_address)
    if (!values.country_code && countries.length === 1) {
      values.country_code = countries[0].iso_2
    }
    return values
  })
  const [billing, setBilling] = React.useState<AddressValues>(() =>
    emptyAddressValues(cart.billing_address)
  )
  const [email, setEmail] = React.useState(cart.email ?? customer?.email ?? "")
  const [sameAsBilling, setSameAsBilling] = React.useState(() =>
    cart.shipping_address && cart.billing_address
      ? compareAddresses(cart.shipping_address, cart.billing_address)
      : true
  )

  const [message, formAction] = useActionState(setAddresses, null)

  const savedAddresses = React.useMemo(
    () =>
      customer?.addresses?.filter(
        (a) => a.country_code && countries.some((c) => c.iso_2 === a.country_code)
      ) ?? [],
    [customer?.addresses, countries]
  )

  const update =
    (setter: React.Dispatch<React.SetStateAction<AddressValues>>) =>
    (key: AddressFieldKey, value: string) =>
      setter((prev) => ({ ...prev, [key]: value }))

  const isComplete = Boolean(cart.shipping_address?.address_1 && cart.email)

  return (
    <CheckoutStep
      index={1}
      title="Shipping address"
      isOpen={isOpen}
      isComplete={isComplete}
      canEdit={isComplete}
      onEdit={() => router.push(`${pathname}?step=address`, { scroll: false })}
      editTestId="edit-address-button"
    >
      {isOpen ? (
        <form action={formAction} className="space-y-8">
          <fieldset className="space-y-4">
            <legend className="mb-3 text-sm font-medium">Contact</legend>
            <Field label="Email" htmlFor="checkout-email">
              <Input
                id="checkout-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="shipping-email-input"
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-3 text-sm font-medium">Ship to</legend>
            {customer && savedAddresses.length > 0 && (
              <AddressSelect
                addresses={savedAddresses}
                addressInput={shipping}
                onSelect={(address) =>
                  setShipping(emptyAddressValues(address))
                }
              />
            )}
            <AddressFields
              prefix="shipping_address"
              values={shipping}
              onChange={update(setShipping)}
              countries={countries}
            />
          </fieldset>

          <div className="flex items-center gap-3">
            <Checkbox
              id="same-as-billing"
              name="same_as_billing"
              checked={sameAsBilling}
              onCheckedChange={(v) => setSameAsBilling(v === true)}
              data-testid="billing-address-checkbox"
            />
            <Label htmlFor="same-as-billing" className="font-normal">
              Billing address is the same as shipping address
            </Label>
          </div>

          {!sameAsBilling && (
            <fieldset className="space-y-4">
              <legend className="mb-3 text-sm font-medium">Billing address</legend>
              <AddressFields
                prefix="billing_address"
                values={billing}
                onChange={update(setBilling)}
                countries={countries}
              />
            </fieldset>
          )}

          <div className="space-y-3">
            <SubmitButton className="w-full sm:w-auto" data-testid="submit-address-button">
              Continue to delivery
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        isComplete && (
          <dl className="grid gap-6 text-sm sm:grid-cols-3">
            <div data-testid="shipping-address-summary">
              <dt className="mb-1 font-medium">Ship to</dt>
              <dd className="text-muted-foreground">
                {cart.shipping_address?.first_name} {cart.shipping_address?.last_name}
                <br />
                {formatAddressLine(cart.shipping_address)}
              </dd>
            </div>
            <div data-testid="shipping-contact-summary">
              <dt className="mb-1 font-medium">Contact</dt>
              <dd className="break-words text-muted-foreground">
                {cart.email}
                {cart.shipping_address?.phone && (
                  <>
                    <br />
                    {cart.shipping_address.phone}
                  </>
                )}
              </dd>
            </div>
            <div data-testid="billing-address-summary">
              <dt className="mb-1 font-medium">Bill to</dt>
              <dd className="text-muted-foreground">
                {sameAsBilling ? (
                  "Same as shipping address"
                ) : (
                  <>
                    {cart.billing_address?.first_name} {cart.billing_address?.last_name}
                    <br />
                    {formatAddressLine(cart.billing_address)}
                  </>
                )}
              </dd>
            </div>
          </dl>
        )
      )}
    </CheckoutStep>
  )
}
