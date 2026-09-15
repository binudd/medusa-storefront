import React from "react"

import { storeConfig } from "@/config"
import { HttpTypes } from "@medusajs/types"
import { LocalizedLink } from "@/components/common/localized-link"

import AccountNav from "../components/account-nav"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="content-container py-10 lg:py-16" data-testid="account-page">
      {customer ? (
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <AccountNav customer={customer} />
          <div className="min-w-0">{children}</div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-md py-6">{children}</div>
      )}
      <aside className="mt-16 border-t pt-8 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Need help?</p>
        <p className="mt-1 max-w-xl">
          Questions about an order or a return can be sent to{" "}
          <a
            href={`mailto:${storeConfig.brand.supportEmail}`}
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {storeConfig.brand.supportEmail}
          </a>
          .
        </p>
        <LocalizedLink
          href="/store"
          className="mt-3 inline-block underline-offset-4 hover:text-foreground hover:underline"
        >
          Continue shopping
        </LocalizedLink>
      </aside>
    </div>
  )
}

export default AccountLayout
