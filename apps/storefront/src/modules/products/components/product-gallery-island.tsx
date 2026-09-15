"use client"

import { ProductGallery } from "@/components/commerce/product-gallery"

import { useProductContext } from "../context/product-context"

/** Binds the reusable gallery to the PDP's variant-aware image set. */
export function ProductGalleryIsland({ title }: { title: string }) {
  const { images } = useProductContext()
  return <ProductGallery images={images} title={title} />
}
