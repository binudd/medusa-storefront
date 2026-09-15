# Design

Visual identity is controlled by typed tokens, not by hex values in components.

## Tokens

`src/config/theme.config.ts` defines:

- Color roles (background, foreground, primary, muted, destructive, sale, …) as HSL triplets
- Radius, shadow, motion, container and header sizes
- Font CSS variables produced by `next/font`

`ThemeStyle` writes those values onto `:root` (and `.dark` / `[data-theme="dark"]`). Tailwind maps them in `tailwind.config.js`.

Components must use token classes:

```text
bg-background  text-foreground  bg-card  text-muted-foreground
border-border  ring-ring  bg-primary  text-primary-foreground
rounded-sm|md|lg  shadow-sm|md|lg
```

Do not scatter arbitrary hex colors. Do not introduce a second typeface without updating `theme.config.ts` and `src/app/layout.tsx`.

## Merchant theme

To ship a different brand:

1. Copy `src/config/theme.config.ts` and adjust tokens.
2. Copy `src/config/store.config.ts` and adjust name, logo, navigation, home sections and feature flags.
3. Point `src/config/index.ts` at the new files.

No component rewrite should be required for a new merchant identity.

## Visual language

This product is a quiet, editorial storefront:

- Strong type hierarchy, tight tracking on headings
- Restrained radius (2–6px)
- Almost no decorative shadow or gradient
- Product imagery on a tinted `surface`, not inside oversized cards
- Motion only for interaction (`duration-fast` / `duration-base`), honoring `prefers-reduced-motion`

Breakpoints in use: 360 / 768 / 1024 / 1440 / 1920 (`sm`–`3xl` in Tailwind).

## Accessibility

- Skip link in the root layout; `id="main"` on page content
- Visible `:focus-visible` ring from `globals.css`
- Radix for dialogs, sheets, menus, radio groups
- Cart count uses `aria-live="polite"`
- Sticky mobile CTAs include `env(safe-area-inset-bottom)` via `.pb-safe`
- Forms expose errors with `role="alert"`
