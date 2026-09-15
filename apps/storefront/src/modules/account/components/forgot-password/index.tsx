"use client"

import { useActionState } from "react"

import { requestPasswordReset } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@/components/common/error-message"
import { Field } from "@/components/commerce/address-fields"
import { SubmitButton } from "@modules/checkout/components/submit-button"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

export function ForgotPassword({ setCurrentView }: Props) {
  const [message, formAction] = useActionState(requestPasswordReset, null)

  return (
    <div className="flex w-full flex-col">
      <h1 className="text-2xl font-medium tracking-tight">Reset password</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the email on your account. If we find a match, we&apos;ll send a
        reset link.
      </p>
      {message?.state === "success" ? (
        <p className="mt-8 rounded-md border bg-muted px-3 py-3 text-sm" role="status">
          If an account exists for that email, a reset link is on its way.
        </p>
      ) : (
        <form className="mt-8 space-y-4" action={formAction}>
          <Field label="Email" htmlFor="forgot-email">
            <Input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </Field>
          <ErrorMessage
            error={message?.state === "error" ? message.error : null}
          />
          <SubmitButton className="w-full">Send reset link</SubmitButton>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </button>
      </p>
    </div>
  )
}
