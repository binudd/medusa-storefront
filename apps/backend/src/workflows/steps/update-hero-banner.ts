import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { MedusaError } from "@medusajs/framework/utils"
import { HERO_BANNER_MODULE } from "../../modules/hero-banner"
import type HeroBannerModuleService from "../../modules/hero-banner/service"
import type {
  HeroBannerRecord,
  UpdateHeroBannerInput,
} from "../../modules/hero-banner/types"

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
): Date | null | undefined {
  if (value === undefined) {
    return undefined
  }
  if (value === null || value === "") {
    return null
  }
  return value instanceof Date ? value : new Date(value)
}

export const updateHeroBannerStep = createStep(
  "update-hero-banner",
  async (input: UpdateHeroBannerInput, { container }) => {
    const service: HeroBannerModuleService =
      container.resolve(HERO_BANNER_MODULE)

    const existing = (await service.retrieveHeroBanner(
      input.id
    )) as HeroBannerRecord

    const nextStartsAt =
      input.starts_at !== undefined ? input.starts_at : existing.starts_at
    const nextEndsAt =
      input.ends_at !== undefined ? input.ends_at : existing.ends_at
    assertSchedule(nextStartsAt, nextEndsAt)

    const updated = await service.updateHeroBanners({
      id: input.id,
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.heading !== undefined ? { heading: input.heading } : {}),
      ...(input.subheading !== undefined
        ? { subheading: input.subheading }
        : {}),
      ...(input.desktop_image_url !== undefined
        ? { desktop_image_url: input.desktop_image_url }
        : {}),
      ...(input.desktop_image_id !== undefined
        ? { desktop_image_id: input.desktop_image_id }
        : {}),
      ...(input.mobile_image_url !== undefined
        ? { mobile_image_url: input.mobile_image_url }
        : {}),
      ...(input.mobile_image_id !== undefined
        ? { mobile_image_id: input.mobile_image_id }
        : {}),
      ...(input.button_text !== undefined
        ? { button_text: input.button_text }
        : {}),
      ...(input.button_link !== undefined
        ? { button_link: input.button_link }
        : {}),
      ...(input.is_active !== undefined ? { is_active: input.is_active } : {}),
      ...(input.sort_order !== undefined
        ? { sort_order: input.sort_order }
        : {}),
      ...(input.starts_at !== undefined
        ? { starts_at: toDateOrNull(input.starts_at) }
        : {}),
      ...(input.ends_at !== undefined
        ? { ends_at: toDateOrNull(input.ends_at) }
        : {}),
      ...(input.metadata !== undefined ? { metadata: input.metadata } : {}),
    })

    return new StepResponse(updated, existing)
  },
  async (previous, { container }) => {
    if (!previous) {
      return
    }
    const service: HeroBannerModuleService =
      container.resolve(HERO_BANNER_MODULE)
    await service.updateHeroBanners({
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
      starts_at: toDateOrNull(previous.starts_at) ?? null,
      ends_at: toDateOrNull(previous.ends_at) ?? null,
      metadata: previous.metadata,
    })
  }
)
