import { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/common/empty-state"
import { LocalizedLink } from "@/components/common/localized-link"

export const metadata: Metadata = {
  title: "Cart not found",
}

export default function NotFound() {
  return (
    <div className="content-container py-24">
      <EmptyState
        title="Cart not found"
        description="The cart you tried to access does not exist. Clear your cookies and try again."
        action={
          <Button asChild>
            <LocalizedLink href="/">Go to homepage</LocalizedLink>
          </Button>
        }
      />
    </div>
  )
}
