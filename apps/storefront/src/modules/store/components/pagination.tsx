"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { useListingParams } from "../hooks/use-listing-params"

type PaginationProps = {
  page: number
  totalPages: number
  "data-testid"?: string
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

/** Returns page numbers with `null` for ellipses. */
function pageItems(page: number, total: number): (number | null)[] {
  if (total <= 7) return range(1, total)
  if (page <= 4) return [...range(1, 5), null, total]
  if (page >= total - 3) return [1, null, ...range(total - 4, total)]
  return [1, null, page - 1, page, page + 1, null, total]
}

export function Pagination({
  page,
  totalPages,
  "data-testid": dataTestId,
}: PaginationProps) {
  const { update } = useListingParams()

  if (totalPages <= 1) return null

  const go = (p: number) => update({ page: p }, { keepPage: true })

  return (
    <nav
      className="mt-12 flex items-center justify-center gap-1"
      aria-label="Pagination"
      data-testid={dataTestId}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </Button>
      {pageItems(page, totalPages).map((item, i) =>
        item === null ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Button
            key={item}
            variant="ghost"
            size="icon-sm"
            onClick={() => go(item)}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              "text-sm tabular-nums",
              item === page && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            {item}
          </Button>
        )
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight />
      </Button>
    </nav>
  )
}
