"use client"

import { Tag, X } from "lucide-react"
import * as React from "react"

import { useAddPromotion, useRemovePromotion } from "@lib/queries/cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ErrorMessage } from "@/components/common/error-message"
import { cn } from "@/lib/utils"

type PromoCodeFormProps = {
  promotions?: { id?: string; code?: string | null }[]
  className?: string
}

export function PromoCodeForm({ promotions, className }: PromoCodeFormProps) {
  const id = React.useId()
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)

  const add = useAddPromotion({
    onSuccess: () => {
      setCode("")
      setError(null)
    },
    onError: (e) => setError(e.message),
  })
  const remove = useRemovePromotion({ onError: (e) => setError(e.message) })

  const applied = (promotions ?? []).filter((p) => !!p.code)

  return (
    <div className={cn("space-y-3", className)}>
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!code.trim()) return
          add.mutate({ code })
        }}
      >
        <div className="flex-1 space-y-1.5">
          <Label htmlFor={id} className="text-xs text-muted-foreground">
            Promotion code
          </Label>
          <Input
            id={id}
            name="code"
            autoComplete="off"
            value={code}
            onChange={(e) => {
              setCode(e.target.value)
              if (error) setError(null)
            }}
            placeholder="Enter code"
            aria-invalid={!!error}
            data-testid="discount-input"
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          isLoading={add.isPending}
          disabled={!code.trim()}
          data-testid="discount-apply-button"
        >
          Apply
        </Button>
      </form>
      <ErrorMessage error={error} data-testid="discount-error-message" />
      {applied.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Applied promotions">
          {applied.map((promo) => (
            <li key={promo.id ?? promo.code}>
              <Badge variant="outline" className="gap-1.5 py-1 pl-2 pr-1 normal-case tracking-normal">
                <Tag className="size-3" aria-hidden />
                <span>{promo.code}</span>
                <button
                  type="button"
                  className="ml-0.5 inline-flex size-5 items-center justify-center rounded-sm hover:bg-accent"
                  onClick={() => remove.mutate({ code: promo.code! })}
                  disabled={remove.isPending}
                  aria-label={`Remove promotion ${promo.code}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
