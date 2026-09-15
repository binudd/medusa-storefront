import { HttpTypes } from "@medusajs/types"

import { getProductPrice } from "@lib/util/get-product-price"
import { isProductInStock } from "@lib/util/sort-products"
import { Badge } from "@/components/ui/badge"
import { LocalizedLink } from "@/components/common/localized-link"
import { cn } from "@/lib/utils"

import { Price } from "./price"
import { ProductImage } from "./product-image"

type ProductCardProps = {
  product: HttpTypes.StoreProduct
  priority?: boolean
  sizes?: string
  className?: string
}

/**
 * Product tile used in grids, rails and search. Shows a secondary image on
 * hover when the product has one. Pure presentation; prices come from the
 * region-priced product passed in.
 */
export function ProductCard({
  product,
  priority,
  sizes,
  className,
}: ProductCardProps) {
  const { cheapestPrice } = getProductPrice({ product })
  const primary = product.thumbnail ?? product.images?.[0]?.url ?? null
  const secondary =
    product.images?.find((img) => img.url && img.url !== primary)?.url ?? null
  const inStock = isProductInStock(product)
  const isSale = cheapestPrice?.price_type === "sale"

  return (
    <LocalizedLink
      href={`/products/${product.handle}`}
      className={cn("group block focus-visible:rounded-md", className)}
      data-testid="product-wrapper"
    >
      <div className="relative">
        <ProductImage
          src={primary}
          alt={product.title}
          priority={priority}
          sizes={sizes}
          imageClassName={cn(
            "transition-opacity duration-slow ease-out",
            secondary && "group-hover:opacity-0"
          )}
        />
        {secondary && (
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-slow ease-out group-hover:opacity-100">
            <ProductImage src={secondary} alt="" sizes={sizes} />
          </div>
        )}
        {(isSale || !inStock) && (
          <div className="absolute left-2 top-2 flex gap-1.5">
            {isSale && <Badge variant="sale">Sale</Badge>}
            {!inStock && <Badge variant="muted">Sold out</Badge>}
          </div>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-1">
        <h3
          className="text-sm leading-snug text-foreground transition-colors group-hover:text-foreground/70"
          data-testid="product-title"
        >
          {product.title}
        </h3>
        <Price price={cheapestPrice} from={(product.variants?.length ?? 0) > 1} size="sm" />
      </div>
    </LocalizedLink>
  )
}
