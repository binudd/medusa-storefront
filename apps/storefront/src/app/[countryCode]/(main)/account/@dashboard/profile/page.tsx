import { Metadata } from "next"
import { notFound } from "next/navigation"

import { retrieveCustomer } from "@lib/data/customer"
import { listRegions } from "@lib/data/regions"
import { Separator } from "@/components/ui/separator"
import { PageHeader } from "@/components/common/page-header"
import ProfileBillingAddress from "@modules/account/components/profile-billing-address"
import ProfileEmail from "@modules/account/components/profile-email"
import ProfileName from "@modules/account/components/profile-name"
import ProfilePhone from "@modules/account/components/profile-phone"

export const metadata: Metadata = {
  title: "Profile",
  description: "View and edit your profile.",
}

export default async function Profile() {
  const customer = await retrieveCustomer()
  const regions = await listRegions()

  if (!customer || !regions) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="profile-page-wrapper">
      <PageHeader
        title="Profile"
        description="Update the details we use for checkout and order updates."
      />
      <div className="space-y-8">
        <ProfileName customer={customer} />
        <Separator />
        <ProfileEmail customer={customer} />
        <Separator />
        <ProfilePhone customer={customer} />
        <Separator />
        <ProfileBillingAddress customer={customer} regions={regions} />
      </div>
    </div>
  )
}
