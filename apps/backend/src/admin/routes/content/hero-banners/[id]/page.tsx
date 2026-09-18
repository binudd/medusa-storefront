import { Container, Heading, Text, toast } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { HeroBannerForm } from "../../../../components/hero-banner-form"
import { sdk } from "../../../../lib/sdk"
import {
  bannerToFormValues,
  emptyHeroBannerForm,
  type AdminHeroBannerResponse,
} from "../../../../lib/hero-banner"

const EditHeroBannerPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["hero-banner", id],
    enabled: Boolean(id),
    queryFn: () =>
      sdk.client.fetch<AdminHeroBannerResponse>(`/admin/hero-banners/${id}`),
  })

  if (isLoading) {
    return (
      <Container className="p-6">
        <Text size="small">Loading banner...</Text>
      </Container>
    )
  }

  if (isError || !data?.hero_banner) {
    return (
      <Container className="p-6">
        <Heading level="h1">Banner not found</Heading>
        <Text size="small" className="text-ui-fg-subtle mt-2">
          {error instanceof Error ? error.message : "Unable to load banner"}
        </Text>
      </Container>
    )
  }

  return (
    <HeroBannerForm
      title={`Edit ${data.hero_banner.name}`}
      initialValues={
        data.hero_banner
          ? bannerToFormValues(data.hero_banner)
          : emptyHeroBannerForm()
      }
      submitLabel="Save changes"
      onSubmit={async (payload) => {
        await sdk.client.fetch(`/admin/hero-banners/${id}`, {
          method: "POST",
          body: payload,
        })
        toast.success("Banner updated")
        navigate("/content/hero-banners")
      }}
    />
  )
}

export default EditHeroBannerPage
