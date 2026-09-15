import { HttpTypes } from "@medusajs/types"

import { convertToLocale } from "@lib/util/money"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/common/empty-state"
import { LocalizedLink } from "@/components/common/localized-link"
import { PageHeader } from "@/components/common/page-header"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const recent = orders?.slice(0, 5) ?? []

  return (
    <div data-testid="overview-page-wrapper">
      <PageHeader
        title={`Hello ${customer?.first_name ?? ""}`}
        description="A snapshot of your profile, addresses and recent orders."
      />
      <div className="hidden grid-cols-2 gap-4 lg:grid">
        <div className="rounded-md border p-5">
          <p className="text-sm text-muted-foreground">Profile</p>
          <p
            className="mt-2 text-3xl font-medium tabular-nums"
            data-testid="customer-profile-completion"
            data-value={getProfileCompletion(customer)}
          >
            {getProfileCompletion(customer)}%
          </p>
          <p className="mt-1 text-xs text-muted-foreground">completed</p>
        </div>
        <div className="rounded-md border p-5">
          <p className="text-sm text-muted-foreground">Addresses</p>
          <p
            className="mt-2 text-3xl font-medium tabular-nums"
            data-testid="addresses-count"
            data-value={customer?.addresses?.length || 0}
          >
            {customer?.addresses?.length || 0}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">saved</p>
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Recent orders</h2>
          <Button asChild variant="link" className="h-auto">
            <LocalizedLink href="/account/orders">View all</LocalizedLink>
          </Button>
        </div>
        {recent.length ? (
          <ul className="divide-y rounded-md border" data-testid="orders-wrapper">
            {recent.map((order) => (
              <li
                key={order.id}
                data-testid="order-wrapper"
                data-value={order.id}
              >
                <LocalizedLink
                  href={`/account/orders/details/${order.id}`}
                  className="grid grid-cols-2 gap-2 px-4 py-4 text-sm sm:grid-cols-4 sm:items-center"
                >
                  <span data-testid="order-created-date">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                  <span data-testid="order-id" data-value={order.display_id}>
                    #{order.display_id}
                  </span>
                  <span data-testid="order-amount" className="tabular-nums">
                    {convertToLocale({
                      amount: order.total,
                      currency_code: order.currency_code,
                    })}
                  </span>
                  <span className="text-muted-foreground sm:text-right">
                    View
                  </span>
                </LocalizedLink>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            compact
            title="No recent orders"
            description="When you place an order, it will appear here."
            action={
              <Button asChild variant="outline">
                <LocalizedLink href="/store">Start shopping</LocalizedLink>
              </Button>
            }
          />
        )}
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  if (!customer) return 0

  let count = 0
  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  if (customer.addresses?.some((addr) => addr.is_default_billing)) count++

  return (count / 4) * 100
}

export default Overview
