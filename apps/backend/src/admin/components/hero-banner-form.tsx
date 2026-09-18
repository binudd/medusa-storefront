import { FormEvent, useState } from "react"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Switch,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useNavigate } from "react-router-dom"
import { HeroBannerImageField } from "./hero-banner-image-field"
import {
  formValuesToPayload,
  type HeroBannerFormValues,
} from "../lib/hero-banner"

type HeroBannerFormProps = {
  title: string
  initialValues: HeroBannerFormValues
  submitLabel: string
  onSubmit: (payload: ReturnType<typeof formValuesToPayload>) => Promise<void>
}

export function HeroBannerForm({
  title,
  initialValues,
  submitLabel,
  onSubmit,
}: HeroBannerFormProps) {
  const navigate = useNavigate()
  const [values, setValues] = useState<HeroBannerFormValues>(initialValues)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = <K extends keyof HeroBannerFormValues>(
    key: K,
    value: HeroBannerFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!values.name.trim()) {
      setError("Banner name is required")
      return
    }

    if (values.starts_at && values.ends_at) {
      if (new Date(values.starts_at) > new Date(values.ends_at)) {
        setError("Start date cannot be after end date")
        return
      }
    }

    setSaving(true)
    try {
      await onSubmit(formValuesToPayload(values))
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save banner"
      setError(message)
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between gap-x-2">
        <Heading level="h1">{title}</Heading>
        <div className="flex items-center gap-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/content/hero-banners")}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={saving}>
            {submitLabel}
          </Button>
        </div>
      </div>

      {error ? (
        <Container className="border-ui-border-error bg-ui-bg-base p-4">
          <Text size="small" className="text-ui-fg-error">
            {error}
          </Text>
        </Container>
      ) : null}

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Basic information</Heading>
        </div>
        <div className="grid gap-4 px-6 py-4 md:grid-cols-2">
          <div className="flex flex-col gap-y-2 md:col-span-2">
            <Label htmlFor="name" size="small" weight="plus">
              Banner name
            </Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Summer Collection"
              required
            />
          </div>
          <div className="flex flex-col gap-y-2 md:col-span-2">
            <Label htmlFor="heading" size="small" weight="plus">
              Heading
            </Label>
            <Input
              id="heading"
              value={values.heading}
              onChange={(e) => update("heading", e.target.value)}
              placeholder="Summer Collection"
              maxLength={160}
            />
          </div>
          <div className="flex flex-col gap-y-2 md:col-span-2">
            <Label htmlFor="subheading" size="small" weight="plus">
              Subheading
            </Label>
            <Textarea
              id="subheading"
              value={values.subheading}
              onChange={(e) => update("subheading", e.target.value)}
              placeholder="Discover the latest styles"
              rows={3}
              maxLength={320}
            />
          </div>
        </div>
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Images</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1">
            Desktop and mobile images are configured independently.
          </Text>
        </div>
        <div className="grid gap-6 px-6 py-4 lg:grid-cols-2">
          <HeroBannerImageField
            label="Desktop image"
            hint="Recommended aspect ratio around 16:6 or 16:7"
            url={values.desktop_image_url}
            fileId={values.desktop_image_id}
            onChange={({ url, fileId }) => {
              update("desktop_image_url", url)
              update("desktop_image_id", fileId)
            }}
          />
          <HeroBannerImageField
            label="Mobile image"
            hint="Recommended aspect ratio around 4:5 or 3:4"
            url={values.mobile_image_url}
            fileId={values.mobile_image_id}
            onChange={({ url, fileId }) => {
              update("mobile_image_url", url)
              update("mobile_image_id", fileId)
            }}
          />
        </div>
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Call to action</Heading>
        </div>
        <div className="grid gap-4 px-6 py-4 md:grid-cols-2">
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="button_text" size="small" weight="plus">
              Button text
            </Label>
            <Input
              id="button_text"
              value={values.button_text}
              onChange={(e) => update("button_text", e.target.value)}
              placeholder="Shop Now"
              maxLength={80}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="button_link" size="small" weight="plus">
              Button link
            </Label>
            <Input
              id="button_link"
              value={values.button_link}
              onChange={(e) => update("button_link", e.target.value)}
              placeholder="/collections/summer"
            />
          </div>
        </div>
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-4">
          <Heading level="h2">Publishing</Heading>
        </div>
        <div className="grid gap-4 px-6 py-4 md:grid-cols-2">
          <div className="flex items-center justify-between gap-x-2 md:col-span-2">
            <div>
              <Text size="small" weight="plus">
                Active
              </Text>
              <Text size="small" className="text-ui-fg-subtle">
                Inactive banners are never returned by the store API.
              </Text>
            </div>
            <Switch
              checked={values.is_active}
              onCheckedChange={(checked) => update("is_active", checked)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="sort_order" size="small" weight="plus">
              Sort order
            </Label>
            <Input
              id="sort_order"
              type="number"
              min={0}
              max={9999}
              value={values.sort_order}
              onChange={(e) =>
                update("sort_order", Number(e.target.value) || 0)
              }
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="starts_at" size="small" weight="plus">
              Start date
            </Label>
            <Input
              id="starts_at"
              type="datetime-local"
              value={values.starts_at}
              onChange={(e) => update("starts_at", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <Label htmlFor="ends_at" size="small" weight="plus">
              End date
            </Label>
            <Input
              id="ends_at"
              type="datetime-local"
              value={values.ends_at}
              onChange={(e) => update("ends_at", e.target.value)}
            />
          </div>
        </div>
      </Container>
    </form>
  )
}
