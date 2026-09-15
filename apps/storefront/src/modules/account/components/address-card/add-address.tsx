"use client"

import { Plus } from "lucide-react"
import { useActionState, useEffect, useMemo, useState } from "react"

import { addCustomerAddress } from "@lib/data/customer"
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
  toCountryOptions,
  type AddressFieldKey,
  type AddressValues,
} from "@/components/commerce/address-fields"
import { SubmitButton } from "@modules/checkout/components/submit-button"

const AddAddress = ({ region }: { region: HttpTypes.StoreRegion }) => {
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<AddressValues>(emptyAddressValues())

  const countries = useMemo(
    () => toCountryOptions(region.countries),
    [region.countries]
  )

  const [formState, formAction] = useActionState(addCustomerAddress, {
    success: false,
    error: null,
  } as { success: boolean; error: string | null })

  useEffect(() => {
    if (formState.success) {
      setOpen(false)
      setValues(emptyAddressValues())
    }
  }, [formState.success])

  return (
    <>
      <button
        type="button"
        className="flex min-h-[200px] w-full flex-col items-start justify-between rounded-md border border-dashed p-5 text-left transition-colors hover:border-foreground"
        onClick={() => setOpen(true)}
        data-testid="add-address-button"
      >
        <span className="font-medium">New address</span>
        <Plus className="size-4" aria-hidden />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto" data-testid="add-address-modal">
          <DialogHeader>
            <DialogTitle>Add address</DialogTitle>
          </DialogHeader>
          <form action={formAction} className="space-y-4">
            <AddressFields
              prefix=""
              values={values}
              onChange={(key: AddressFieldKey, value) =>
                setValues((prev) => ({ ...prev, [key]: value }))
              }
              countries={countries}
              show={{ company: true, address_2: true, phone: true }}
              testIdPrefix=""
            />
            <ErrorMessage error={formState.error} data-testid="address-error" />
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

export default AddAddress
