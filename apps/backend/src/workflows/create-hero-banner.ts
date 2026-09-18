import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createHeroBannerStep } from "./steps/create-hero-banner"
import type { CreateHeroBannerInput } from "../modules/hero-banner/types"

export const createHeroBannerWorkflow = createWorkflow(
  "create-hero-banner",
  function (input: CreateHeroBannerInput) {
    const banner = createHeroBannerStep(input)
    return new WorkflowResponse({ banner })
  }
)

export default createHeroBannerWorkflow
