import { toast } from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { HeroBannerForm } from "../../../../components/hero-banner-form"
import { sdk } from "../../../../lib/sdk"
import { emptyHeroBannerForm } from "../../../../lib/hero-banner"
import type { AdminHeroBannerResponse } from "../../../../lib/hero-banner"

const CreateHeroBannerPage = () => {
  const navigate = useNavigate()

  return (
    <HeroBannerForm
      title="Create hero banner"
      initialValues={emptyHeroBannerForm()}
      submitLabel="Create banner"
      onSubmit={async (payload) => {
        const { hero_banner } = await sdk.client.fetch<AdminHeroBannerResponse>(
          "/admin/hero-banners",
          {
            method: "POST",
            body: payload,
          }
        )
        toast.success("Banner created")
        navigate(`/content/hero-banners/${hero_banner.id}`)
      }}
    />
  )
}

export default CreateHeroBannerPage
