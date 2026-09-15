import { Metadata } from "next"

import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartOptions } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { storeConfig } from "@/config"
import { CartTemplate } from "@modules/cart/templates"

export const metadata: Metadata = {
  title: "Bag",
  description: "Review the items in your bag.",
}

export default async function CartPage() {
  const [customer, cart] = await Promise.all([
    retrieveCustomer().catch(() => null),
    retrieveCart().catch(() => null),
  ])

  let shippingOptions: HttpTypes.StoreCartShippingOption[] = []
  if (cart && storeConfig.features.shippingProgress) {
    shippingOptions = await listCartOptions()
      .then((res) => res.shipping_options ?? [])
      .catch(() => [])
  }

  return (
    <CartTemplate isSignedIn={!!customer} shippingOptions={shippingOptions} />
  )
}
