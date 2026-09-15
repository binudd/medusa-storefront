"use client"

import { Search } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * Dedicated /search form. Submits GET ?q= so it works without JavaScript.
 */
export function SearchForm({
  autoFocus = false,
  defaultQuery = "",
}: {
  autoFocus?: boolean
  defaultQuery?: string
}) {
  const router = useRouter()
  const { countryCode } = useParams<{ countryCode: string }>()
  const [value, setValue] = React.useState(defaultQuery)

  return (
    <form
      role="search"
      action={`/${countryCode}/search`}
      method="get"
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault()
        const q = value.trim()
        if (!q) return
        router.push(`/${countryCode}/search?q=${encodeURIComponent(q)}`)
      }}
    >
      <label htmlFor="search-page-input" className="sr-only">
        Search products
      </label>
      <Input
        id="search-page-input"
        name="q"
        type="search"
        placeholder="Search products…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus}
        autoComplete="off"
        className="h-11"
      />
      <Button type="submit" size="lg" aria-label="Search">
        <Search />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  )
}
