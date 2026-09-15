import { HttpTypes } from "@medusajs/types"

import { storeConfig } from "@/config"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

type Spec = { label: string; value: string | null | undefined }

/**
 * Collapsible product information (specs, shipping, returns). Server
 * component; the accordion itself is a Radix client island.
 */
export function ProductDetails({ product }: { product: HttpTypes.StoreProduct }) {
  const specs: Spec[] = [
    { label: "Material", value: product.material },
    { label: "Country of origin", value: product.origin_country },
    { label: "Type", value: product.type?.value },
    { label: "Weight", value: product.weight ? `${product.weight} g` : null },
    {
      label: "Dimensions",
      value:
        product.length && product.width && product.height
          ? `${product.length} × ${product.width} × ${product.height} cm`
          : null,
    },
  ].filter((s) => Boolean(s.value))

  return (
    <Accordion type="multiple" defaultValue={["description"]}>
      {product.description && (
        <AccordionItem value="description">
          <AccordionTrigger>Description</AccordionTrigger>
          <AccordionContent>
            <p
              className="whitespace-pre-line text-muted-foreground"
              data-testid="product-description"
            >
              {product.description}
            </p>
          </AccordionContent>
        </AccordionItem>
      )}
      {specs.length > 0 && (
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
              {specs.map((spec) => (
                <div key={spec.label} className="contents">
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </AccordionContent>
        </AccordionItem>
      )}
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping & returns</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 text-muted-foreground">
            <p>{storeConfig.product.shippingInfo}</p>
            <p>{storeConfig.product.returnsInfo}</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
