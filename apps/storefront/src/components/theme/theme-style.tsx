import { themeConfig } from "@/config"
import type { ColorTokens, ThemeConfig } from "@/config/types"

const COLOR_VAR_NAMES: Record<keyof ColorTokens, string> = {
  background: "--background",
  foreground: "--foreground",
  card: "--card",
  cardForeground: "--card-foreground",
  popover: "--popover",
  popoverForeground: "--popover-foreground",
  primary: "--primary",
  primaryForeground: "--primary-foreground",
  secondary: "--secondary",
  secondaryForeground: "--secondary-foreground",
  muted: "--muted",
  mutedForeground: "--muted-foreground",
  accent: "--accent",
  accentForeground: "--accent-foreground",
  destructive: "--destructive",
  destructiveForeground: "--destructive-foreground",
  success: "--success",
  successForeground: "--success-foreground",
  warning: "--warning",
  warningForeground: "--warning-foreground",
  border: "--border",
  input: "--input",
  ring: "--ring",
  surface: "--surface",
  surfaceRaised: "--surface-raised",
  sale: "--sale",
}

function colorDeclarations(colors: ColorTokens) {
  return (Object.keys(colors) as (keyof ColorTokens)[])
    .map((key) => `${COLOR_VAR_NAMES[key]}:${colors[key]};`)
    .join("")
}

function buildCss(theme: ThemeConfig) {
  const root = [
    colorDeclarations(theme.colors.light),
    `--font-sans:${theme.fonts.sans};`,
    `--font-display:${theme.fonts.display};`,
    `--radius-sm:${theme.radius.sm};`,
    `--radius-md:${theme.radius.md};`,
    `--radius-lg:${theme.radius.lg};`,
    `--radius-xl:${theme.radius.xl};`,
    `--shadow-sm:${theme.shadow.sm};`,
    `--shadow-md:${theme.shadow.md};`,
    `--shadow-lg:${theme.shadow.lg};`,
    `--motion-fast:${theme.motion.fast};`,
    `--motion-base:${theme.motion.base};`,
    `--motion-slow:${theme.motion.slow};`,
    `--ease-out:${theme.motion.easeOut};`,
    `--ease-emphasized:${theme.motion.easeEmphasized};`,
    `--container-max:${theme.layout.containerMax};`,
    `--header-height:${theme.layout.headerHeight};`,
    `--announcement-height:${theme.layout.announcementHeight};`,
  ].join("")

  const dark = theme.colors.dark
    ? `.dark,[data-theme="dark"]{${colorDeclarations(theme.colors.dark)}}`
    : ""

  return `:root{${root}}${dark}`
}

/**
 * Server component that emits the merchant theme as CSS custom properties.
 * Rendered once in the root layout so there is no flash of unstyled content.
 */
export function ThemeStyle() {
  return (
    <style
      id="theme-tokens"
      // The CSS is generated from typed config, not user input.
      dangerouslySetInnerHTML={{ __html: buildCss(themeConfig) }}
    />
  )
}
