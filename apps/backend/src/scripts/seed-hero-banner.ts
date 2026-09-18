import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { HERO_BANNER_MODULE } from "../modules/hero-banner"
import type HeroBannerModuleService from "../modules/hero-banner/service"

/**
 * Seeds one example hero banner without image URLs.
 * Upload desktop/mobile images from Admin → Content → Hero Banners.
 *
 * Run:
 *   npx medusa exec ./src/scripts/seed-hero-banner.ts
 */
export default async function seedHeroBanner({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const service: HeroBannerModuleService =
    container.resolve(HERO_BANNER_MODULE)

  const existing = await service.listHeroBanners({}, { take: 1 })
  if (existing.length) {
    logger.info("Hero banners already exist — skipping seed")
    return
  }

  await service.createHeroBanners({
    name: "Summer Collection",
    heading: "Summer Collection",
    subheading: "Discover the latest styles",
    button_text: "Shop Now",
    button_link: "/collections/summer",
    is_active: true,
    sort_order: 0,
    desktop_image_url: null,
    desktop_image_id: null,
    mobile_image_url: null,
    mobile_image_id: null,
    starts_at: null,
    ends_at: null,
    metadata: null,
  })

  logger.info(
    "Seeded example hero banner (no images). Upload images from Admin → Content → Hero Banners."
  )
}
