import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCollectionByHandle, listCollections } from "@lib/data/collections"
import { listRegions } from "@lib/data/regions"
import { storeConfig } from "@/config"
import { ProductListing } from "@modules/store/templates/product-listing"

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateStaticParams() {
  const [{ collections }, regions] = await Promise.all([
    listCollections({ fields: "id,handle" }),
    listRegions(),
  ]).catch(() => [{ collections: [] }, []] as const)

  const countryCodes = regions
    .flatMap((r) => r.countries?.map((c) => c.iso_2) ?? [])
    .filter((c): c is string => Boolean(c))

  return countryCodes.flatMap((countryCode) =>
    collections
      .filter((c) => Boolean(c.handle))
      .map((c) => ({ countryCode, handle: c.handle }))
  )
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  return {
    title: collection.title,
    description: `${collection.title} | ${storeConfig.brand.name}`,
  }
}

export default async function CollectionPage(props: Props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  return (
    <ProductListing
      countryCode={params.countryCode}
      searchParams={searchParams}
      title={collection.title}
      breadcrumbs={[
        { label: "Shop", href: "/store" },
        { label: collection.title },
      ]}
      collectionId={collection.id}
    />
  )
}
