"use client"

import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { setShippingMethod } from "@lib/data/cart"
import { useCalculatedShippingPrices } from "@lib/queries/shipping"
import { convertToLocale } from "@lib/util/money"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { formatAddressLine } from "@/components/commerce/address-fields"
import { ErrorMessage } from "@/components/common/error-message"

import { CheckoutStep } from "../checkout-step"

const PICKUP = "__pickup"
const DELIVERY = "__delivery"

type ShippingOption = HttpTypes.StoreCartShippingOption & {
  service_zone?: {
    fulfillment_set?: {
      type?: string
      location?: { address?: HttpTypes.StoreCartAddress }
    }
  }
}

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

/**
 * Step 2: delivery method. Selecting an option immediately persists it via
 * `setShippingMethod`; calculated prices are fetched through TanStack Query.
 */
export function Shipping({ cart, availableShippingMethods }: ShippingProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "delivery"

  const options = React.useMemo(
    () => (availableShippingMethods ?? []) as ShippingOption[],
    [availableShippingMethods]
  )
  const deliveryOptions = options.filter(
    (o) => o.service_zone?.fulfillment_set?.type !== "pickup"
  )
  const pickupOptions = options.filter(
    (o) => o.service_zone?.fulfillment_set?.type === "pickup"
  )

  const currentId = cart.shipping_methods?.at(-1)?.shipping_option_id ?? null
  const [selectedId, setSelectedId] = React.useState<string | null>(currentId)
  const [mode, setMode] = React.useState<string>(
    pickupOptions.some((o) => o.id === currentId) ? PICKUP : DELIVERY
  )
  const [isSaving, setIsSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const { prices, isLoading: isLoadingPrices } = useCalculatedShippingPrices(
    cart.id,
    deliveryOptions
  )

  React.useEffect(() => {
    setError(null)
  }, [isOpen])

  const select = async (id: string) => {
    if (id === selectedId) return
    setError(null)
    const previous = selectedId
    setSelectedId(id)
    setIsSaving(true)
    await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
      .catch((err: Error) => {
        setSelectedId(previous)
        setError(err.message)
      })
      .finally(() => setIsSaving(false))
  }

  const priceLabel = (option: ShippingOption) => {
    if (option.price_type === "flat") {
      return convertToLocale({
        amount: option.amount ?? 0,
        currency_code: cart.currency_code,
      })
    }
    if (typeof prices[option.id] === "number") {
      return convertToLocale({
        amount: prices[option.id],
        currency_code: cart.currency_code,
      })
    }
    return isLoadingPrices ? <Skeleton className="h-4 w-14" /> : "—"
  }

  const hasMethod = (cart.shipping_methods?.length ?? 0) > 0
  const addressReady = Boolean(
    cart.shipping_address && cart.billing_address && cart.email
  )
  const chosen = cart.shipping_methods?.at(-1)

  return (
    <CheckoutStep
      index={2}
      title="Delivery"
      isOpen={isOpen}
      isComplete={hasMethod}
      canEdit={addressReady}
      onEdit={() => router.push(`${pathname}?step=delivery`, { scroll: false })}
      editTestId="edit-delivery-button"
    >
      {isOpen ? (
        <div className="space-y-6" data-testid="delivery-options-container">
          {pickupOptions.length > 0 && (
            <RadioGroup
              value={mode}
              onValueChange={(value) => {
                setMode(value)
                if (value === PICKUP) {
                  const first = pickupOptions.find((o) => !o.insufficient_inventory)
                  if (first) void select(first.id)
                }
              }}
              className="grid gap-2 sm:grid-cols-2"
              aria-label="Delivery type"
            >
              <OptionCard
                value={DELIVERY}
                id="mode-delivery"
                selected={mode === DELIVERY}
                label="Ship to address"
              />
              <OptionCard
                value={PICKUP}
                id="mode-pickup"
                selected={mode === PICKUP}
                label="Pick up in store"
              />
            </RadioGroup>
          )}

          {mode === DELIVERY && (
            <RadioGroup
              value={selectedId ?? ""}
              onValueChange={(v) => void select(v)}
              disabled={isSaving}
              aria-label="Shipping method"
            >
              {deliveryOptions.map((option) => {
                const unavailable =
                  option.price_type === "calculated" &&
                  !isLoadingPrices &&
                  typeof prices[option.id] !== "number"
                return (
                  <OptionCard
                    key={option.id}
                    value={option.id}
                    id={`ship-${option.id}`}
                    selected={selectedId === option.id}
                    disabled={unavailable}
                    testId="delivery-option-radio"
                    label={option.name}
                    trailing={<span className="tabular-nums">{priceLabel(option)}</span>}
                  />
                )
              })}
              {deliveryOptions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No shipping methods are available for this address.
                </p>
              )}
            </RadioGroup>
          )}

          {mode === PICKUP && (
            <RadioGroup
              value={selectedId ?? ""}
              onValueChange={(v) => void select(v)}
              disabled={isSaving}
              aria-label="Pickup location"
            >
              {pickupOptions.map((option) => (
                <OptionCard
                  key={option.id}
                  value={option.id}
                  id={`pickup-${option.id}`}
                  selected={selectedId === option.id}
                  disabled={option.insufficient_inventory}
                  testId="delivery-option-radio"
                  label={
                    <span className="flex flex-col">
                      <span>{option.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatAddressLine(
                          option.service_zone?.fulfillment_set?.location?.address
                        )}
                      </span>
                    </span>
                  }
                  trailing={
                    <span className="tabular-nums">
                      {convertToLocale({
                        amount: option.amount ?? 0,
                        currency_code: cart.currency_code,
                      })}
                    </span>
                  }
                />
              ))}
            </RadioGroup>
          )}

          <ErrorMessage error={error} data-testid="delivery-option-error-message" />

          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => router.push(`${pathname}?step=payment`, { scroll: false })}
            isLoading={isSaving}
            disabled={!hasMethod}
            data-testid="submit-delivery-option-button"
          >
            Continue to payment
          </Button>
        </div>
      ) : (
        hasMethod &&
        chosen && (
          <dl className="text-sm">
            <dt className="mb-1 font-medium">Method</dt>
            <dd className="text-muted-foreground">
              {chosen.name} ·{" "}
              {convertToLocale({
                amount: chosen.amount ?? 0,
                currency_code: cart.currency_code,
              })}
            </dd>
          </dl>
        )
      )}
    </CheckoutStep>
  )
}

function OptionCard({
  value,
  id,
  selected,
  disabled,
  testId,
  label,
  trailing,
}: {
  value: string
  id: string
  selected: boolean
  disabled?: boolean
  testId?: string
  label: React.ReactNode
  trailing?: React.ReactNode
}) {
  return (
    <Label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-4 rounded-md border px-4 py-4 text-sm font-normal transition-colors duration-fast",
        selected ? "border-primary" : "border-input hover:border-foreground/60",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span className="flex items-center gap-3">
        <RadioGroupItem value={value} id={id} disabled={disabled} data-testid={testId} />
        {label}
      </span>
      {trailing}
    </Label>
  )
}
