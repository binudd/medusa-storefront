import { pick, shallowEqual } from "@/lib/utils"

const ADDRESS_KEYS = [
  "first_name",
  "last_name",
  "address_1",
  "company",
  "postal_code",
  "city",
  "country_code",
  "province",
  "phone",
] as const

type AddressLike = Partial<Record<(typeof ADDRESS_KEYS)[number], unknown>>

/** Structural comparison of the customer-facing fields of two addresses. */
export default function compareAddresses(
  address1: AddressLike,
  address2: AddressLike
) {
  return shallowEqual(
    pick(address1, ADDRESS_KEYS) as Record<string, unknown>,
    pick(address2, ADDRESS_KEYS) as Record<string, unknown>
  )
}
