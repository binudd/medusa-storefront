import type {
  HeroBannerRecord,
  StoreHeroBanner,
} from "../../../modules/hero-banner/types"

export function isBannerCurrentlyVisible(
  banner: Pick<HeroBannerRecord, "is_active" | "starts_at" | "ends_at">,
  now: Date = new Date()
): boolean {
  if (!banner.is_active) {
    return false
  }

  if (banner.starts_at) {
    const startsAt = new Date(banner.starts_at)
    if (startsAt.getTime() > now.getTime()) {
      return false
    }
  }

  if (banner.ends_at) {
    const endsAt = new Date(banner.ends_at)
    if (endsAt.getTime() < now.getTime()) {
      return false
    }
  }

  return true
}

export function toStoreHeroBanner(banner: HeroBannerRecord): StoreHeroBanner {
  return {
    id: banner.id,
    name: banner.name,
    heading: banner.heading,
    subheading: banner.subheading,
    desktop_image: banner.desktop_image_url
      ? {
          id: banner.desktop_image_id,
          url: banner.desktop_image_url,
        }
      : null,
    mobile_image: banner.mobile_image_url
      ? {
          id: banner.mobile_image_id,
          url: banner.mobile_image_url,
        }
      : null,
    button_text: banner.button_text,
    button_link: banner.button_link,
    sort_order: banner.sort_order,
  }
}
