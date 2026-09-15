"use client"

import { HttpTypes } from "@medusajs/types"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/commerce/address-fields"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
}

const ProfileEmail: React.FC<MyInformationProps> = ({ customer }) => {
  return (
    <div className="space-y-4" data-testid="account-email-editor">
      <h2 className="text-sm font-medium">Email</h2>
      <Field label="Email" htmlFor="profile-email">
        <Input
          id="profile-email"
          name="email"
          type="email"
          defaultValue={customer.email}
          disabled
          data-testid="email-input"
        />
      </Field>
      <p className="text-xs text-muted-foreground">
        Email can&apos;t be changed from the storefront. Contact support if you
        need to update it.
      </p>
    </div>
  )
}

export default ProfileEmail
