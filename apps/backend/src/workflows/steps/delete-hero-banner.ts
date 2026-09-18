import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { HERO_BANNER_MODULE } from "../../modules/hero-banner"
import type HeroBannerModuleService from "../../modules/hero-banner/service"
import type { HeroBannerRecord } from "../../modules/hero-banner/types"

function toDateOrNull(value: string | Date | null | undefined): Date | null {
  if (value === undefined || value === null || value === "") {
    return null
  }
  return value instanceof Date ? value : new Date(value)
}

export const deleteHeroBannerStep = createStep(
  "delete-hero-banner",
  async (id: string, { container }) => {
    const service: HeroBannerModuleService =
      container.resolve(HERO_BANNER_MODULE)
    const existing = (await service.retrieveHeroBanner(
      id
    )) as HeroBannerRecord
    await service.deleteHeroBanners(id)
    return new StepResponse({ id }, existing)
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }
    const service: HeroBannerModuleService =
      container.resolve(HERO_BANNER_MODULE)
    await service.createHeroBanners({
      id: previous.id,
      name: previous.name,
      heading: previous.heading,
      subheading: previous.subheading,
      desktop_image_url: previous.desktop_image_url,
      desktop_image_id: previous.desktop_image_id,
      mobile_image_url: previous.mobile_image_url,
      mobile_image_id: previous.mobile_image_id,
      button_text: previous.button_text,
      button_link: previous.button_link,
      is_active: previous.is_active,
      sort_order: previous.sort_order,
      starts_at: toDateOrNull(previous.starts_at),
      ends_at: toDateOrNull(previous.ends_at),
      metadata: previous.metadata,
    })
  }
)
