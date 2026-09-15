import Image from "next/image"
import { ArrowRight } from "lucide-react"

import type { PromoTileConfig } from "@/config/types"
import { LocalizedLink } from "@/components/common/localized-link"

export function PromoTiles({ tiles }: { tiles: PromoTileConfig[] }) {
  if (!tiles.length) return null

  return (
    <section className="content-container py-16 lg:py-24">
      <ul className="grid gap-4 sm:grid-cols-2">
        {tiles.map((tile) => (
          <li key={tile.href + tile.title}>
            <LocalizedLink
              href={tile.href}
              className="group relative flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-lg bg-accent p-6 sm:p-8"
            >
              {tile.image && (
                <Image
                  src={tile.image.src}
                  alt={tile.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.02]"
                />
              )}
              <div className="relative space-y-1">
                <p className="text-xl font-medium">{tile.title}</p>
                {tile.subtitle && (
                  <p className="text-sm text-muted-foreground">{tile.subtitle}</p>
                )}
                <span className="inline-flex items-center gap-1 pt-2 text-sm font-medium">
                  Shop now
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </section>
  )
}
