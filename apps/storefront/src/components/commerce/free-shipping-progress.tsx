import { Check } from "lucide-react"

import { convertToLocale } from "@lib/util/money"
import type { FreeShippingProgress as Progress } from "@lib/util/free-shipping"
import { cn } from "@/lib/utils"

type FreeShippingProgressProps = {
  progress: Progress
  className?: string
}

/**
 * Progress toward a conditional free-shipping threshold configured in Medusa.
 * Purely presentational; see `getFreeShippingProgress` for the calculation.
 */
export function FreeShippingProgress({
  progress,
  className,
}: FreeShippingProgressProps) {
  const { targetReached, targetRemaining, percentage, currencyCode } = progress

  return (
    <div
      className={cn("space-y-2 text-xs", className)}
      aria-live="polite"
      data-testid="free-shipping-progress"
    >
      <div className="flex items-center justify-between gap-3">
        {targetReached ? (
          <span className="inline-flex items-center gap-1.5 font-medium text-success">
            <Check className="size-3.5" aria-hidden />
            You have unlocked free shipping
          </span>
        ) : (
          <span className="text-muted-foreground">
            Add{" "}
            <span className="font-medium text-foreground">
              {convertToLocale({
                amount: targetRemaining,
                currency_code: currencyCode,
              })}
            </span>{" "}
            more for free shipping
          </span>
        )}
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percentage)}
        aria-label="Progress toward free shipping"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-slow ease-out",
            targetReached ? "bg-success" : "bg-foreground"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
