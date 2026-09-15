"use client"

import { useFormStatus } from "react-dom"

import { Button, type ButtonProps } from "@/components/ui/button"

/** Submit button that reflects the enclosing `<form action>` pending state. */
export function SubmitButton({
  children,
  size = "lg",
  ...props
}: Omit<ButtonProps, "type" | "isLoading">) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" size={size} isLoading={pending} {...props}>
      {children}
    </Button>
  )
}
