export type AdminHeroBanner = {
  id: string
  name: string
  heading: string | null
  subheading: string | null
  desktop_image_url: string | null
  desktop_image_id: string | null
  mobile_image_url: string | null
  mobile_image_id: string | null
  button_text: string | null
  button_link: string | null
  is_active: boolean
  sort_order: number
  starts_at: string | null
  ends_at: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export type AdminHeroBannerListResponse = {
  hero_banners: AdminHeroBanner[]
  count: number
  limit: number
  offset: number
}

export type AdminHeroBannerResponse = {
  hero_banner: AdminHeroBanner
}

export type HeroBannerFormValues = {
  name: string
  heading: string
  subheading: string
  desktop_image_url: string
  desktop_image_id: string
  mobile_image_url: string
  mobile_image_id: string
  button_text: string
  button_link: string
  is_active: boolean
  sort_order: number
  starts_at: string
  ends_at: string
}

export const emptyHeroBannerForm = (): HeroBannerFormValues => ({
  name: "",
  heading: "",
  subheading: "",
  desktop_image_url: "",
  desktop_image_id: "",
  mobile_image_url: "",
  mobile_image_id: "",
  button_text: "",
  button_link: "",
  is_active: false,
  sort_order: 0,
  starts_at: "",
  ends_at: "",
})

export function bannerToFormValues(banner: AdminHeroBanner): HeroBannerFormValues {
  return {
    name: banner.name ?? "",
    heading: banner.heading ?? "",
    subheading: banner.subheading ?? "",
    desktop_image_url: banner.desktop_image_url ?? "",
    desktop_image_id: banner.desktop_image_id ?? "",
    mobile_image_url: banner.mobile_image_url ?? "",
    mobile_image_id: banner.mobile_image_id ?? "",
    button_text: banner.button_text ?? "",
    button_link: banner.button_link ?? "",
    is_active: Boolean(banner.is_active),
    sort_order: banner.sort_order ?? 0,
    starts_at: banner.starts_at
      ? new Date(banner.starts_at).toISOString().slice(0, 16)
      : "",
    ends_at: banner.ends_at
      ? new Date(banner.ends_at).toISOString().slice(0, 16)
      : "",
  }
}

export function formValuesToPayload(values: HeroBannerFormValues) {
  return {
    name: values.name.trim(),
    heading: values.heading.trim() || null,
    subheading: values.subheading.trim() || null,
    desktop_image_url: values.desktop_image_url.trim() || null,
    desktop_image_id: values.desktop_image_id.trim() || null,
    mobile_image_url: values.mobile_image_url.trim() || null,
    mobile_image_id: values.mobile_image_id.trim() || null,
    button_text: values.button_text.trim() || null,
    button_link: values.button_link.trim() || null,
    is_active: values.is_active,
    sort_order: Number(values.sort_order) || 0,
    starts_at: values.starts_at
      ? new Date(values.starts_at).toISOString()
      : null,
    ends_at: values.ends_at ? new Date(values.ends_at).toISOString() : null,
  }
}
