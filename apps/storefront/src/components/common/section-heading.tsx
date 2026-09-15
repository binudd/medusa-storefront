import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { LocalizedLink } from "./localized-link"

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  link?: { label: string; href: string }
  align?: "left" | "center"
  className?: string
  as?: "h1" | "h2" | "h3"
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  link,
  align = "left",
  className,
  as: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "items-center text-center sm:flex-col sm:items-center",
        className
      )}
    >
      <div className={cn("space-y-2", align === "center" && "mx-auto max-w-xl")}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Heading className="text-2xl font-medium sm:text-3xl">{title}</Heading>
        {description && (
          <p className="max-w-prose text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {link && (
        <LocalizedLink
          href={link.href}
          className="group inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          {link.label}
          <ArrowRight
            className="size-4 transition-transform duration-fast group-hover:translate-x-0.5"
            aria-hidden
          />
        </LocalizedLink>
      )}
    </div>
  )
}
