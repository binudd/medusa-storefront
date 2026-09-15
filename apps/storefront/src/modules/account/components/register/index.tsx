"use client"

import { useActionState } from "react"

import { signup } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { storeConfig } from "@/config"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@/components/common/error-message"
import { Field } from "@/components/commerce/address-fields"
import { SubmitButton } from "@modules/checkout/components/submit-button"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div className="flex w-full flex-col" data-testid="register-page">
      <h1 className="text-2xl font-medium tracking-tight">Create an account</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Save addresses, track orders and check out faster next time.
      </p>
      {message?.state === "verification_required" && (
        <p
          className="mt-6 rounded-md border bg-muted px-3 py-3 text-sm"
          data-testid="register-verification-message"
          role="status"
        >
          We sent a verification link to <strong>{message.email}</strong>. Check
          your inbox, then sign in.
        </p>
      )}
      <form className="mt-8 space-y-4" action={formAction}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" htmlFor="register-first-name">
            <Input
              id="register-first-name"
              name="first_name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
            />
          </Field>
          <Field label="Last name" htmlFor="register-last-name">
            <Input
              id="register-last-name"
              name="last_name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
            />
          </Field>
        </div>
        <Field label="Email" htmlFor="register-email">
          <Input
            id="register-email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
        </Field>
        <Field label="Phone" optional htmlFor="register-phone">
          <Input
            id="register-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
        </Field>
        <Field label="Password" htmlFor="register-password">
          <Input
            id="register-password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </Field>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="register-error"
        />
        <p className="text-xs text-muted-foreground">
          By creating an account you agree to {storeConfig.brand.name}&apos;s
          privacy and terms notices.
        </p>
        <SubmitButton className="w-full" data-testid="register-button">
          Create account
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </button>
      </p>
    </div>
  )
}

export default Register
