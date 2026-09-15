"use client"

import { HttpTypes } from "@medusajs/types"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const ADDRESS_FIELD_KEYS = [
  "first_name",
  "last_name",
  "address_1",
  "address_2",
  "company",
  "postal_code",
  "city",
  "country_code",
  "province",
  "phone",
] as const

export type AddressFieldKey = (typeof ADDRESS_FIELD_KEYS)[number]
export type AddressValues = Record<AddressFieldKey, string>

export type CountryOption = { iso_2: string; display_name: string }

export function toCountryOptions(
  countries?: { iso_2?: string | null; display_name?: string | null }[] | null
): CountryOption[] {
  return (countries ?? []).flatMap((country) =>
    country.iso_2
      ? [{ iso_2: country.iso_2, display_name: country.display_name ?? country.iso_2 }]
      : []
  )
}

export function emptyAddressValues(
  source?: Partial<Record<AddressFieldKey, string | null | undefined>> | null
): AddressValues {
  return ADDRESS_FIELD_KEYS.reduce((acc, key) => {
    acc[key] = source?.[key] ?? ""
    return acc
  }, {} as AddressValues)
}

type AddressFieldsProps = {
  /** Field name prefix, e.g. `shipping_address` -> `shipping_address.city`. */
  prefix: string
  values: AddressValues
  onChange: (key: AddressFieldKey, value: string) => void
  /** Countries offered in the country select; defaults to all region countries. */
  countries: CountryOption[]
  disabled?: boolean
  /** Which optional fields to show. */
  show?: Partial<Record<"company" | "address_2" | "phone", boolean>>
  testIdPrefix?: string
  className?: string
}

/**
 * Address form fields used by checkout and the account address book. Fields
 * are controlled so customer input survives server-side validation errors.
 * Native names are preserved so the parent `<form action>` still receives
 * the same FormData shape Medusa's actions expect.
 */
export function AddressFields({
  prefix,
  values,
  onChange,
  countries,
  disabled,
  show = { company: true, address_2: false, phone: true },
  testIdPrefix = prefix.replace("_address", ""),
  className,
}: AddressFieldsProps) {
  const id = React.useId()
  const nameFor = (key: AddressFieldKey) =>
    prefix ? `${prefix}.${key}` : key

  const field = (key: AddressFieldKey) => ({
    id: `${id}-${key}`,
    name: nameFor(key),
    value: values[key],
    disabled,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(key, e.target.value),
  })

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      <Field label="First name" htmlFor={`${id}-first_name`}>
        <Input
          {...field("first_name")}
          autoComplete="given-name"
          required
          data-testid={`${testIdPrefix}-first-name-input`}
        />
      </Field>
      <Field label="Last name" htmlFor={`${id}-last_name`}>
        <Input
          {...field("last_name")}
          autoComplete="family-name"
          required
          data-testid={`${testIdPrefix}-last-name-input`}
        />
      </Field>
      <Field label="Address" htmlFor={`${id}-address_1`} className="sm:col-span-2">
        <Input
          {...field("address_1")}
          autoComplete="address-line1"
          required
          data-testid={`${testIdPrefix}-address-input`}
        />
      </Field>
      {show.address_2 && (
        <Field
          label="Apartment, suite, etc."
          optional
          htmlFor={`${id}-address_2`}
          className="sm:col-span-2"
        >
          <Input
            {...field("address_2")}
            autoComplete="address-line2"
            data-testid={`${testIdPrefix}-address-2-input`}
          />
        </Field>
      )}
      {show.company && (
        <Field label="Company" optional htmlFor={`${id}-company`} className="sm:col-span-2">
          <Input
            {...field("company")}
            autoComplete="organization"
            data-testid={`${testIdPrefix}-company-input`}
          />
        </Field>
      )}
      <Field label="Postal code" htmlFor={`${id}-postal_code`}>
        <Input
          {...field("postal_code")}
          autoComplete="postal-code"
          required
          data-testid={`${testIdPrefix}-postal-code-input`}
        />
      </Field>
      <Field label="City" htmlFor={`${id}-city`}>
        <Input
          {...field("city")}
          autoComplete="address-level2"
          required
          data-testid={`${testIdPrefix}-city-input`}
        />
      </Field>
      <Field label="Country" htmlFor={`${id}-country_code`}>
        <Select
          name={nameFor("country_code")}
          value={values.country_code || undefined}
          onValueChange={(v) => onChange("country_code", v)}
          disabled={disabled}
          required
        >
          <SelectTrigger
            id={`${id}-country_code`}
            data-testid={`${testIdPrefix}-country-select`}
          >
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((c) => (
              <SelectItem key={c.iso_2} value={c.iso_2}>
                {c.display_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field label="State / Province" optional htmlFor={`${id}-province`}>
        <Input
          {...field("province")}
          autoComplete="address-level1"
          data-testid={`${testIdPrefix}-province-input`}
        />
      </Field>
      {show.phone && (
        <Field label="Phone" optional htmlFor={`${id}-phone`} className="sm:col-span-2">
          <Input
            {...field("phone")}
            type="tel"
            autoComplete="tel"
            data-testid={`${testIdPrefix}-phone-input`}
          />
        </Field>
      )}
    </div>
  )
}

export function Field({
  label,
  htmlFor,
  optional,
  className,
  children,
}: {
  label: string
  htmlFor: string
  optional?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {optional && (
          <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
        )}
      </Label>
      {children}
    </div>
  )
}

/** One-line address for summaries. */
export function formatAddressLine(
  address?: HttpTypes.StoreCartAddress | HttpTypes.StoreCustomerAddress | null
) {
  if (!address) return ""
  return [
    address.address_1,
    address.address_2,
    [address.postal_code, address.city].filter(Boolean).join(" "),
    address.province,
    address.country_code?.toUpperCase(),
  ]
    .filter(Boolean)
    .join(", ")
}
