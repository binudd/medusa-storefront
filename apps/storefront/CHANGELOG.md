# Changelog

## Unreleased

- Establish a white-label architecture: merchant `store.config` / `theme.config`, CSS design tokens, shadcn/Radix UI layer.
- Centralize Medusa access in `lib/data` and client server-state in TanStack Query; Zustand is limited to UI chrome.
- Rebuild home, listing, product, cart, search and checkout chrome on the new system without replacing Stripe checkout.
- Rebuild account, orders, password reset and confirmation pages on the same primitives.
- Add skip link, global error boundary, empty/error states and architecture documentation.
- Remove unused Medusa starter layout, home, skeleton and common UI modules that competed with the new system.
- Redirect `/checkout` to the next incomplete step so the address form is never blank.
- Deduplicate compact cart totals in the drawer.
