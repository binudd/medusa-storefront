import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/common/empty-state"
import { LocalizedLink } from "@/components/common/localized-link"

export function NotFoundContent({
  title = "Page not found",
  description = "The page you tried to open does not exist or has been moved.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="content-container py-24">
      <EmptyState
        title={title}
        description={description}
        action={
          <Button asChild>
            <LocalizedLink href="/">Back to the store</LocalizedLink>
          </Button>
        }
      />
    </div>
  )
}
