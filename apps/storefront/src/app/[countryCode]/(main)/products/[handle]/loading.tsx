import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="content-container py-6 lg:py-12" aria-busy>
      <Skeleton className="mb-6 h-3 w-48" />
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Skeleton className="aspect-product w-full" />
        </div>
        <div className="space-y-6 lg:col-span-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-10 w-12" />
          </div>
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}
