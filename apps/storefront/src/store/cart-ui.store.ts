import { create } from "zustand"

/**
 * Cart drawer visibility. The cart itself is server state (TanStack Query).
 */
type CartUiState = {
  drawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  setDrawerOpen: (open: boolean) => void
}

export const useCartUiStore = create<CartUiState>((set) => ({
  drawerOpen: false,
  openDrawer: () => set({ drawerOpen: true }),
  closeDrawer: () => set({ drawerOpen: false }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
}))
