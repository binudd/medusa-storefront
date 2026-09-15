"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"

import { confirmEmailVerification } from "@lib/data/customer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LocalizedLink } from "@/components/common/localized-link"

type VerificationState = "verifying" | "success" | "error"

const VerifyAccount = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [state, setState] = useState<VerificationState>("verifying")
  const confirmed = useRef(false)

  useEffect(() => {
    if (confirmed.current) return
    confirmed.current = true

    if (!token) {
      setState("error")
      return
    }

    confirmEmailVerification(token).then(({ success }) =>
      setState(success ? "success" : "error")
    )
  }, [token])

  return (
    <div
      className="mx-auto max-w-md py-16 text-center"
      data-testid="verify-account-page"
    >
      <h1 className="text-2xl font-medium tracking-tight">Email verification</h1>
      {state === "verifying" && (
        <div className="mt-6 space-y-3">
          <Skeleton className="mx-auto h-4 w-48" />
          <p className="text-sm text-muted-foreground">Verifying your email…</p>
        </div>
      )}
      {state === "success" && (
        <>
          <p className="mt-4 text-sm text-muted-foreground">
            Your email is verified. You can now sign in.
          </p>
          <Button asChild className="mt-6">
            <LocalizedLink href="/account">Go to sign in</LocalizedLink>
          </Button>
        </>
      )}
      {state === "error" && (
        <>
          <p className="mt-4 text-sm text-muted-foreground">
            This verification link is invalid or has expired. Sign in to receive
            a new one.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <LocalizedLink href="/account">Go to sign in</LocalizedLink>
          </Button>
        </>
      )}
    </div>
  )
}

export default VerifyAccount
