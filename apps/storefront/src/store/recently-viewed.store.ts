import { create } from "zustand"
import { persist } from "zustand/middleware"

const MAX_ITEMS = 12

export type RecentlyViewedItem = {
  id: string
  handle: string
  title: string
  thumbnail: string | null
}

/**
 * Lightweight record of products the customer has viewed. Only identifiers
 * and display fields are stored; prices are always re-fetched from Medusa.
 */
type RecentlyViewedState = {
  items: RecentlyViewedItem[]
  add: (item: RecentlyViewedItem) => void
  clear: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => ({
          items: [item, ...state.items.filter((i) => i.id !== item.id)].slice(
            0,
            MAX_ITEMS
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "storefront:recently-viewed" }
  )
)
