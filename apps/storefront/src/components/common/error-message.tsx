import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

type ErrorMessageProps = {
  error?: string | null
  className?: string
  "data-testid"?: string
}

/**
 * Inline form/action error. Announced to screen readers via `role="alert"`.
 * Renders nothing when there is no error so callers can place it unconditionally.
 */
export function ErrorMessage({
  error,
  className,
  "data-testid": dataTestId,
}: ErrorMessageProps) {
  if (!error) return null

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive",
        className
      )}
      data-testid={dataTestId}
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{error}</span>
    </div>
  )
}
