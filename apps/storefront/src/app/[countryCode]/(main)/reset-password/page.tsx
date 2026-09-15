import { Metadata } from "next"
import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { ResetPasswordForm } from "@modules/account/components/reset-password"

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false },
}

export default function ResetPasswordPage() {
  return (
    <div className="content-container">
      <Suspense fallback={<Skeleton className="mx-auto mt-16 h-64 max-w-md" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
