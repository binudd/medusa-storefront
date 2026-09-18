import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { deleteHeroBannerStep } from "./steps/delete-hero-banner"

export const deleteHeroBannerWorkflow = createWorkflow(
  "delete-hero-banner",
  function (input: { id: string }) {
    const result = deleteHeroBannerStep(input.id)
    return new WorkflowResponse(result)
  }
)

export default deleteHeroBannerWorkflow
