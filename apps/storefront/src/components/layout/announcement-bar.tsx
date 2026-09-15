"use client"

import * as React from "react"

import { storeConfig } from "@/config"
import { LocalizedLink } from "@/components/common/localized-link"

const ROTATE_MS = 5000

/**
 * Slim rotating announcement strip. Rotation pauses on hover/focus and is
 * disabled entirely when the user prefers reduced motion.
 */
export function AnnouncementBar() {
  const messages = storeConfig.announcement?.messages ?? []
  const [index, setIndex] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (messages.length < 2 || paused) return
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % messages.length),
      ROTATE_MS
    )
    return () => clearInterval(timer)
  }, [messages.length, paused])

  if (!storeConfig.features.announcementBar || messages.length === 0) {
    return null
  }

  const current = messages[index]

  return (
    <div
      className="flex h-announcement items-center justify-center bg-primary px-4 text-center text-xs font-medium text-primary-foreground"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p aria-live="polite" className="truncate">
        {current.href ? (
          <LocalizedLink
            href={current.href}
            className="underline-offset-4 hover:underline"
          >
            {current.text}
          </LocalizedLink>
        ) : (
          current.text
        )}
      </p>
    </div>
  )
}
