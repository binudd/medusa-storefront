import { HttpTypes } from "@medusajs/types"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

import { ProductCard } from "./product-card"

type ProductGridProps = {
  products: HttpTypes.StoreProduct[]
  /** Number of columns at `lg`+. Mobile is always 2. */
  columns?: 3 | 4
  className?: string
  /** Mark the first N images as priority (above the fold). */
  priorityCount?: number
}

const columnClass = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-3 xl:grid-cols-4",
}

const sizesFor = {
  3: "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw",
  4: "(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw",
}

export function ProductGrid({
  products,
  columns = 4,
  className,
  priorityCount = 0,
}: ProductGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10",
        columnClass[columns],
        className
      )}
      data-testid="products-list"
    >
      {products.map((product, i) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={i < priorityCount}
            sizes={sizesFor[columns]}
          />
        </li>
      ))}
    </ul>
  )
}

export function ProductGridSkeleton({
  count = 8,
  columns = 4,
}: {
  count?: number
  columns?: 3 | 4
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10",
        columnClass[columns]
      )}
      aria-busy
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="space-y-3">
          <Skeleton className="aspect-product w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </li>
      ))}
    </ul>
  )
}
