export type HeroBannerRecord = {
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
  starts_at: Date | string | null
  ends_at: Date | string | null
  metadata: Record<string, unknown> | null
  created_at?: Date | string
  updated_at?: Date | string
}

export type CreateHeroBannerInput = {
  name: string
  heading?: string | null
  subheading?: string | null
  desktop_image_url?: string | null
  desktop_image_id?: string | null
  mobile_image_url?: string | null
  mobile_image_id?: string | null
  button_text?: string | null
  button_link?: string | null
  is_active?: boolean
  sort_order?: number
  starts_at?: string | Date | null
  ends_at?: string | Date | null
  metadata?: Record<string, unknown> | null
}

export type UpdateHeroBannerInput = Partial<CreateHeroBannerInput> & {
  id: string
}

export type StoreHeroBannerImage = {
  id: string | null
  url: string
}

export type StoreHeroBanner = {
  id: string
  name: string
  heading: string | null
  subheading: string | null
  desktop_image: StoreHeroBannerImage | null
  mobile_image: StoreHeroBannerImage | null
  button_text: string | null
  button_link: string | null
  sort_order: number
}

export type StoreHeroBannerResponse = {
  hero_banners: StoreHeroBanner[]
}
