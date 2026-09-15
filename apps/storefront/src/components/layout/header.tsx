import { User } from "lucide-react"

import { storeConfig } from "@/config"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { getNavigationData } from "@lib/data/navigation"
import { listRegions } from "@lib/data/regions"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/common/localized-link"

import { AnnouncementBar } from "./announcement-bar"
import { CartButton } from "./cart-button"
import { HeaderNav } from "./header-nav"
import { Logo } from "./logo"
import { MobileNav } from "./mobile-nav"
import { SearchTrigger } from "./search-command"

/**
 * Site header. Server component: fetches navigation data once per request
 * and hands it to small client islands (mobile nav, mega menu, cart, search).
 */
export async function Header() {
  const [navigation, regions, locales, currentLocale] = await Promise.all([
    getNavigationData(),
    listRegions().catch(() => []),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 z-40">
      <AnnouncementBar />
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="content-container flex h-header items-center gap-4">
          <div className="flex flex-1 items-center gap-2 lg:hidden">
            <MobileNav
              {...navigation}
              regions={regions ?? []}
              locales={locales}
              currentLocale={currentLocale}
            />
          </div>

          <div className="flex items-center lg:flex-none">
            <Logo />
          </div>

          <div className="hidden flex-1 lg:flex lg:pl-6">
            <HeaderNav {...navigation} />
          </div>

          <div className="flex flex-1 items-center justify-end gap-0.5 lg:flex-none">
            {storeConfig.features.search && <SearchTrigger />}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden lg:inline-flex"
            >
              <LocalizedLink
                href="/account"
                aria-label="Account"
                data-testid="nav-account-link"
              >
                <User className="size-5" />
              </LocalizedLink>
            </Button>
            <CartButton />
          </div>
        </div>
      </header>
    </div>
  )
}
