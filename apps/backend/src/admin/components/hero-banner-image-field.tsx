import { useRef, useState } from "react"
import { Button, Hint, Label, Text, toast } from "@medusajs/ui"
import { Photo, Trash } from "@medusajs/icons"
import { sdk } from "../lib/sdk"

type HeroBannerImageFieldProps = {
  label: string
  hint: string
  url: string
  fileId: string
  onChange: (next: { url: string; fileId: string }) => void
}

export function HeroBannerImageField({
  label,
  hint,
  url,
  fileId,
  onChange,
}: HeroBannerImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File | undefined) => {
    if (!file) {
      return
    }

    setUploading(true)
    try {
      const { files } = await sdk.admin.upload.create({
        files: [file],
      })
      const uploaded = files?.[0]
      if (!uploaded?.url) {
        throw new Error("Upload did not return a file URL")
      }
      onChange({
        url: uploaded.url,
        fileId: uploaded.id ?? fileId,
      })
      toast.success(`${label} uploaded`)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload image"
      toast.error(message)
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between gap-x-2">
        <Label weight="plus" size="small">
          {label}
        </Label>
        {url ? (
          <Button
            type="button"
            variant="transparent"
            size="small"
            onClick={() => onChange({ url: "", fileId: "" })}
          >
            <Trash />
            Remove
          </Button>
        ) : null}
      </div>
      <Hint>{hint}</Hint>

      {url ? (
        <div className="bg-ui-bg-subtle border-ui-border-base overflow-hidden rounded-lg border">
          <img
            src={url}
            alt={`${label} preview`}
            className="max-h-56 w-full object-cover"
          />
        </div>
      ) : (
        <div className="border-ui-border-base bg-ui-bg-subtle text-ui-fg-muted flex min-h-40 flex-col items-center justify-center gap-y-2 rounded-lg border border-dashed px-4 py-8">
          <Photo />
          <Text size="small" leading="compact">
            No image selected
          </Text>
        </div>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleUpload(event.target.files?.[0])}
        />
        <Button
          type="button"
          variant="secondary"
          size="small"
          isLoading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {url ? "Replace image" : "Upload image"}
        </Button>
      </div>
    </div>
  )
}
