import { HttpTypes } from "@medusajs/types"

type FormattableAddress =
  | HttpTypes.StoreCartAddress
  | HttpTypes.StoreCustomerAddress

/** One-line address for summaries. Safe for Server and Client Components. */
export function formatAddressLine(address?: FormattableAddress | null) {
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
