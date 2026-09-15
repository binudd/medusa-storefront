"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/common/empty-state"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="content-container flex min-h-[60vh] items-center justify-center py-24">
      <EmptyState
        title="Something went wrong"
        description="We couldn't load this page. Your bag has been saved — please try again."
        action={
          <Button onClick={reset} type="button">
            Try again
          </Button>
        }
      />
    </div>
  )
}
