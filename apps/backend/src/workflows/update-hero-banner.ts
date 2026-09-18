import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { updateHeroBannerStep } from "./steps/update-hero-banner"
import type { UpdateHeroBannerInput } from "../modules/hero-banner/types"

export const updateHeroBannerWorkflow = createWorkflow(
  "update-hero-banner",
  function (input: UpdateHeroBannerInput) {
    const banner = updateHeroBannerStep(input)
    return new WorkflowResponse({ banner })
  }
)

export default updateHeroBannerWorkflow
