"use client"

import { Pencil, Trash2 } from "lucide-react"
import { useActionState, useEffect, useMemo, useState } from "react"

import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ErrorMessage } from "@/components/common/error-message"
import {
  AddressFields,
  emptyAddressValues,
  formatAddressLine,
  toCountryOptions,
  type AddressFieldKey,
  type AddressValues,
} from "@/components/commerce/address-fields"
import { SubmitButton } from "@modules/checkout/components/submit-button"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
}

const EditAddress: React.FC<EditAddressProps> = ({ region, address }) => {
  const [open, setOpen] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [values, setValues] = useState<AddressValues>(emptyAddressValues(address))

  const countries = useMemo(
    () => toCountryOptions(region.countries),
    [region.countries]
  )

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
    addressId: address.id,
  } as { success: boolean; error: string | null; addressId: string })

  useEffect(() => {
    if (formState.success) setOpen(false)
  }, [formState.success])

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className="flex min-h-[200px] flex-col justify-between rounded-md border p-5"
        data-testid="address-container"
      >
        <div>
          <p className="font-medium" data-testid="address-name">
            {address.first_name} {address.last_name}
          </p>
          {address.company && (
            <p className="text-sm text-muted-foreground" data-testid="address-company">
              {address.company}
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            {formatAddressLine(address)}
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            data-testid="address-edit-button"
          >
            <Pencil />
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeAddress}
            disabled={removing}
            isLoading={removing}
            data-testid="address-delete-button"
          >
            <Trash2 />
            Remove
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="edit-address-modal">
          <DialogHeader>
            <DialogTitle>Edit address</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="addressId" value={address.id} />
            <AddressFields
              prefix=""
              values={values}
              onChange={(key: AddressFieldKey, value) =>
                setValues((prev) => ({ ...prev, [key]: value }))
              }
              countries={countries}
              show={{ company: true, address_2: true, phone: true }}
            />
            <ErrorMessage error={formState.error} />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <SubmitButton size="default" data-testid="save-button">
                Save
              </SubmitButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditAddress
