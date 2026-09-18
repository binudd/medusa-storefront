import { defineRouteConfig } from "@medusajs/admin-sdk"
import { PhotoSolid } from "@medusajs/icons"
import { Container, Heading, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"

const ContentPage = () => {
  return (
    <Container className="divide-y p-0">
      <div className="px-6 py-4">
        <Heading level="h1">Content</Heading>
        <Text size="small" className="text-ui-fg-subtle mt-1">
          Manage storefront content that is not part of the product catalog.
        </Text>
      </div>
      <div className="px-6 py-4">
        <Link
          to="/content/hero-banners"
          className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover text-sm font-medium"
        >
          Hero Banners
        </Link>
        <Text size="small" className="text-ui-fg-subtle mt-1">
          Upload and schedule homepage hero banners for the storefront.
        </Text>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Content",
  icon: PhotoSolid,
})

export default ContentPage
