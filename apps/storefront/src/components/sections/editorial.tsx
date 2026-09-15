import Image from "next/image"

import type { EditorialConfig } from "@/config/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LocalizedLink } from "@/components/common/localized-link"

export function Editorial({ config }: { config: EditorialConfig }) {
  const { eyebrow, title, body, cta, image, imagePosition = "right" } = config

  return (
    <section className="border-y bg-surface">
      <div className="content-container grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div
          className={cn(
            "relative aspect-[5/4] overflow-hidden rounded-lg bg-accent",
            imagePosition === "right" && "lg:order-2"
          )}
        >
          {image && (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>
        <div className="max-w-md space-y-5">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="text-3xl font-medium sm:text-4xl">{title}</h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {body}
          </p>
          {cta && (
            <Button asChild variant="outline">
              <LocalizedLink href={cta.href}>{cta.label}</LocalizedLink>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
