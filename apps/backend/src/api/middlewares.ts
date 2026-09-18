import {
  defineMiddlewares,
  validateAndTransformBody,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import {
  CreateHeroBannerSchema,
  GetHeroBannersSchema,
  UpdateHeroBannerSchema,
} from "./admin/hero-banners/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/hero-banners",
      method: "POST",
      middlewares: [validateAndTransformBody(CreateHeroBannerSchema)],
    },
    {
      matcher: "/admin/hero-banners",
      method: "GET",
      middlewares: [
        validateAndTransformQuery(GetHeroBannersSchema, {
          defaults: [
            "id",
            "name",
            "heading",
            "subheading",
            "desktop_image_url",
            "desktop_image_id",
            "mobile_image_url",
            "mobile_image_id",
            "button_text",
            "button_link",
            "is_active",
            "sort_order",
            "starts_at",
            "ends_at",
            "metadata",
            "created_at",
            "updated_at",
          ],
          isList: true,
        }),
      ],
    },
    {
      matcher: "/admin/hero-banners/:id",
      method: "POST",
      middlewares: [validateAndTransformBody(UpdateHeroBannerSchema)],
    },
  ],
})
