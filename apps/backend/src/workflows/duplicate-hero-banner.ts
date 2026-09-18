import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { HERO_BANNER_MODULE } from "../modules/hero-banner"
import type HeroBannerModuleService from "../modules/hero-banner/service"
import type { HeroBannerRecord } from "../modules/hero-banner/types"
import { createHeroBannerStep } from "./steps/create-hero-banner"

const retrieveHeroBannerStep = createStep(
  "retrieve-hero-banner-for-duplicate",
  async (id: string, { container }) => {
    const service: HeroBannerModuleService =
      container.resolve(HERO_BANNER_MODULE)
    const banner = (await service.retrieveHeroBanner(id)) as HeroBannerRecord
    return new StepResponse(banner)
  }
)

export const duplicateHeroBannerWorkflow = createWorkflow(
  "duplicate-hero-banner",
  function (input: { id: string }) {
    const existing = retrieveHeroBannerStep(input.id)

    const createInput = transform({ existing }, ({ existing }) => ({
      name: `${existing.name} (copy)`,
      heading: existing.heading,
      subheading: existing.subheading,
      desktop_image_url: existing.desktop_image_url,
      desktop_image_id: existing.desktop_image_id,
      mobile_image_url: existing.mobile_image_url,
      mobile_image_id: existing.mobile_image_id,
      button_text: existing.button_text,
      button_link: existing.button_link,
      is_active: false,
      sort_order: (existing.sort_order ?? 0) + 1,
      starts_at: existing.starts_at,
      ends_at: existing.ends_at,
      metadata: existing.metadata,
    }))

    const banner = createHeroBannerStep(createInput).config({
      name: "create-duplicated-hero-banner",
    })

    return new WorkflowResponse({ banner })
  }
)

export default duplicateHeroBannerWorkflow
