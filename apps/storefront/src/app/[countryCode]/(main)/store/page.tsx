import { Metadata } from "next"

import { storeConfig } from "@/config"
import { ProductListing } from "@modules/store/templates/product-listing"

export const metadata: Metadata = {
  title: "Shop all",
  description: `Explore the full ${storeConfig.brand.name} range.`,
}

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
  params: Promise<{ countryCode: string }>
}

export default async function StorePage(props: Props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  return (
    <ProductListing
      countryCode={params.countryCode}
      searchParams={searchParams}
      title="Shop all"
      description={`Explore the full ${storeConfig.brand.name} range.`}
    />
  )
}
