import { storeConfig } from "@/config"
import type { NavigationData } from "@/components/layout/types"

import { listCategories } from "./categories"
import { listCollections } from "./collections"

/**
 * Builds the navigation tree from Medusa according to merchant config.
 * Only top-level categories are used as menu roots; their direct children
 * appear inside the mega menu.
 */
export async function getNavigationData(): Promise<NavigationData> {
  const { navigation } = storeConfig

  const [categories, collectionsRes] = await Promise.all([
    navigation.includeCategories
      ? listCategories({
          fields: "id,name,handle,*category_children,*parent_category",
        }).catch(() => [])
      : Promise.resolve([]),
    navigation.includeCollections
      ? listCollections({ fields: "id,title,handle" }).catch(() => ({
          collections: [],
          count: 0,
        }))
      : Promise.resolve({ collections: [], count: 0 }),
  ])

  const topLevel = (categories ?? [])
    .filter((c) => !c.parent_category && !c.parent_category_id)
    .slice(0, navigation.maxCategories)
    .map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
      children: (c.category_children ?? []).map((child) => ({
        id: child.id,
        name: child.name,
        handle: child.handle,
      })),
    }))

  return {
    categories: topLevel,
    collections: (collectionsRes.collections ?? []).map((c) => ({
      id: c.id,
      title: c.title,
      handle: c.handle,
    })),
  }
}
