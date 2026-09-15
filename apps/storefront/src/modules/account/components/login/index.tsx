"use client"

import { useActionState } from "react"

import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import { storeConfig } from "@/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ErrorMessage } from "@/components/common/error-message"
import { Field } from "@/components/commerce/address-fields"
import { SubmitButton } from "@modules/checkout/components/submit-button"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="flex w-full flex-col" data-testid="login-page">
      <h1 className="text-2xl font-medium tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to {storeConfig.brand.name} to view orders, addresses and a
        faster checkout.
      </p>
      {message?.state === "verification_required" && (
        <p
          className="mt-6 rounded-md border bg-muted px-3 py-3 text-sm"
          data-testid="login-verification-message"
          role="status"
        >
          We sent a verification link to <strong>{message.email}</strong>.
          Verify your email, then sign in.
        </p>
      )}
      <form className="mt-8 space-y-4" action={formAction}>
        <Field label="Email" htmlFor="login-email">
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            data-testid="email-input"
          />
        </Field>
        <Field label="Password" htmlFor="login-password">
          <Input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </Field>
        <div className="flex justify-end">
          <Button
            type="button"
            variant="link"
            className="h-auto text-xs text-muted-foreground"
            onClick={() => setCurrentView(LOGIN_VIEW.FORGOT)}
          >
            Forgot password?
          </Button>
        </div>
        <ErrorMessage
          error={message?.state === "error" ? message.error : null}
          data-testid="login-error-message"
        />
        <SubmitButton className="w-full" data-testid="sign-in-button">
          Sign in
        </SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <button
          type="button"
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="font-medium text-foreground underline-offset-4 hover:underline"
          data-testid="register-button"
        >
          Create an account
        </button>
      </p>
    </div>
  )
}

export default Login
