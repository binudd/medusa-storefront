import { NewsletterForm } from "@/components/layout/newsletter-form"

export function NewsletterSection() {
  return (
    <section className="content-container py-16 lg:py-24">
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <p className="eyebrow">Newsletter</p>
        <h2 className="text-3xl font-medium">First to know</h2>
        <p className="text-muted-foreground">
          New arrivals, restocks and the occasional note from the studio. No
          noise, unsubscribe any time.
        </p>
        <NewsletterForm className="mx-auto max-w-md" />
      </div>
    </section>
  )
}
