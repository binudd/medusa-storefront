"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowRight, Clock, Loader2, Search, X } from "lucide-react"
import * as React from "react"

import { getProductPrice } from "@lib/util/get-product-price"
import { useDebouncedValue } from "@lib/hooks/use-debounced-value"
import { useProductSearch } from "@lib/queries/products"
import { useSearchStore } from "@/store/search.store"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Price } from "@/components/commerce/price"
import { ProductImage } from "@/components/commerce/product-image"

/**
 * Global search palette (Cmd/Ctrl+K). Server results via TanStack Query;
 * open state and recent searches via the search store.
 */
export function SearchCommand() {
  const router = useRouter()
  const { countryCode } = useParams<{ countryCode: string }>()

  const open = useSearchStore((s) => s.open)
  const setOpen = useSearchStore((s) => s.setOpen)
  const recent = useSearchStore((s) => s.recent)
  const addRecent = useSearchStore((s) => s.addRecent)
  const removeRecent = useSearchStore((s) => s.removeRecent)

  const [query, setQuery] = React.useState("")
  const debounced = useDebouncedValue(query, 250)

  const { data, isFetching } = useProductSearch({
    q: debounced,
    countryCode,
    limit: 6,
    enabled: open,
  })

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, setOpen])

  React.useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  const go = (href: string) => {
    setOpen(false)
    router.push(`/${countryCode}${href}`)
  }

  const submitSearch = (term: string) => {
    const value = term.trim()
    if (!value) return
    addRecent(value)
    go(`/search?q=${encodeURIComponent(value)}`)
  }

  const products = data?.products ?? []
  const showRecent = query.trim().length === 0 && recent.length > 0
  const hasQuery = debounced.trim().length > 1

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search products">
      <CommandInput
        placeholder="Search products"
        value={query}
        onValueChange={setQuery}
        onKeyDown={(e) => {
          if (e.key === "Enter" && products.length === 0) {
            e.preventDefault()
            submitSearch(query)
          }
        }}
      />
      <CommandList>
        {showRecent && (
          <CommandGroup heading="Recent searches">
            {recent.map((term) => (
              <CommandItem
                key={term}
                value={`recent-${term}`}
                onSelect={() => submitSearch(term)}
                className="group"
              >
                <Clock className="size-4 text-muted-foreground" aria-hidden />
                <span className="flex-1">{term}</span>
                <button
                  type="button"
                  className="inline-flex size-6 items-center justify-center rounded-sm opacity-0 transition-opacity hover:bg-background group-data-[selected=true]:opacity-100 focus-visible:opacity-100"
                  aria-label={`Remove ${term} from recent searches`}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeRecent(term)
                  }}
                >
                  <X className="size-3.5" />
                </button>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!showRecent && !hasQuery && (
          <div className="px-3 py-10 text-center text-sm text-muted-foreground">
            Start typing to search the catalog.
          </div>
        )}

        {hasQuery && (
          <>
            {isFetching && products.length === 0 && (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Searching
              </div>
            )}
            {!isFetching && products.length === 0 && (
              <CommandEmpty>
                No results for &ldquo;{debounced}&rdquo;. Try a different term.
              </CommandEmpty>
            )}
            {products.length > 0 && (
              <CommandGroup heading="Products">
                {products.map((product) => {
                  const { cheapestPrice } = getProductPrice({ product })
                  return (
                    <CommandItem
                      key={product.id}
                      value={`product-${product.id}`}
                      onSelect={() => {
                        addRecent(debounced)
                        go(`/products/${product.handle}`)
                      }}
                    >
                      <ProductImage
                        src={product.thumbnail}
                        alt=""
                        aspect="aspect-square"
                        sizes="40px"
                        className="size-10 shrink-0 rounded-sm"
                      />
                      <span className="flex-1 truncate">{product.title}</span>
                      <Price price={cheapestPrice} size="sm" />
                    </CommandItem>
                  )
                })}
                <CommandItem
                  value={`all-${debounced}`}
                  onSelect={() => submitSearch(debounced)}
                  className="text-muted-foreground"
                >
                  <Search className="size-4" aria-hidden />
                  <span className="flex-1">
                    See all results for &ldquo;{debounced}&rdquo;
                  </span>
                  <ArrowRight className="size-4" aria-hidden />
                </CommandItem>
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

export function SearchTrigger({ className }: { className?: string }) {
  const setOpen = useSearchStore((s) => s.setOpen)
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={() => setOpen(true)}
      aria-label="Search"
      data-testid="nav-search-button"
    >
      <Search className="size-5" />
    </Button>
  )
}
