import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { queryKeys } from "@lib/queries/keys"
import { getQueryClient } from "@lib/queries/query-client"
import { getBaseURL } from "@lib/util/env"
import { HttpTypes } from "@medusajs/types"
import { CartDrawer } from "@/components/layout/cart-drawer"
import { CartMismatchBanner } from "@/components/layout/cart-mismatch-banner"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { SearchCommand } from "@/components/layout/search-command"
import { storeConfig } from "@/config"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const [customer, cart] = await Promise.all([
    retrieveCustomer(),
    retrieveCart(),
  ])

  let shippingOptions: HttpTypes.StoreCartShippingOption[] = []
  if (cart && storeConfig.features.shippingProgress) {
    shippingOptions = await listCartOptions()
      .then((res) => res.shipping_options ?? [])
      .catch(() => [])
  }

  // Seed the client cart query with the server-rendered cart so the drawer
  // and header count are correct on first paint without a second request.
  const queryClient = getQueryClient()
  queryClient.setQueryData(queryKeys.cart.detail(), cart)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex min-h-dvh flex-col">
        <Header />
        {customer && cart && (
          <CartMismatchBanner customer={customer} cart={cart} />
        )}
        <main id="main" className="flex-1">
          {props.children}
        </main>
        <Footer />
      </div>
      <CartDrawer shippingOptions={shippingOptions} />
      {storeConfig.features.search && <SearchCommand />}
    </HydrationBoundary>
  )
}
