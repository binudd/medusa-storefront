import { Metadata } from "next"

import { ProductListing } from "@modules/store/templates/product-listing"
import { SearchForm } from "@/components/commerce/search-form"

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { q } = await props.searchParams
  const query = typeof q === "string" ? q.trim() : ""
  return {
    title: query ? `Search results for “${query}”` : "Search",
    robots: { index: false },
  }
}

export default async function SearchPage(props: Props) {
  const [params, searchParams] = await Promise.all([
    props.params,
    props.searchParams,
  ])
  const q = typeof searchParams.q === "string" ? searchParams.q.trim() : ""

  if (!q) {
    return (
      <div className="content-container py-12 lg:py-20">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-medium sm:text-4xl">Search</h1>
          <p className="mt-3 text-muted-foreground">
            Find products by name, material or collection.
          </p>
          <div className="mt-8">
            <SearchForm autoFocus />
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProductListing
      countryCode={params.countryCode}
      searchParams={searchParams}
      title={`Results for “${q}”`}
      breadcrumbs={[{ label: "Search", href: "/search" }, { label: q }]}
      q={q}
      emptyTitle={`No results for “${q}”`}
      emptyDescription="Check the spelling or try a broader term. You can also browse the full range."
    />
  )
}
