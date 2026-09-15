import { ProductGridSkeleton } from "@/components/commerce/product-grid"
import { Skeleton } from "@/components/ui/skeleton"

/** Route-level loading UI for all listing pages. */
export function ProductListingSkeleton() {
  return (
    <div className="content-container py-8 lg:py-12" aria-busy>
      <div className="mb-8 max-w-2xl space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden space-y-4 lg:block">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </aside>
        <div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-40" />
          </div>
          <div className="mt-6">
            <ProductGridSkeleton count={8} columns={4} />
          </div>
        </div>
      </div>
    </div>
  )
}
