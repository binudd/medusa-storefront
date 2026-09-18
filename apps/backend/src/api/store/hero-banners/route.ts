import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { HERO_BANNER_MODULE } from "../../../modules/hero-banner"
import type HeroBannerModuleService from "../../../modules/hero-banner/service"
import type { HeroBannerRecord } from "../../../modules/hero-banner/types"
import { isBannerCurrentlyVisible, toStoreHeroBanner } from "./utils"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: HeroBannerModuleService = req.scope.resolve(HERO_BANNER_MODULE)

  const banners = (await service.listHeroBanners(
    { is_active: true },
    { order: { sort_order: "ASC" }, take: 50 }
  )) as HeroBannerRecord[]

  const now = new Date()
  const hero_banners = banners
    .filter((banner) => isBannerCurrentlyVisible(banner, now))
    .map(toStoreHeroBanner)

  res.json({ hero_banners })
}
