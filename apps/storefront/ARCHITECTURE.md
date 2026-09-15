# Architecture

This storefront is a Next.js App Router application that talks to a Medusa backend through the official JS SDK. The goal is a commercially reusable, white-label ecommerce frontend: merchants change configuration and theme tokens, not component internals.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 App Router, React 19 |
| Commerce API | Medusa JS SDK (`@medusajs/js-sdk` 2.21) |
| Server state | TanStack Query (client) + Next.js fetch cache (server) |
| Client / UI state | Zustand, focused stores |
| UI primitives | shadcn/ui on Radix |
| Styling | Tailwind CSS v3 + CSS-variable design tokens |
| Payments | Stripe via `@stripe/react-stripe-js` (existing Medusa checkout) |

## Folder structure

```text
src/
  app/                  App Router pages and layouts
  components/
    ui/                 shadcn/Radix primitives
    commerce/           reusable ecommerce components
    layout/             header, footer, drawers, search
    sections/           homepage sections driven by store config
    common/             empty/error/skip-link helpers
    providers/          Query + tooltip + toaster
    theme/              injects theme tokens as CSS
  config/               merchant store + theme configuration
  lib/
    config.ts           Medusa SDK client
    data/               server-only SDK access + server actions
    queries/            TanStack Query keys, hooks, client
  store/                Zustand UI stores
  modules/              feature templates (account, cart, checkout, products, store)
```

`modules/` is the original Medusa starter boundary for checkout, cart templates and account flows. Shared presentation lives in `components/`. Do not add a second UI kit.

## Data flow

```text
Medusa backend
  → Medusa SDK (`src/lib/config.ts`)
  → typed data / server actions (`src/lib/data/*`)
  → Server Components (SEO, first paint)
  → TanStack Query (interactive client state: cart, search, shipping quotes)
  → Zustand (drawers, palettes, recently viewed)
  → domain components → shadcn/Radix → Tailwind tokens → pages
```

UI components never call the Medusa SDK directly.

## State management

- **TanStack Query** owns server-originated data that the client mutates or refetches: cart, product search, shipping option prices.
- **Zustand** owns UI-only state: mobile nav, cart drawer, search command, recently viewed IDs.
- **React state** is for local form fields (checkout addresses, variant selection).
- Do not copy Medusa API responses into Zustand.

Query keys live in `src/lib/queries/keys.ts`. Invalidate through that factory.

## Medusa integration

- SDK is created in `src/lib/config.ts` with `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.
- Product queries always pass `region_id` so `calculated_price` is present.
- Prices are displayed as-is. Do not divide by 100.
- Cart line items use dedicated create/update/delete methods; email, addresses, region and promo codes use cart update.
- Checkout payment sessions and Stripe Elements are preserved in `src/modules/checkout`. Restyle them; do not replace the payment flow.

## Caching

- Server fetches use Next.js `cache` + `revalidateTag` via helpers in `src/lib/data/cookies.ts`.
- Client Query defaults: `staleTime` 60s, no refetch on window focus, hydration from `HydrationBoundary` in the main layout for the cart.
- After cart mutations, invalidate `queryKeys.cart.detail()`.

## How to add a commerce feature

1. Add or extend a function in `src/lib/data` that uses the SDK (verify the method against Medusa docs first).
2. If the UI is interactive and needs refetch/optimistic updates, add a Query hook under `src/lib/queries`.
3. Compose shadcn primitives into a component in `src/components/commerce`.
4. Wire it into a page or `modules/` template. Default to a Server Component.

## How to add a UI component

1. Prefer an existing file in `src/components/ui`.
2. If missing, add it with the shadcn CLI (`pnpm dlx shadcn@latest add <name>`) so Radix wiring stays consistent.
3. Style only with Tailwind token classes (`bg-background`, `text-muted-foreground`, `border-border`, `rounded-md`).
