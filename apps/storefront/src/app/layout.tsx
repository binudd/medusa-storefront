import { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import { storeConfig } from "@/config"
import { getBaseURL } from "@lib/util/env"
import { SkipLink } from "@/components/common/skip-link"
import { Providers } from "@/components/providers/providers"
import { ThemeStyle } from "@/components/theme/theme-style"

import "@/styles/globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: storeConfig.brand.name,
    template: storeConfig.seo.titleTemplate,
  },
  description: storeConfig.brand.description,
  icons: storeConfig.brand.favicon
    ? { icon: storeConfig.brand.favicon }
    : undefined,
  openGraph: {
    siteName: storeConfig.brand.name,
    type: "website",
  },
  twitter: storeConfig.seo.twitterHandle
    ? { card: "summary_large_image", site: storeConfig.seo.twitterHandle }
    : undefined,
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang={storeConfig.locale.default} className={inter.variable}>
      <head>
        <ThemeStyle />
      </head>
      <body>
        <SkipLink />
        <Providers>{props.children}</Providers>
      </body>
    </html>
  )
}
