"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button } from "@/components/ui/button"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  return (
    <div className="mb-8 rounded-md border bg-muted p-5">
      <p className="font-medium">Your test order was created</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Complete setup in the Medusa admin to continue.
      </p>
      <Button
        className="mt-4"
        onClick={() => resetOnboardingState(orderId)}
      >
        Complete setup in admin
      </Button>
    </div>
  )
}

export default OnboardingCta
