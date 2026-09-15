import Image from "next/image"

import { storeConfig } from "@/config"
import { cn } from "@/lib/utils"
import { LocalizedLink } from "@/components/common/localized-link"

export function Logo({ className }: { className?: string }) {
  const { brand } = storeConfig

  return (
    <LocalizedLink
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label={`${brand.name} home`}
      data-testid="nav-store-link"
    >
      {brand.logo ? (
        <Image
          src={brand.logo.src}
          alt={brand.logo.alt}
          width={brand.logo.width}
          height={brand.logo.height}
          priority
          className="h-6 w-auto"
        />
      ) : (
        <span className="font-display text-lg font-semibold tracking-tightest">
          {brand.name}
        </span>
      )}
    </LocalizedLink>
  )
}
