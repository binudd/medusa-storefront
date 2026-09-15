import { storeConfig } from "@/config"

/**
 * First focusable element on every page. Hidden until focused so keyboard
 * users can jump past the sticky header.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
    >
      Skip to {storeConfig.brand.name} content
    </a>
  )
}
