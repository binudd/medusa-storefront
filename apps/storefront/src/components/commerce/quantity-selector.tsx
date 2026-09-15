"use client"

import { Minus, Plus } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { clamp } from "@/lib/utils"

type QuantitySelectorProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
  size?: "sm" | "md"
  className?: string
  label?: string
}

/**
 * Accessible stepper. Emits clamped integer values; the parent decides
 * whether a change means "update" or "remove" (e.g. when hitting 0).
 */
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled,
  size = "md",
  className,
  label = "Quantity",
}: QuantitySelectorProps) {
  const id = React.useId()
  const [draft, setDraft] = React.useState(String(value))

  React.useEffect(() => {
    setDraft(String(value))
  }, [value])

  const commit = (next: number) => {
    const clamped = clamp(Math.round(next), min, max)
    setDraft(String(clamped))
    if (clamped !== value) onChange(clamped)
  }

  const btn =
    "inline-flex items-center justify-center text-foreground transition-colors hover:bg-accent disabled:opacity-40 disabled:hover:bg-transparent"
  const h = size === "sm" ? "h-9" : "h-11"
  const w = size === "sm" ? "w-9" : "w-11"

  return (
    <div
      className={cn(
        "inline-flex items-stretch rounded-md border border-input bg-card",
        h,
        className
      )}
      role="group"
      aria-labelledby={`${id}-label`}
    >
      <span id={`${id}-label`} className="sr-only">
        {label}
      </span>
      <button
        type="button"
        className={cn(btn, w, "rounded-l-md")}
        onClick={() => commit(value - 1)}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="size-3.5" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        className="w-10 border-x border-input bg-transparent text-center text-sm tabular-nums [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={draft}
        min={min}
        max={max}
        disabled={disabled}
        aria-label={label}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          const n = Number(draft)
          if (Number.isFinite(n)) commit(n)
          else setDraft(String(value))
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur()
        }}
      />
      <button
        type="button"
        className={cn(btn, w, "rounded-r-md")}
        onClick={() => commit(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}
