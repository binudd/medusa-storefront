import { model } from "@medusajs/framework/utils"

const HeroBanner = model.define("hero_banner", {
  id: model.id({ prefix: "hb" }).primaryKey(),
  name: model.text(),
  heading: model.text().nullable(),
  subheading: model.text().nullable(),
  desktop_image_url: model.text().nullable(),
  desktop_image_id: model.text().nullable(),
  mobile_image_url: model.text().nullable(),
  mobile_image_id: model.text().nullable(),
  button_text: model.text().nullable(),
  button_link: model.text().nullable(),
  is_active: model.boolean().default(false),
  sort_order: model.number().default(0),
  starts_at: model.dateTime().nullable(),
  ends_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default HeroBanner
