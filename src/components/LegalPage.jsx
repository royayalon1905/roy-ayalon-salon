import { useEffect } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { siteConfig, fmt } from '../config/siteConfig'

const { businessInfo, content } = siteConfig
const { legal } = content

export default function LegalPage({ page }) {
  useEffect(() => {
    document.title = `${page.metaTitle} | ${businessInfo.shortName}`
  }, [page.metaTitle])

  return (
    <div className="min-h-dvh bg-surface font-body">
      <Navbar />
      <main id="main" className="mx-auto max-w-3xl px-6 py-32 md:px-10">
        <a href="/" className="text-sm text-accent hover:underline">
          ← {legal.backLabel}
        </a>

        <h1 className="mt-6 font-display text-4xl text-ink sm:text-5xl">{page.title}</h1>
        <p className="mt-2 text-xs tracking-wide text-muted">
          {legal.updatedLabel}: {legal.updatedDate}
        </p>

        <p className="mt-8 leading-relaxed text-ink/80">{fmt(page.intro, { shortName: businessInfo.shortName })}</p>

        {page.sections.map((section) => (
          <section key={section.heading} className="mt-10">
            <h2 className="font-display text-xl text-ink">{section.heading}</h2>
            {section.paragraphs?.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-ink/80">
                {p}
              </p>
            ))}
            {section.list && (
              <ul className="mt-3 list-inside list-disc space-y-2 leading-relaxed text-ink/80">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        {page.contact && (
          <section className="mt-10 border border-ink/10 bg-white p-6">
            <h2 className="font-display text-xl text-ink">{page.contact.heading}</h2>
            {page.contact.paragraphs.map((p) => (
              <p key={p} className="mt-3 leading-relaxed text-ink/80">
                {p}
              </p>
            ))}
            <dl className="mt-4 space-y-1 text-sm text-ink/80">
              {page.contact.roleLabel && (
                <div className="flex gap-2">
                  <dt className="font-semibold text-ink">{page.contact.roleLabel}:</dt>
                  <dd>{businessInfo.shortName}</dd>
                </div>
              )}
              <div className="flex gap-2">
                <dt className="font-semibold text-ink">{page.contact.phoneLabel}:</dt>
                <dd>
                  <a href={`tel:${businessInfo.phone}`} className="hover:text-accent">
                    {businessInfo.phone}
                  </a>
                </dd>
              </div>
            </dl>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
