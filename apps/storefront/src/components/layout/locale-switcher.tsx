"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { updateLocale } from "@lib/data/locale-actions"
import type { Locale } from "@lib/data/locales"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const DEFAULT_VALUE = "__default"

function localizedLanguageName(code: string, fallback: string, display: string) {
  try {
    return new Intl.DisplayNames([display], { type: "language" }).of(code) ?? fallback
  } catch {
    return fallback
  }
}

type LocaleSwitcherProps = {
  locales: Locale[]
  currentLocale: string | null
  className?: string
}

export function LocaleSwitcher({
  locales,
  currentLocale,
  className,
}: LocaleSwitcherProps) {
  const id = React.useId()
  const router = useRouter()
  const [pending, startTransition] = React.useTransition()

  const value = currentLocale?.toLowerCase() || DEFAULT_VALUE

  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block text-xs text-muted-foreground">
        Language
      </Label>
      <Select
        value={value}
        disabled={pending}
        onValueChange={(next) => {
          startTransition(async () => {
            await updateLocale(next === DEFAULT_VALUE ? "" : next)
            router.refresh()
          })
        }}
      >
        <SelectTrigger id={id} className="h-10" aria-busy={pending}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DEFAULT_VALUE}>Default</SelectItem>
          {locales.map((locale) => (
            <SelectItem key={locale.code} value={locale.code.toLowerCase()}>
              {localizedLanguageName(
                locale.code,
                locale.name,
                currentLocale ?? "en-US"
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
