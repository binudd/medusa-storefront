import { z } from "@medusajs/framework/zod"
import { createFindParams } from "@medusajs/medusa/api/utils/validators"

const optionalDate = z
  .union([z.string().datetime({ offset: true }), z.string().datetime(), z.null()])
  .optional()

const buttonLinkSchema = z
  .union([
    z.string().url(),
    z.string().regex(/^\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]*$/),
    z.literal(""),
    z.null(),
  ])
  .optional()

export const CreateHeroBannerSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    heading: z.string().trim().max(160).nullable().optional(),
    subheading: z.string().trim().max(320).nullable().optional(),
    desktop_image_url: z.string().min(1).nullable().optional(),
    desktop_image_id: z.string().nullable().optional(),
    mobile_image_url: z.string().min(1).nullable().optional(),
    mobile_image_id: z.string().nullable().optional(),
    button_text: z.string().trim().max(80).nullable().optional(),
    button_link: buttonLinkSchema,
    is_active: z.boolean().optional(),
    sort_order: z.number().int().min(0).max(9999).optional(),
    starts_at: optionalDate,
    ends_at: optionalDate,
    metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.starts_at && data.ends_at) {
      if (new Date(data.starts_at).getTime() > new Date(data.ends_at).getTime()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "starts_at cannot be after ends_at",
          path: ["starts_at"],
        })
      }
    }
  })

export type CreateHeroBannerSchema = z.infer<typeof CreateHeroBannerSchema>

export const UpdateHeroBannerSchema = CreateHeroBannerSchema.partial().extend({
  name: z.string().trim().min(1).max(120).optional(),
})

export type UpdateHeroBannerSchema = z.infer<typeof UpdateHeroBannerSchema>

export const GetHeroBannersSchema = createFindParams()
