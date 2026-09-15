import Image from "next/image"

import type { HeroConfig } from "@/config/types"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/common/localized-link"

export function Hero({ config }: { config: HeroConfig }) {
  const { eyebrow, title, subtitle, cta, secondaryCta, image } = config

  return (
    <section className="relative border-b bg-surface" aria-labelledby="hero-title">
      <div className="content-container grid min-h-[70vh] items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="max-w-xl space-y-6">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1
            id="hero-title"
            className="text-4xl font-medium leading-[1.05] tracking-tightest sm:text-5xl lg:text-6xl"
          >
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-md text-base text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg">
              <LocalizedLink href={cta.href}>{cta.label}</LocalizedLink>
            </Button>
            {secondaryCta && (
              <Button asChild size="lg" variant="outline">
                <LocalizedLink href={secondaryCta.href}>
                  {secondaryCta.label}
                </LocalizedLink>
              </Button>
            )}
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-accent lg:aspect-[5/6]">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
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
