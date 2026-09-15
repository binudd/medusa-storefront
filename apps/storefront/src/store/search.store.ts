import { create } from "zustand"
import { persist } from "zustand/middleware"

const MAX_RECENT = 6

/**
 * Search command palette UI state. Recent searches are persisted locally;
 * search results are server state owned by TanStack Query.
 */
type SearchState = {
  open: boolean
  recent: string[]
  setOpen: (open: boolean) => void
  addRecent: (term: string) => void
  removeRecent: (term: string) => void
  clearRecent: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      open: false,
      recent: [],
      setOpen: (open) => set({ open }),
      addRecent: (term) => {
        const value = term.trim()
        if (!value) return
        set((state) => ({
          recent: [
            value,
            ...state.recent.filter(
              (t) => t.toLowerCase() !== value.toLowerCase()
            ),
          ].slice(0, MAX_RECENT),
        }))
      },
      removeRecent: (term) =>
        set((state) => ({ recent: state.recent.filter((t) => t !== term) })),
      clearRecent: () => set({ recent: [] }),
    }),
    {
      name: "storefront:search",
      partialize: (state) => ({ recent: state.recent }),
    }
  )
)
