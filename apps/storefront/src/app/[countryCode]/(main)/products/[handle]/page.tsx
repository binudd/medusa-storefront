import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { storeConfig } from "@/config"
import { ProductTemplate } from "@modules/products/templates"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = (await listRegions())
      .flatMap((r) => r.countries?.map((c) => c.iso_2) ?? [])
      .filter((c): c is string => Boolean(c))

    const perCountry = await Promise.all(
      countryCodes.map(async (countryCode) => {
        const { response } = await listProducts({
          countryCode,
          queryParams: { limit: 100, fields: "handle" },
        })
        return response.products
          .filter((p) => p.handle)
          .map((p) => ({ countryCode, handle: p.handle }))
      })
    )

    return perCountry.flat()
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

async function getProduct(handle: string, countryCode: string) {
  return listProducts({
    countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const product = await getProduct(params.handle, params.countryCode)

  if (!product) {
    notFound()
  }

  const description =
    product.description?.slice(0, 160) ??
    `${product.title} | ${storeConfig.brand.name}`

  return {
    title: product.title,
    description,
    alternates: { canonical: `/${params.countryCode}/products/${product.handle}` },
    openGraph: {
      title: product.title,
      description,
      type: "website",
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  const region = await getRegion(params.countryCode)
  if (!region) {
    notFound()
  }

  const product = await getProduct(params.handle, params.countryCode)
  if (!product) {
    notFound()
  }

  return (
    <ProductTemplate
      product={product}
      countryCode={params.countryCode}
      initialVariantId={searchParams.v_id}
    />
  )
}
