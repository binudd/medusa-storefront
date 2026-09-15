"use client"

import { HttpTypes } from "@medusajs/types"
import { ChevronRight, Menu, User } from "lucide-react"

import { storeConfig } from "@/config"
import { useUiStore } from "@/store/ui.store"
import type { Locale } from "@lib/data/locales"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LocalizedLink } from "@/components/common/localized-link"
import { Separator } from "@/components/ui/separator"

import { RegionSwitcher } from "./region-switcher"
import { LocaleSwitcher } from "./locale-switcher"
import type { NavigationData } from "./types"

type MobileNavProps = NavigationData & {
  regions: HttpTypes.StoreRegion[]
  locales: Locale[] | null
  currentLocale: string | null
}

/**
 * Off-canvas navigation for < lg. Open state lives in the UI store so other
 * components (e.g. route change) can close it.
 */
export function MobileNav({
  categories,
  collections,
  regions,
  locales,
  currentLocale,
}: MobileNavProps) {
  const open = useUiStore((s) => s.mobileNavOpen)
  const setOpen = useUiStore((s) => s.setMobileNavOpen)
  const close = () => setOpen(false)

  const linkClass =
    "flex items-center justify-between py-3 text-base font-medium"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden -ml-2"
          aria-label="Open menu"
          data-testid="nav-menu-button"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm p-0">
        <SheetHeader>
          <SheetTitle>{storeConfig.brand.name}</SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation
          </SheetDescription>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto px-5 py-2" aria-label="Mobile">
          <ul className="divide-y">
            {storeConfig.navigation.primary.map((link) => (
              <li key={`${link.label}:${link.href}`}>
                <LocalizedLink
                  href={link.href}
                  onClick={close}
                  className={linkClass}
                >
                  {link.label}
                  <ChevronRight className="size-4 text-muted-foreground" />
                </LocalizedLink>
              </li>
            ))}
          </ul>

          {categories.length > 0 && (
            <Accordion type="multiple" className="mt-1">
              {categories.map((category) =>
                category.children.length > 0 ? (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="text-base font-medium py-3">
                      {category.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-1 pl-2">
                        <li>
                          <LocalizedLink
                            href={`/categories/${category.handle}`}
                            onClick={close}
                            className="block py-2 text-sm font-medium"
                          >
                            All {category.name}
                          </LocalizedLink>
                        </li>
                        {category.children.map((child) => (
                          <li key={child.id}>
                            <LocalizedLink
                              href={`/categories/${category.handle}/${child.handle}`}
                              onClick={close}
                              className="block py-2 text-sm text-muted-foreground"
                            >
                              {child.name}
                            </LocalizedLink>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ) : (
                  <div key={category.id} className="border-b">
                    <LocalizedLink
                      href={`/categories/${category.handle}`}
                      onClick={close}
                      className={linkClass}
                    >
                      {category.name}
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </LocalizedLink>
                  </div>
                )
              )}
            </Accordion>
          )}

          {collections.length > 0 && (
            <div className="mt-6">
              <p className="eyebrow mb-2">Collections</p>
              <ul className="space-y-1">
                {collections.slice(0, 8).map((c) => (
                  <li key={c.id}>
                    <LocalizedLink
                      href={`/collections/${c.handle}`}
                      onClick={close}
                      className="block py-2 text-sm text-muted-foreground"
                    >
                      {c.title}
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator className="my-6" />

          <LocalizedLink
            href="/account"
            onClick={close}
            className="flex items-center gap-3 py-3 text-sm font-medium"
            data-testid="nav-account-link"
          >
            <User className="size-4" aria-hidden />
            Account
          </LocalizedLink>
        </nav>

        <div className="space-y-3 border-t px-5 py-4 pb-safe">
          {storeConfig.features.regionSwitcher && regions.length > 0 && (
            <RegionSwitcher regions={regions} />
          )}
          {storeConfig.features.languageSwitcher && !!locales?.length && (
            <LocaleSwitcher locales={locales} currentLocale={currentLocale} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
