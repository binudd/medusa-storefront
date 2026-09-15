import Image from "next/image"
import { ImageOff } from "lucide-react"

import { cn } from "@/lib/utils"

type ProductImageProps = {
  src?: string | null
  alt: string
  /** Tailwind aspect ratio class, defaults to the product ratio (4:5). */
  aspect?: string
  sizes?: string
  priority?: boolean
  className?: string
  imageClassName?: string
  quality?: number
}

/**
 * Consistent product imagery: fixed aspect ratio, tinted surface behind the
 * image, and a placeholder when Medusa has no image for the product.
 */
export function ProductImage({
  src,
  alt,
  aspect = "aspect-product",
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority,
  className,
  imageClassName,
  quality = 75,
}: ProductImageProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-surface",
        aspect,
        className
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          quality={quality}
          draggable={false}
          className={cn("object-cover object-center", imageClassName)}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-muted-foreground/50"
        >
          <ImageOff className="size-6" />
        </div>
      )}
    </div>
  )
}
