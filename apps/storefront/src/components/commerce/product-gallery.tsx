"use client"

import { HttpTypes } from "@medusajs/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { ProductImage } from "./product-image"

type ProductGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  title: string
  className?: string
}

/**
 * Responsive gallery: horizontal scroll-snap carousel with dots on mobile,
 * stacked large images with a sticky thumbnail rail on desktop. Selection is
 * local UI state; images change when the parent passes a new set.
 */
export function ProductGallery({ images, title, className }: ProductGalleryProps) {
  const [active, setActive] = React.useState(0)
  const trackRef = React.useRef<HTMLDivElement>(null)

  // Reset when the image set changes (e.g. variant switch).
  const key = images.map((i) => i.id).join("|")
  React.useEffect(() => {
    setActive(0)
    trackRef.current?.scrollTo({ left: 0 })
  }, [key])

  // Keep the active dot in sync with mobile scroll position.
  React.useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const index = Math.round(track.scrollLeft / track.clientWidth)
        setActive((prev) => (prev === index ? prev : index))
      })
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      track.removeEventListener("scroll", onScroll)
    }
  }, [])

  const scrollTo = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const clamped = Math.max(0, Math.min(index, images.length - 1))
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" })
    setActive(clamped)
  }

  if (!images.length) {
    return (
      <div className={className}>
        <ProductImage src={null} alt={title} sizes="(max-width: 1024px) 100vw, 60vw" />
      </div>
    )
  }

  return (
    <div className={cn("w-full", className)} data-testid="product-gallery">
      {/* Mobile / tablet carousel */}
      <div className="relative lg:hidden">
        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${title} images`}
        >
          {images.map((image, i) => (
            <div
              key={image.id}
              className="w-full flex-none snap-center"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${images.length}`}
            >
              <ProductImage
                src={image.url}
                alt={`${title} – image ${i + 1}`}
                sizes="100vw"
                priority={i === 0}
                quality={85}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {images.map((image, i) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === active}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-fast",
                    i === active ? "w-5 bg-foreground" : "w-1.5 bg-foreground/30"
                  )}
                />
              ))}
            </div>
            <Button
              variant="secondary"
              size="icon-sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-sm"
              onClick={() => scrollTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous image"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="secondary"
              size="icon-sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-sm"
              onClick={() => scrollTo(active + 1)}
              disabled={active === images.length - 1}
              aria-label="Next image"
            >
              <ChevronRight />
            </Button>
          </>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden gap-4 lg:grid lg:grid-cols-[72px_1fr]">
        {images.length > 1 ? (
          <ul
            className="sticky top-[calc(var(--header-height)+var(--announcement-height)+1.5rem)] flex max-h-[80vh] flex-col gap-2 self-start overflow-y-auto no-scrollbar"
            aria-label="Image thumbnails"
          >
            {images.map((image, i) => (
              <li key={image.id}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-current={i === active}
                  className={cn(
                    "relative block aspect-product w-full overflow-hidden rounded-sm border bg-surface transition-colors",
                    i === active
                      ? "border-foreground"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div aria-hidden />
        )}
        <div>
          <ProductImage
            key={images[active]?.id ?? active}
            src={images[active]?.url}
            alt={`${title} – image ${active + 1}`}
            sizes="(max-width: 1280px) 55vw, 720px"
            priority
            quality={85}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  )
}
