import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { duplicateHeroBannerWorkflow } from "../../../../../workflows/duplicate-hero-banner"

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const { result } = await duplicateHeroBannerWorkflow(req.scope).run({
    input: { id: req.params.id },
  })

  res.status(201).json({ hero_banner: result.banner })
}
