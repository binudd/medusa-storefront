"use client"

import { useParams } from "next/navigation"
import * as React from "react"

import { storeConfig } from "@/config"
import { cn } from "@/lib/utils"
import { LocalizedLink } from "@/components/common/localized-link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

import type { NavigationData } from "./types"

/**
 * Desktop primary navigation. Categories with children open a mega menu;
 * everything else is a plain link. Hidden below `lg`.
 */
export function HeaderNav({ categories, collections }: NavigationData) {
  const { countryCode } = useParams<{ countryCode: string }>()
  const prefix = `/${countryCode}`
  const megaMenu = storeConfig.features.megaMenu

  return (
    <NavigationMenu className="hidden lg:flex" aria-label="Primary">
      <NavigationMenuList>
        {storeConfig.navigation.primary.map((link) => (
          <NavigationMenuItem key={`${link.label}:${link.href}`}>
            <NavigationMenuLink asChild>
              <LocalizedLink
                href={link.href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  link.emphasis && "text-sale hover:text-sale"
                )}
              >
                {link.label}
              </LocalizedLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}

        {categories.map((category) =>
          megaMenu && category.children.length > 0 ? (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuTrigger>{category.name}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[560px] grid-cols-[1fr_200px] gap-8 p-6">
                  <div>
                    <p className="eyebrow mb-3">{category.name}</p>
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <LocalizedLink
                            href={`/categories/${category.handle}`}
                            className="block py-1 text-sm font-medium hover:underline underline-offset-4"
                          >
                            All {category.name}
                          </LocalizedLink>
                        </NavigationMenuLink>
                      </li>
                      {category.children.map((child) => (
                        <li key={child.id}>
                          <NavigationMenuLink asChild>
                            <LocalizedLink
                              href={`/categories/${category.handle}/${child.handle}`}
                              className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {child.name}
                            </LocalizedLink>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {collections.length > 0 && (
                    <div className="border-l pl-6">
                      <p className="eyebrow mb-3">Collections</p>
                      <ul className="space-y-2">
                        {collections.slice(0, 6).map((c) => (
                          <li key={c.id}>
                            <NavigationMenuLink asChild>
                              <LocalizedLink
                                href={`/collections/${c.handle}`}
                                className="block py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                              >
                                {c.title}
                              </LocalizedLink>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ) : (
            <NavigationMenuItem key={category.id}>
              <NavigationMenuLink asChild>
                <LocalizedLink
                  href={`/categories/${category.handle}`}
                  className={navigationMenuTriggerStyle()}
                >
                  {category.name}
                </LocalizedLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
      <span className="sr-only">{prefix}</span>
    </NavigationMenu>
  )
}
