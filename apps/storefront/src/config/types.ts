/**
 * Merchant configuration types.
 *
 * A merchant customizes the storefront by editing `store.config.ts` and
 * `theme.config.ts`. Components read from these and never hardcode brand
 * values, so a new merchant should rarely need to touch component code.
 */

/** HSL triplet without the `hsl()` wrapper, e.g. `"0 0% 100%"`. */
export type HslToken = string

export type ColorTokens = {
  background: HslToken
  foreground: HslToken
  card: HslToken
  cardForeground: HslToken
  popover: HslToken
  popoverForeground: HslToken
  primary: HslToken
  primaryForeground: HslToken
  secondary: HslToken
  secondaryForeground: HslToken
  muted: HslToken
  mutedForeground: HslToken
  accent: HslToken
  accentForeground: HslToken
  destructive: HslToken
  destructiveForeground: HslToken
  success: HslToken
  successForeground: HslToken
  warning: HslToken
  warningForeground: HslToken
  border: HslToken
  input: HslToken
  ring: HslToken
  /** Page-level tinted surface (e.g. hero backgrounds, image placeholders). */
  surface: HslToken
  /** Raised surface used for cards that sit on `surface`. */
  surfaceRaised: HslToken
  /** Sale / discount emphasis color. */
  sale: HslToken
}

export type RadiusScale = {
  sm: string
  md: string
  lg: string
  xl: string
}

export type ShadowScale = {
  sm: string
  md: string
  lg: string
}

export type MotionTokens = {
  fast: string
  base: string
  slow: string
  easeOut: string
  easeEmphasized: string
}

export type LayoutTokens = {
  /** Max width of page content. */
  containerMax: string
  headerHeight: string
  announcementHeight: string
}

export type ThemeConfig = {
  /**
   * Font family identifiers. These must match the `--font-*` variables
   * produced by `next/font` in `src/app/layout.tsx`.
   */
  fonts: {
    sans: string
    display: string
  }
  colors: {
    light: ColorTokens
    /** Optional dark palette; when omitted, dark mode is disabled. */
    dark?: ColorTokens
  }
  radius: RadiusScale
  shadow: ShadowScale
  motion: MotionTokens
  layout: LayoutTokens
}

export type NavLink = {
  label: string
  /** Path relative to the country prefix, e.g. `/store`. */
  href: string
  /** Optional flag to render a highlighted style (e.g. "Sale"). */
  emphasis?: boolean
}

export type FooterColumn = {
  title: string
  links: NavLink[]
}

export type SocialLink = {
  platform: "instagram" | "x" | "facebook" | "tiktok" | "youtube" | "pinterest"
  href: string
}

export type HeroConfig = {
  eyebrow?: string
  title: string
  subtitle?: string
  cta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  /** Public URL or `/public` path. When absent, a tinted surface is used. */
  image?: { src: string; alt: string }
}

export type EditorialConfig = {
  eyebrow?: string
  title: string
  body: string
  cta?: { label: string; href: string }
  image?: { src: string; alt: string }
  /** Which side the image sits on at desktop widths. */
  imagePosition?: "left" | "right"
}

export type PromoTileConfig = {
  title: string
  subtitle?: string
  href: string
  image?: { src: string; alt: string }
}

export type ValuePropConfig = {
  title: string
  description: string
  icon: "truck" | "refresh" | "shield" | "sparkles" | "leaf" | "headset"
}

export type HomeSection =
  | { type: "hero"; config: HeroConfig }
  | { type: "value-props"; items: ValuePropConfig[] }
  | {
      type: "featured-collections"
      /** Collection handles to display; when empty, the first N are used. */
      handles?: string[]
      limit?: number
      title?: string
    }
  | {
      type: "product-rail"
      /** Collection handle to pull products from. */
      collectionHandle: string
      title?: string
      limit?: number
    }
  | {
      type: "new-arrivals"
      title?: string
      limit?: number
    }
  | { type: "editorial"; config: EditorialConfig }
  | { type: "promo-tiles"; tiles: PromoTileConfig[] }
  | { type: "newsletter" }

export type FeatureFlags = {
  search: boolean
  wishlist: boolean
  reviews: boolean
  megaMenu: boolean
  announcementBar: boolean
  newsletter: boolean
  /** Show the free-shipping progress in cart drawer/page. */
  shippingProgress: boolean
  /** Show recently viewed products on the PDP. */
  recentlyViewed: boolean
  /** Allow customers to switch region/country. */
  regionSwitcher: boolean
  /** Allow customers to switch language (requires backend locales). */
  languageSwitcher: boolean
}

export type StoreConfig = {
  brand: {
    name: string
    tagline?: string
    /** Path in `/public` or absolute URL. When absent, the name is rendered as a wordmark. */
    logo?: { src: string; alt: string; width: number; height: number }
    favicon?: string
    /** Used for `<meta>` and JSON-LD. */
    description: string
    supportEmail?: string
  }
  locale: {
    /** BCP-47 tag used for `<html lang>` and Intl formatting fallbacks. */
    default: string
  }
  navigation: {
    /** Static links shown in the header, before dynamic categories. */
    primary: NavLink[]
    /** Pull top-level categories from Medusa into the header nav. */
    includeCategories: boolean
    /** Pull collections into the mega menu. */
    includeCollections: boolean
    maxCategories: number
  }
  footer: {
    columns: FooterColumn[]
    /** Auto-populate a column with categories from Medusa. */
    includeCategories: boolean
    /** Auto-populate a column with collections from Medusa. */
    includeCollections: boolean
    legal: NavLink[]
    copyright?: string
  }
  social: SocialLink[]
  announcement?: {
    messages: { text: string; href?: string }[]
  }
  features: FeatureFlags
  catalog: {
    /** Products per page on listing pages. */
    pageSize: number
    /** Default sort on listing pages. */
    defaultSort: "created_at" | "price_asc" | "price_desc"
  }
  product: {
    /** Content shown in the "Shipping & returns" accordion on the PDP. */
    shippingInfo: string
    returnsInfo: string
    /** Max quantity a customer may add per line in one action. */
    maxQuantity: number
  }
  home: {
    sections: HomeSection[]
  }
  seo: {
    /** Appended to page titles, e.g. `Product | Brand`. */
    titleTemplate: string
    twitterHandle?: string
  }
}
