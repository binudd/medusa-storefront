import Image from "next/image"

import type { StoreHeroBanner } from "@lib/data/hero-banners"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/common/localized-link"

function safeInternalHref(href: string | null | undefined): string | null {
  if (!href) {
    return null
  }
  const trimmed = href.trim()
  if (!trimmed) {
    return null
  }
  // Allow relative storefront paths and absolute https links only.
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed
  }
  try {
    const url = new URL(trimmed)
    if (url.protocol === "https:" || url.protocol === "http:") {
      return trimmed
    }
  } catch {
    return null
  }
  return null
}

export function HeroBanner({ banner }: { banner: StoreHeroBanner }) {
  const heading = banner.heading?.trim() || banner.name
  const subheading = banner.subheading?.trim() || null
  const ctaLabel = banner.button_text?.trim() || null
  const ctaHref = safeInternalHref(banner.button_link)
  const desktop = banner.desktop_image?.url || null
  const mobile = banner.mobile_image?.url || null
  const imageSrc = desktop || mobile
  const alt = heading

  return (
    <section
      className="relative border-b bg-surface"
      aria-labelledby={`hero-banner-${banner.id}`}
    >
      <div className="content-container grid min-h-[70vh] items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="max-w-xl space-y-6">
          <h1
            id={`hero-banner-${banner.id}`}
            className="text-4xl font-medium leading-[1.05] tracking-tightest sm:text-5xl lg:text-6xl"
          >
            {heading}
          </h1>
          {subheading ? (
            <p className="max-w-md text-base text-muted-foreground sm:text-lg">
              {subheading}
            </p>
          ) : null}
          {ctaLabel && ctaHref ? (
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg">
                {ctaHref.startsWith("/") ? (
                  <LocalizedLink href={ctaHref}>{ctaLabel}</LocalizedLink>
                ) : (
                  <a href={ctaHref} rel="noopener noreferrer">
                    {ctaLabel}
                  </a>
                )}
              </Button>
            </div>
          ) : null}
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-accent lg:aspect-[5/6]">
          {imageSrc ? (
            <picture>
              {mobile ? (
                <source media="(max-width: 1023px)" srcSet={mobile} />
              ) : null}
              {desktop && mobile ? (
                <source media="(min-width: 1024px)" srcSet={desktop} />
              ) : null}
              <Image
                src={imageSrc}
                alt={alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </picture>
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--foreground)/0.08),transparent_60%)]"
            />
          )}
        </div>
      </div>
    </section>
  )
}

export function HeroBannerSkeleton() {
  return (
    <section
      className="relative border-b bg-surface"
      aria-hidden
      aria-busy="true"
    >
      <div className="content-container grid min-h-[70vh] items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="max-w-xl space-y-6">
          <div className="h-14 w-4/5 animate-pulse rounded bg-accent" />
          <div className="h-5 w-3/5 animate-pulse rounded bg-accent" />
          <div className="h-11 w-40 animate-pulse rounded bg-accent" />
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-accent lg:aspect-[5/6]">
          <div className="absolute inset-0 animate-pulse bg-accent" />
        </div>
      </div>
    </section>
  )
}
