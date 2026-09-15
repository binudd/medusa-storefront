import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="content-container max-w-3xl space-y-6 py-16" aria-busy>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-80" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}
