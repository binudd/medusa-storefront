import {
  isBannerCurrentlyVisible,
  toStoreHeroBanner,
} from "../utils"
import type { HeroBannerRecord } from "../../../../modules/hero-banner/types"

const base: HeroBannerRecord = {
  id: "hb_1",
  name: "Summer",
  heading: "Summer Collection",
  subheading: "Discover the latest styles",
  desktop_image_url: "https://example.com/desktop.jpg",
  desktop_image_id: "file_1",
  mobile_image_url: "https://example.com/mobile.jpg",
  mobile_image_id: "file_2",
  button_text: "Shop Now",
  button_link: "/collections/summer",
  is_active: true,
  sort_order: 0,
  starts_at: null,
  ends_at: null,
  metadata: null,
}

describe("hero banner visibility", () => {
  const now = new Date("2026-06-15T12:00:00.000Z")

  it("includes active banners without schedule", () => {
    expect(isBannerCurrentlyVisible(base, now)).toBe(true)
  })

  it("excludes inactive banners", () => {
    expect(
      isBannerCurrentlyVisible({ ...base, is_active: false }, now)
    ).toBe(false)
  })

  it("excludes future banners", () => {
    expect(
      isBannerCurrentlyVisible(
        { ...base, starts_at: "2026-07-01T00:00:00.000Z" },
        now
      )
    ).toBe(false)
  })

  it("excludes expired banners", () => {
    expect(
      isBannerCurrentlyVisible(
        { ...base, ends_at: "2026-06-01T00:00:00.000Z" },
        now
      )
    ).toBe(false)
  })

  it("includes banners within schedule", () => {
    expect(
      isBannerCurrentlyVisible(
        {
          ...base,
          starts_at: "2026-06-01T00:00:00.000Z",
          ends_at: "2026-06-30T23:59:59.000Z",
        },
        now
      )
    ).toBe(true)
  })
})

describe("toStoreHeroBanner", () => {
  it("maps public fields and omits admin-only schedule flags", () => {
    const mapped = toStoreHeroBanner(base)
    expect(mapped).toEqual({
      id: "hb_1",
      name: "Summer",
      heading: "Summer Collection",
      subheading: "Discover the latest styles",
      desktop_image: { id: "file_1", url: "https://example.com/desktop.jpg" },
      mobile_image: { id: "file_2", url: "https://example.com/mobile.jpg" },
      button_text: "Shop Now",
      button_link: "/collections/summer",
      sort_order: 0,
    })
    expect(mapped).not.toHaveProperty("is_active")
    expect(mapped).not.toHaveProperty("starts_at")
    expect(mapped).not.toHaveProperty("metadata")
  })
})
