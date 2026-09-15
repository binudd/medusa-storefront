import type { ThemeConfig } from "./types"

/**
 * Visual identity for the storefront. Every value here becomes a CSS
 * variable on `:root` (see `src/components/theme/theme-style.tsx`) and is
 * consumed by Tailwind via `tailwind.config.js`.
 *
 * To create a merchant theme, copy this file, adjust the values, and point
 * `src/config/index.ts` at it. Components never reference raw colors.
 */
export const themeConfig: ThemeConfig = {
  fonts: {
    sans: "var(--font-inter)",
    display: "var(--font-inter)",
  },
  colors: {
    light: {
      background: "40 20% 99%",
      foreground: "24 10% 10%",
      card: "0 0% 100%",
      cardForeground: "24 10% 10%",
      popover: "0 0% 100%",
      popoverForeground: "24 10% 10%",
      primary: "24 10% 10%",
      primaryForeground: "40 20% 98%",
      secondary: "40 12% 94%",
      secondaryForeground: "24 10% 10%",
      muted: "40 12% 95%",
      mutedForeground: "24 6% 42%",
      accent: "40 12% 92%",
      accentForeground: "24 10% 10%",
      destructive: "0 72% 45%",
      destructiveForeground: "0 0% 100%",
      success: "150 45% 32%",
      successForeground: "0 0% 100%",
      warning: "32 90% 42%",
      warningForeground: "0 0% 100%",
      border: "30 10% 88%",
      input: "30 10% 84%",
      ring: "24 10% 10%",
      surface: "40 16% 96%",
      surfaceRaised: "0 0% 100%",
      sale: "0 72% 45%",
    },
    dark: {
      background: "24 8% 7%",
      foreground: "40 12% 95%",
      card: "24 8% 9%",
      cardForeground: "40 12% 95%",
      popover: "24 8% 9%",
      popoverForeground: "40 12% 95%",
      primary: "40 12% 95%",
      primaryForeground: "24 8% 7%",
      secondary: "24 6% 14%",
      secondaryForeground: "40 12% 95%",
      muted: "24 6% 14%",
      mutedForeground: "30 6% 62%",
      accent: "24 6% 16%",
      accentForeground: "40 12% 95%",
      destructive: "0 62% 55%",
      destructiveForeground: "0 0% 100%",
      success: "150 40% 45%",
      successForeground: "0 0% 100%",
      warning: "32 90% 55%",
      warningForeground: "24 8% 7%",
      border: "24 6% 18%",
      input: "24 6% 22%",
      ring: "40 12% 95%",
      surface: "24 6% 11%",
      surfaceRaised: "24 8% 9%",
      sale: "0 62% 60%",
    },
  },
  radius: {
    sm: "2px",
    md: "4px",
    lg: "6px",
    xl: "10px",
  },
  shadow: {
    sm: "0 1px 2px 0 hsl(24 10% 10% / 0.05)",
    md: "0 2px 8px -2px hsl(24 10% 10% / 0.08), 0 1px 2px hsl(24 10% 10% / 0.04)",
    lg: "0 12px 32px -12px hsl(24 10% 10% / 0.16), 0 2px 6px hsl(24 10% 10% / 0.04)",
  },
  motion: {
    fast: "120ms",
    base: "180ms",
    slow: "280ms",
    easeOut: "cubic-bezier(0.2, 0, 0, 1)",
    easeEmphasized: "cubic-bezier(0.3, 0, 0, 1)",
  },
  layout: {
    containerMax: "1440px",
    headerHeight: "64px",
    announcementHeight: "36px",
  },
}
