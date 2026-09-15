"use client"

import { HttpTypes } from "@medusajs/types"
import { useParams, usePathname } from "next/navigation"
import * as React from "react"
import ReactCountryFlag from "react-country-flag"

import { updateRegion } from "@lib/data/cart"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type RegionSwitcherProps = {
  regions: HttpTypes.StoreRegion[]
  className?: string
}

/**
 * Lets the customer change shipping country. `updateRegion` moves the cart
 * to the new region and redirects to the same path under the new prefix.
 */
export function RegionSwitcher({ regions, className }: RegionSwitcherProps) {
  const id = React.useId()
  const { countryCode } = useParams<{ countryCode: string }>()
  const pathname = usePathname()
  const [pending, startTransition] = React.useTransition()

  const options = React.useMemo(
    () =>
      regions
        .flatMap((r) =>
          (r.countries ?? []).map((c) => ({
            code: c.iso_2 ?? "",
            label: c.display_name ?? c.iso_2 ?? "",
          }))
        )
        .filter((o) => o.code)
        .sort((a, b) => a.label.localeCompare(b.label)),
    [regions]
  )

  const currentPath = pathname.split(`/${countryCode}`)[1] || ""

  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block text-xs text-muted-foreground">
        Shipping to
      </Label>
      <Select
        value={countryCode}
        disabled={pending}
        onValueChange={(code) => {
          if (code === countryCode) return
          startTransition(async () => {
            await updateRegion(code, currentPath)
          })
        }}
      >
        <SelectTrigger id={id} className="h-10" aria-busy={pending}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.code} value={o.code}>
              <span className="inline-flex items-center gap-2">
                <ReactCountryFlag
                  svg
                  countryCode={o.code}
                  style={{ width: 16, height: 16 }}
                  aria-hidden
                />
                {o.label}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
