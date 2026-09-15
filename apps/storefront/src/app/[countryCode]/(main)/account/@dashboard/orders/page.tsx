import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listOrders } from "@lib/data/orders"
import { PageHeader } from "@/components/common/page-header"
import OrderOverview from "@modules/account/components/order-overview"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <PageHeader
        title="Orders"
        description="Track previous orders and request a transfer if an order belongs to another email."
      />
      <OrderOverview orders={orders} />
      <div className="mt-10">
        <TransferRequestForm />
      </div>
    </div>
  )
}
