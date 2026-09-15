import { Skeleton } from "@/components/ui/skeleton"

export function CartPageSkeleton() {
  return (
    <div className="content-container py-8 lg:py-12" aria-busy>
      <Skeleton className="h-9 w-40" />
      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid grid-cols-[96px_1fr] gap-4">
              <Skeleton className="aspect-product" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4 rounded-md border p-6">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}
