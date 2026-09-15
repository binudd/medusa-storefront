"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import * as React from "react"

type LocalizedLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  /** Path relative to the country prefix, e.g. `/store`. Absolute URLs pass through. */
  href: string
}

function isExternal(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href)
}

/**
 * A `next/link` that keeps the current `[countryCode]` prefix. Use this for
 * every internal navigation so region context is never lost.
 */
const LocalizedLink = React.forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  ({ href, children, ...props }, ref) => {
    const params = useParams<{ countryCode?: string }>()
    const countryCode = params?.countryCode

    const resolved =
      isExternal(href) || !countryCode ? href : `/${countryCode}${href}`

    return (
      <Link ref={ref} href={resolved} {...props}>
        {children}
      </Link>
    )
  }
)
LocalizedLink.displayName = "LocalizedLink"

export { LocalizedLink }
