export type NavCategory = {
  id: string
  name: string
  handle: string
  children: { id: string; name: string; handle: string }[]
}

export type NavCollection = {
  id: string
  title: string
  handle: string
}

export type NavigationData = {
  categories: NavCategory[]
  collections: NavCollection[]
}
