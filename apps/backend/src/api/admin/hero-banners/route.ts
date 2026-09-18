import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { createHeroBannerWorkflow } from "../../../workflows/create-hero-banner"
import { HERO_BANNER_MODULE } from "../../../modules/hero-banner"
import type HeroBannerModuleService from "../../../modules/hero-banner/service"
import type { CreateHeroBannerSchema } from "./validators"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const service: HeroBannerModuleService = req.scope.resolve(HERO_BANNER_MODULE)

  const limit = Number(req.query.limit ?? 50)
  const offset = Number(req.query.offset ?? 0)

  const [hero_banners, count] = await service.listAndCountHeroBanners(
    {},
    {
      skip: offset,
      take: limit,
      order: { sort_order: "ASC", updated_at: "DESC" },
    }
  )

  res.json({
    hero_banners,
    count,
    limit,
    offset,
  })
}

export async function POST(
  req: AuthenticatedMedusaRequest<CreateHeroBannerSchema>,
  res: MedusaResponse
) {
  const { result } = await createHeroBannerWorkflow(req.scope).run({
    input: req.validatedBody,
  })

  res.status(201).json({ hero_banner: result.banner })
}
