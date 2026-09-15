import { ChevronLeft, Lock } from "lucide-react"

import { storeConfig } from "@/config"
import { LocalizedLink } from "@/components/common/localized-link"
import { Logo } from "@/components/layout/logo"

/**
 * Distraction-free checkout chrome: back link, logo and a trust cue. No
 * primary navigation so customers stay focused on completing the order.
 */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b">
        <nav
          className="content-container flex h-16 items-center justify-between"
          aria-label="Checkout"
        >
          <LocalizedLink
            href="/cart"
            className="flex flex-1 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            data-testid="back-to-cart-link"
          >
            <ChevronLeft className="size-4" aria-hidden />
            <span className="hidden sm:inline">Back to bag</span>
            <span className="sm:hidden">Back</span>
          </LocalizedLink>
          <Logo />
          <div className="flex flex-1 items-center justify-end gap-1.5 text-xs text-muted-foreground">
            <Lock className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">Secure checkout</span>
          </div>
        </nav>
      </header>
      <main id="main" className="flex-1" data-testid="checkout-container">
        {children}
      </main>
      <footer className="border-t py-6">
        <div className="content-container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {storeConfig.brand.name}
          </p>
          <ul className="flex gap-4">
            {storeConfig.footer.legal.map((link) => (
              <li key={link.href}>
                <LocalizedLink href={link.href} className="hover:text-foreground">
                  {link.label}
                </LocalizedLink>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  )
}
