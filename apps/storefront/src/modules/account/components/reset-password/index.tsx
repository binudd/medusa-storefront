"use client"

import { useActionState } from "react"
import { useSearchParams } from "next/navigation"

import { updatePasswordWithToken } from "@lib/data/customer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@/components/common/error-message"
import { Field } from "@/components/commerce/address-fields"
import { LocalizedLink } from "@/components/common/localized-link"
import { SubmitButton } from "@modules/checkout/components/submit-button"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const [message, formAction] = useActionState(updatePasswordWithToken, null)

  if (!token) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Link expired</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This password reset link is missing or invalid. Request a new one from
          the sign-in page.
        </p>
        <Button asChild className="mt-6">
          <LocalizedLink href="/account">Back to sign in</LocalizedLink>
        </Button>
      </div>
    )
  }

  if (message?.state === "success") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Password updated</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You can now sign in with your new password.
        </p>
        <Button asChild className="mt-6">
          <LocalizedLink href="/account">Sign in</LocalizedLink>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <h1 className="text-2xl font-medium tracking-tight">Choose a new password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Use at least 8 characters. You’ll be asked to sign in afterwards.
      </p>
      <form action={formAction} className="mt-8 space-y-4">
        <input type="hidden" name="token" value={token} />
        <Field label="New password" htmlFor="reset-password">
          <Input
            id="reset-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </Field>
        <Field label="Confirm password" htmlFor="reset-password-confirm">
          <Input
            id="reset-password-confirm"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
          />
        </Field>
        <ErrorMessage error={message?.state === "error" ? message.error : null} />
        <SubmitButton className="w-full">Update password</SubmitButton>
      </form>
    </div>
  )
}
