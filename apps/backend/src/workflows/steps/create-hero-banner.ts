import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import { HERO_BANNER_MODULE } from "../../modules/hero-banner"
import type HeroBannerModuleService from "../../modules/hero-banner/service"
import type { CreateHeroBannerInput } from "../../modules/hero-banner/types"

function assertSchedule(
  startsAt: string | Date | null | undefined,
  endsAt: string | Date | null | undefined
) {
  if (!startsAt || !endsAt) {
    return
  }
  const start = new Date(startsAt)
  const end = new Date(endsAt)
  if (start.getTime() > end.getTime()) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "starts_at cannot be after ends_at"
    )
  }
}

function toDateOrNull(
  value: string | Date | null | undefined
): Date | null {
  if (value === undefined || value === null || value === "") {
    return null
  }
  return value instanceof Date ? value : new Date(value)
}

export const createHeroBannerStep = createStep(
  "create-hero-banner",
  async (input: CreateHeroBannerInput, { container }) => {
    assertSchedule(input.starts_at, input.ends_at)

    const service: HeroBannerModuleService =
      container.resolve(HERO_BANNER_MODULE)

    const banner = await service.createHeroBanners({
      name: input.name,
      heading: input.heading ?? null,
      subheading: input.subheading ?? null,
      desktop_image_url: input.desktop_image_url ?? null,
      desktop_image_id: input.desktop_image_id ?? null,
      mobile_image_url: input.mobile_image_url ?? null,
      mobile_image_id: input.mobile_image_id ?? null,
      button_text: input.button_text ?? null,
      button_link: input.button_link ?? null,
      is_active: input.is_active ?? false,
      sort_order: input.sort_order ?? 0,
      starts_at: toDateOrNull(input.starts_at),
      ends_at: toDateOrNull(input.ends_at),
      metadata: input.metadata ?? null,
    })

    return new StepResponse(banner, banner.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }
    const service: HeroBannerModuleService =
      container.resolve(HERO_BANNER_MODULE)
    await service.deleteHeroBanners(id)
  }
)
