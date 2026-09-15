import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { storeConfig } from "@/config"
import {
  Breadcrumb,
  ProductListing,
} from "@modules/store/templates/product-listing"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateStaticParams() {
  const [categories, regions] = await Promise.all([
    listCategories({ fields: "id,handle" }),
    listRegions(),
  ]).catch(() => [[], []] as const)

  const countryCodes = regions
    .flatMap((r) => r.countries?.map((c) => c.iso_2) ?? [])
    .filter((c): c is string => Boolean(c))

  return countryCodes.flatMap((countryCode) =>
    categories.map((category) => ({
      countryCode,
      category: [category.handle],
    }))
  )
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const category = await getCategoryByHandle(params.category).catch(
    () => undefined
  )

  if (!category) {
    notFound()
  }

  return {
    title: category.name,
    description:
      category.description ?? `${category.name} | ${storeConfig.brand.name}`,
    alternates: { canonical: `/categories/${params.category.join("/")}` },
  }
}

function buildBreadcrumbs(
  category: HttpTypes.StoreProductCategory
): Breadcrumb[] {
  const parents: HttpTypes.StoreProductCategory[] = []
  let cursor = category.parent_category
  while (cursor) {
    parents.unshift(cursor)
    cursor = cursor.parent_category
  }
  return [
    { label: "Shop", href: "/store" },
    ...parents.map((p) => ({
      label: p.name,
      href: `/categories/${p.handle}`,
    })),
    { label: category.name },
  ]
}

export default async function CategoryPage(props: Props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])

  const category = await getCategoryByHandle(params.category).catch(
    () => undefined
  )

  if (!category) {
    notFound()
  }

  return (
    <ProductListing
      countryCode={params.countryCode}
      searchParams={searchParams}
      title={category.name}
      description={category.description}
      breadcrumbs={buildBreadcrumbs(category)}
      categoryId={category.id}
      childLinks={category.category_children?.map((child) => ({
        label: child.name,
        href: `/categories/${child.handle}`,
      }))}
    />
  )
}
