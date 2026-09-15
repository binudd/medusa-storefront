import {
  Headset,
  Leaf,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react"

import type { ValuePropConfig } from "@/config/types"

const icons: Record<ValuePropConfig["icon"], React.ElementType> = {
  truck: Truck,
  refresh: RefreshCw,
  shield: ShieldCheck,
  sparkles: Sparkles,
  leaf: Leaf,
  headset: Headset,
}

export function ValueProps({ items }: { items: ValuePropConfig[] }) {
  if (!items.length) return null

  return (
    <section className="border-b" aria-label="Why shop with us">
      <div className="content-container">
        <ul className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {items.map((item) => {
            const Icon = icons[item.icon]
            return (
              <li
                key={item.title}
                className="flex items-start gap-4 py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0"
              >
                <Icon className="mt-0.5 size-5 shrink-0 text-foreground" aria-hidden />
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
