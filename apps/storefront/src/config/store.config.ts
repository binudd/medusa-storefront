import type { StoreConfig } from "./types"

/**
 * Merchant-level storefront configuration.
 *
 * Anything a merchant would want to change without touching components lives
 * here: brand identity, navigation, footer, feature flags and home page
 * composition. Catalog data (products, categories, prices) always comes from
 * Medusa and is never hardcoded.
 */
export const storeConfig: StoreConfig = {
  brand: {
    name: "Psydady",
    tagline: "Considered goods for everyday life",
    description:
      "A curated collection of thoughtfully designed products, made to last.",
    supportEmail: "hello@example.com",
  },
  locale: {
    default: "en",
  },
  navigation: {
    primary: [
      { label: "Shop all", href: "/store" },
      { label: "New in", href: "/store?sortBy=created_at" },
    ],
    includeCategories: true,
    includeCollections: true,
    maxCategories: 6,
  },
  footer: {
    columns: [
      {
        title: "Help",
        links: [
          { label: "Shipping & delivery", href: "/store" },
          { label: "Returns & exchanges", href: "/store" },
          { label: "Contact us", href: "mailto:hello@example.com" },
        ],
      },
      {
        title: "Account",
        links: [
          { label: "Sign in", href: "/account" },
          { label: "Orders", href: "/account/orders" },
          { label: "Addresses", href: "/account/addresses" },
        ],
      },
    ],
    includeCategories: true,
    includeCollections: true,
    legal: [
      { label: "Privacy", href: "/store" },
      { label: "Terms", href: "/store" },
    ],
  },
  social: [
    { platform: "instagram", href: "https://instagram.com" },
    { platform: "x", href: "https://x.com" },
  ],
  announcement: {
    messages: [
      { text: "Complimentary shipping on orders over the threshold" },
      { text: "New season arrivals are here", href: "/store" },
    ],
  },
  features: {
    search: true,
    wishlist: false,
    reviews: false,
    megaMenu: true,
    announcementBar: true,
    newsletter: true,
    shippingProgress: true,
    recentlyViewed: true,
    regionSwitcher: true,
    languageSwitcher: true,
  },
  catalog: {
    pageSize: 12,
    defaultSort: "created_at",
  },
  product: {
    shippingInfo:
      "Orders are dispatched within 1-2 business days. Delivery times vary by destination and are shown at checkout.",
    returnsInfo:
      "Unworn items in original packaging can be returned within 30 days of delivery for a full refund.",
    maxQuantity: 10,
  },
  home: {
    sections: [
      {
        type: "hero",
        config: {
          eyebrow: "New season",
          title: "Made to be lived in",
          subtitle:
            "Quiet, considered pieces designed to last well beyond the season.",
          cta: { label: "Shop the collection", href: "/store" },
          secondaryCta: { label: "Our story", href: "/store" },
        },
      },
      {
        type: "value-props",
        items: [
          {
            icon: "truck",
            title: "Free shipping",
            description: "On qualifying orders, shown at checkout.",
          },
          {
            icon: "refresh",
            title: "30-day returns",
            description: "Changed your mind? Send it back, no fuss.",
          },
          {
            icon: "shield",
            title: "Secure checkout",
            description: "Encrypted payments with trusted providers.",
          },
        ],
      },
      { type: "featured-collections", limit: 3 },
      { type: "new-arrivals", title: "New arrivals", limit: 8 },
      {
        type: "editorial",
        config: {
          eyebrow: "Our approach",
          title: "Fewer, better things",
          body: "We work with small workshops and choose materials that age gracefully. Every product is designed to be repaired, not replaced.",
          cta: { label: "Explore the range", href: "/store" },
          imagePosition: "right",
        },
      },
      { type: "newsletter" },
    ],
  },
  seo: {
    titleTemplate: "%s | Atelier",
  },
}
