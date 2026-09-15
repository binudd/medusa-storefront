import { create } from "zustand"

/**
 * Global, non-persistent UI state (open/closed overlays).
 * Server data never lives here; see `src/lib/queries`.
 */
type UiState = {
  mobileNavOpen: boolean
  filtersOpen: boolean
  setMobileNavOpen: (open: boolean) => void
  setFiltersOpen: (open: boolean) => void
  closeAll: () => void
}

export const useUiStore = create<UiState>((set) => ({
  mobileNavOpen: false,
  filtersOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  setFiltersOpen: (open) => set({ filtersOpen: open }),
  closeAll: () => set({ mobileNavOpen: false, filtersOpen: false }),
}))
