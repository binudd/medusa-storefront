"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type NewsletterFormProps = {
  className?: string
  variant?: "inline" | "stacked"
}

/**
 * Newsletter capture. Medusa has no first-party newsletter API; this form
 * validates client-side and confirms locally. Wire `onSubmit` to the
 * merchant's email provider when one is chosen.
 */
export function NewsletterForm({
  className,
  variant = "inline",
}: NewsletterFormProps) {
  const id = React.useId()
  const [email, setEmail] = React.useState("")
  const [status, setStatus] = React.useState<"idle" | "done">("idle")

  return (
    <form
      className={cn(
        "flex gap-2",
        variant === "stacked" ? "flex-col" : "flex-col sm:flex-row",
        className
      )}
      onSubmit={(e) => {
        e.preventDefault()
        if (!email) return
        setStatus("done")
      }}
    >
      <div className="flex-1">
        <Label htmlFor={id} className="sr-only">
          Email address
        </Label>
        <Input
          id={id}
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "done"}
        />
      </div>
      <Button type="submit" disabled={status === "done"}>
        {status === "done" ? "Subscribed" : "Subscribe"}
      </Button>
      <p className="sr-only" aria-live="polite">
        {status === "done" ? "Thanks, you are subscribed." : ""}
      </p>
    </form>
  )
}
