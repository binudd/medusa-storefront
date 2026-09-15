import { Metadata } from "next"
import { notFound } from "next/navigation"

import { storeConfig } from "@/config"
import { getRegion } from "@lib/data/regions"
import { HomeSections } from "@/components/sections/home-sections"

export const metadata: Metadata = {
  title: storeConfig.brand.tagline
    ? `${storeConfig.brand.name} — ${storeConfig.brand.tagline}`
    : storeConfig.brand.name,
  description: storeConfig.brand.description,
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return <HomeSections region={region} />
}
