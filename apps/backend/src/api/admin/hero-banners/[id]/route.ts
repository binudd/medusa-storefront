import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { HERO_BANNER_MODULE } from "../../../../modules/hero-banner"
import type HeroBannerModuleService from "../../../../modules/hero-banner/service"
import { updateHeroBannerWorkflow } from "../../../../workflows/update-hero-banner"
import { deleteHeroBannerWorkflow } from "../../../../workflows/delete-hero-banner"
import type { UpdateHeroBannerSchema } from "../validators"

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const service: HeroBannerModuleService = req.scope.resolve(HERO_BANNER_MODULE)
  const id = req.params.id

  const hero_banner = await service.retrieveHeroBanner(id)
  res.json({ hero_banner })
}

export async function POST(
  req: AuthenticatedMedusaRequest<UpdateHeroBannerSchema>,
  res: MedusaResponse
) {
  const id = req.params.id
  if (!id) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Missing banner id")
  }

  const { result } = await updateHeroBannerWorkflow(req.scope).run({
    input: {
      id,
      ...req.validatedBody,
    },
  })

  res.json({ hero_banner: result.banner })
}

export async function DELETE(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const id = req.params.id
  await deleteHeroBannerWorkflow(req.scope).run({
    input: { id },
  })

  res.json({
    id,
    object: "hero_banner",
    deleted: true,
  })
}
