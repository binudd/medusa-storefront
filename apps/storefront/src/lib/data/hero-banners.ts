"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

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

/**
 * Fetches currently visible hero banners from the Medusa Store API.
 * Filtering (active + schedule) is enforced server-side.
 */
export async function listHeroBanners(): Promise<StoreHeroBanner[]> {
  const next = {
    ...(await getCacheOptions("hero-banners")),
  }

  try {
    const { hero_banners } = await sdk.client.fetch<StoreHeroBannerResponse>(
      "/store/hero-banners",
      {
        method: "GET",
        next,
        cache: "force-cache",
      }
    )
    return hero_banners ?? []
  } catch (error) {
    console.error("[hero-banners] Failed to fetch active banners", error)
    return []
  }
}
