import { Metadata } from "next"
import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import VerifyAccount from "@modules/account/components/verify-account"

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Verify your email address to complete your registration.",
}

export default function VerifyAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="content-container py-16">
          <Skeleton className="mx-auto h-8 w-48" />
        </div>
      }
    >
      <VerifyAccount />
    </Suspense>
  )
}
