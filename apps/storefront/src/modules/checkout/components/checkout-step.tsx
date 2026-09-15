import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CheckoutStepProps = {
  index: number
  title: string
  isOpen: boolean
  isComplete: boolean
  /** Show the edit control when not open (only if the step can be revisited). */
  canEdit?: boolean
  onEdit?: () => void
  editTestId?: string
  children: React.ReactNode
}

/**
 * Visual shell for each checkout step: numbered header, completion tick and
 * edit affordance. Step logic stays in the individual step components.
 */
export function CheckoutStep({
  index,
  title,
  isOpen,
  isComplete,
  canEdit,
  onEdit,
  editTestId,
  children,
}: CheckoutStepProps) {
  const inactive = !isOpen && !isComplete
  return (
    <section
      aria-labelledby={`checkout-step-${index}`}
      className={cn("border-b pb-8 last:border-b-0", inactive && "opacity-50")}
      aria-current={isOpen ? "step" : undefined}
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2
          id={`checkout-step-${index}`}
          className="flex items-center gap-3 text-xl font-medium"
        >
          <span
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-full border text-xs font-medium",
              isComplete && !isOpen
                ? "border-primary bg-primary text-primary-foreground"
                : "border-foreground"
            )}
            aria-hidden
          >
            {isComplete && !isOpen ? <Check className="size-3.5" /> : index}
          </span>
          {title}
        </h2>
        {!isOpen && canEdit && onEdit && (
          <Button variant="link" size="sm" onClick={onEdit} data-testid={editTestId}>
            Edit
          </Button>
        )}
      </div>
      {children}
    </section>
  )
}
