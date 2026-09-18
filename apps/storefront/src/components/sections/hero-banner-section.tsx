import { listHeroBanners } from "@lib/data/hero-banners"
import { HeroBanner } from "./hero-banner"

/**
 * Server component that loads the primary active hero banner from Medusa.
 * Returns null when there are no visible banners (empty / error / inactive).
 */
export async function HeroBannerSection() {
  const banners = await listHeroBanners()
  const banner = banners[0]

  if (!banner) {
    return null
  }

  return <HeroBanner banner={banner} />
}
