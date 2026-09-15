# Contributing

## Local development

From the monorepo root:

```bash
# backend
pnpm --filter @dtc/backend dev

# storefront (port 8000 — required for Medusa CORS)
pnpm --filter @dtc/storefront dev
```

Required storefront env (`apps/storefront/.env.local`):

- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` (default `http://localhost:9000`)
- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`

## Scripts

```bash
pnpm --filter @dtc/storefront lint
pnpm --filter @dtc/storefront build
```

## Rules of thumb

1. Default to Server Components. Add `"use client"` only for interactivity, Zustand or Query hooks.
2. All Medusa access goes through `src/lib/data` or `src/lib/queries`. Verify SDK methods against Medusa docs before writing new calls.
3. Reuse shadcn primitives. Do not add another component library.
4. Merchant-facing copy, logo, colors and feature flags belong in `src/config`, not in JSX.
5. Every async customer-facing view needs loading, empty and error treatment.
6. Do not mock catalog, cart or checkout data.

## Pull requests

- Keep checkout payment code paths intact unless the change is a verified Medusa/Stripe fix.
- Include a short note in `CHANGELOG.md`.
