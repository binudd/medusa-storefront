"use client"

import { HttpTypes } from "@medusajs/types"
import * as React from "react"

import compareAddresses from "@lib/util/compare-addresses"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatAddressLine } from "@/components/commerce/address-fields"

type AddressSelectProps = {
  addresses: HttpTypes.StoreCustomerAddress[]
  addressInput: Partial<HttpTypes.StoreCartAddress> | null
  onSelect: (address: HttpTypes.StoreCartAddress) => void
}

/** Saved-address picker for signed-in customers. */
export function AddressSelect({ addresses, addressInput, onSelect }: AddressSelectProps) {
  const id = React.useId()
  const selected = React.useMemo(
    () => addresses.find((a) => addressInput && compareAddresses(a, addressInput)),
    [addresses, addressInput]
  )

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Saved addresses</Label>
      <Select
        value={selected?.id ?? ""}
        onValueChange={(value) => {
          const address = addresses.find((a) => a.id === value)
          if (address) onSelect(address as HttpTypes.StoreCartAddress)
        }}
      >
        <SelectTrigger id={id} data-testid="shipping-address-select">
          <SelectValue placeholder="Choose an address" />
        </SelectTrigger>
        <SelectContent data-testid="shipping-address-options">
          {addresses.map((address) => (
            <SelectItem
              key={address.id}
              value={address.id}
              data-testid="shipping-address-option"
            >
              <span className="font-medium">
                {address.first_name} {address.last_name}
              </span>
              <span className="text-muted-foreground"> · {formatAddressLine(address)}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
