import { HttpTypes } from "@medusajs/types"
import { ArrowUpRight } from "lucide-react"

import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { LocalizedLink } from "@/components/common/localized-link"
import { SectionHeading } from "@/components/common/section-heading"
import { ProductImage } from "@/components/commerce/product-image"

type FeaturedCollectionsProps = {
  region: HttpTypes.StoreRegion
  handles?: string[]
  limit?: number
  title?: string
}

async function collectionCover(
  collectionId: string,
  regionId: string
): Promise<string | null> {
  const { response } = await listProducts({
    regionId,
    queryParams: { collection_id: [collectionId], limit: 1, fields: "thumbnail,images" },
  }).catch(() => ({ response: { products: [] } }))
  const product = response.products[0]
  return product?.thumbnail ?? product?.images?.[0]?.url ?? null
}

export async function FeaturedCollections({
  region,
  handles,
  limit = 3,
  title = "Shop by collection",
}: FeaturedCollectionsProps) {
  const { collections } = await listCollections({
    fields: "id,handle,title",
    ...(handles?.length ? { handle: handles.join(",") } : {}),
  }).catch(() => ({ collections: [], count: 0 }))

  const selected = collections.slice(0, limit)
  if (!selected.length) return null

  const covers = await Promise.all(
    selected.map((c) => collectionCover(c.id, region.id))
  )

  return (
    <section className="content-container py-16 lg:py-24">
      <SectionHeading
        title={title}
        link={{ label: "View all products", href: "/store" }}
      />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {selected.map((collection, i) => (
          <li key={collection.id}>
            <LocalizedLink
              href={`/collections/${collection.handle}`}
              className="group relative block overflow-hidden rounded-lg"
            >
              <ProductImage
                src={covers[i]}
                alt=""
                aspect="aspect-[4/5]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                imageClassName="transition-transform duration-slow ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-foreground/60 to-transparent p-5 text-background">
                <span className="text-lg font-medium">{collection.title}</span>
                <ArrowUpRight
                  className="size-5 shrink-0 transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </div>
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
