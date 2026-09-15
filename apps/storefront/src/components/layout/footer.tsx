import { storeConfig } from "@/config"
import type { SocialLink } from "@/config/types"
import { getNavigationData } from "@lib/data/navigation"
import { LocalizedLink } from "@/components/common/localized-link"
import { SocialIcon } from "@/components/common/social-icon"

import { NewsletterForm } from "./newsletter-form"

const socialLabel: Record<SocialLink["platform"], string> = {
  instagram: "Instagram",
  x: "X",
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  pinterest: "Pinterest",
}

export async function Footer() {
  const { brand, footer, social, features } = storeConfig
  const navigation = await getNavigationData()

  const columns = [
    ...footer.columns,
    ...(footer.includeCategories && navigation.categories.length
      ? [
          {
            title: "Shop",
            links: navigation.categories.map((c) => ({
              label: c.name,
              href: `/categories/${c.handle}`,
            })),
          },
        ]
      : []),
    ...(footer.includeCollections && navigation.collections.length
      ? [
          {
            title: "Collections",
            links: navigation.collections.slice(0, 6).map((c) => ({
              label: c.title,
              href: `/collections/${c.handle}`,
            })),
          },
        ]
      : []),
  ]

  return (
    <footer className="mt-24 border-t bg-surface">
      <div className="content-container py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm space-y-5">
            <LocalizedLink href="/" className="inline-block font-display text-lg font-semibold tracking-tightest">
              {brand.name}
            </LocalizedLink>
            {brand.tagline && (
              <p className="text-sm text-muted-foreground">{brand.tagline}</p>
            )}
            {features.newsletter && (
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium">Stay in the loop</p>
                <NewsletterForm />
              </div>
            )}
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <p className="eyebrow mb-4">{column.title}</p>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.href}-${link.label}`}>
                      <LocalizedLink
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-14 flex flex-col-reverse gap-6 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>
              {footer.copyright ??
                `© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`}
            </span>
            {footer.legal.map((link) => (
              <LocalizedLink
                key={link.href + link.label}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </LocalizedLink>
            ))}
          </div>
          {social.length > 0 && (
            <ul className="flex items-center gap-3">
              {social.map((s) => (
                <li key={s.platform}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex size-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
                    aria-label={socialLabel[s.platform]}
                  >
                    <SocialIcon platform={s.platform} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
