"use client"

import { HttpTypes } from "@medusajs/types"

import { cn } from "@/lib/utils"

type VariantSelectorProps = {
  options: HttpTypes.StoreProductOption[]
  selection: Record<string, string | undefined>
  onSelect: (optionId: string, value: string) => void
  isValueAvailable?: (optionId: string, value: string) => boolean
  disabled?: boolean
  className?: string
}

/**
 * Option pickers (Size, Colour, ...) rendered as accessible radio groups.
 * Unavailable combinations remain selectable but are visually struck through
 * so customers can still switch paths.
 */
export function VariantSelector({
  options,
  selection,
  onSelect,
  isValueAvailable,
  disabled,
  className,
}: VariantSelectorProps) {
  return (
    <div className={cn("space-y-5", className)}>
      {options.map((option) => {
        const values = Array.from(
          new Set((option.values ?? []).map((v) => v.value))
        )
        const current = selection[option.id]
        const groupId = `option-${option.id}`

        return (
          <fieldset key={option.id} data-testid="product-options">
            <legend className="mb-2 flex items-baseline gap-2 text-sm">
              <span className="font-medium">{option.title}</span>
              {current && (
                <span className="text-muted-foreground" aria-live="polite">
                  {current}
                </span>
              )}
            </legend>
            <div
              role="radiogroup"
              aria-labelledby={groupId}
              className="flex flex-wrap gap-2"
            >
              <span id={groupId} className="sr-only">
                {option.title}
              </span>
              {values.map((value) => {
                const selected = current === value
                const available = isValueAvailable
                  ? isValueAvailable(option.id, value)
                  : true
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={
                      available ? value : `${value} (unavailable)`
                    }
                    disabled={disabled}
                    onClick={() => onSelect(option.id, value)}
                    data-testid="option-button"
                    className={cn(
                      "relative inline-flex h-10 min-w-10 items-center justify-center rounded-md border px-3.5 text-sm transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-50",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-card hover:border-foreground/60",
                      !available && !selected && "text-muted-foreground line-through"
                    )}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </fieldset>
        )
      })}
    </div>
  )
}
