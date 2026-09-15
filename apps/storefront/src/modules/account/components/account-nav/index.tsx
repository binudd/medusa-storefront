"use client"

import { LogOut, MapPin, Package, User } from "lucide-react"
import { useParams, usePathname } from "next/navigation"

import { signout } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/common/localized-link"

const links = [
  { href: "/account", label: "Overview", testId: "overview-link" },
  { href: "/account/profile", label: "Profile", testId: "profile-link" },
  { href: "/account/addresses", label: "Addresses", testId: "addresses-link" },
  { href: "/account/orders", label: "Orders", testId: "orders-link" },
]

const mobileLinks = [
  { href: "/account/profile", label: "Profile", testId: "profile-link", icon: User },
  { href: "/account/addresses", label: "Addresses", testId: "addresses-link", icon: MapPin },
  { href: "/account/orders", label: "Orders", testId: "orders-link", icon: Package },
]

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const pathname = usePathname()
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const isAccountHome = pathname === `/${countryCode}/account`

  return (
    <nav aria-label="Account">
      <div className="lg:hidden" data-testid="mobile-account-nav">
        {!isAccountHome ? (
          <LocalizedLink
            href="/account"
            className="mb-6 inline-flex text-sm text-muted-foreground hover:text-foreground"
            data-testid="account-main-link"
          >
            ← Account
          </LocalizedLink>
        ) : (
          <p className="mb-6 text-2xl font-medium tracking-tight">
            Hello {customer?.first_name}
          </p>
        )}
        <ul className="divide-y rounded-md border">
          {mobileLinks.map((link) => (
            <li key={link.href}>
              <LocalizedLink
                href={link.href}
                className="flex items-center justify-between px-4 py-4 text-sm"
                data-testid={link.testId}
              >
                <span className="flex items-center gap-3">
                  <link.icon className="size-4 text-muted-foreground" />
                  {link.label}
                </span>
                <span aria-hidden className="text-muted-foreground">
                  →
                </span>
              </LocalizedLink>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm"
              onClick={handleLogout}
              data-testid="logout-button"
            >
              <LogOut className="size-4 text-muted-foreground" />
              Log out
            </button>
          </li>
        </ul>
      </div>

      <div className="hidden lg:block" data-testid="account-nav">
        <p className="eyebrow">Account</p>
        <p
          className="mt-2 text-sm text-muted-foreground"
          data-testid="customer-email"
        >
          {customer?.email}
        </p>
        <ul className="mt-6 space-y-1">
          {links.map((link) => {
            const rest = pathname.split(`/${countryCode}`)[1] ?? pathname
            const active =
              rest === link.href ||
              (link.href !== "/account" && rest.startsWith(link.href))
            return (
              <li key={link.href}>
                <LocalizedLink
                  href={link.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                  data-testid={link.testId}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </LocalizedLink>
              </li>
            )
          })}
          <li>
            <Button
              type="button"
              variant="ghost"
              className="h-auto w-full justify-start px-3 py-2 text-sm font-normal text-muted-foreground"
              onClick={handleLogout}
              data-testid="logout-button"
            >
              Log out
            </Button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default AccountNav
