import { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/common/empty-state"
import { LocalizedLink } from "@/components/common/localized-link"

export const metadata: Metadata = {
  title: "Page not found",
}

export default function NotFound() {
  return (
    <div className="content-container py-24">
      <EmptyState
        title="Nothing to check out"
        description="Your bag is empty or the page you tried to access does not exist."
        action={
          <Button asChild>
            <LocalizedLink href="/store">Continue shopping</LocalizedLink>
          </Button>
        }
      />
    </div>
  )
}
