import { useState } from 'react'
import RazorReveal from './RazorReveal'
import ChevronIcon from './ChevronIcon'
import { siteConfig } from '../config/siteConfig'

const { faq } = siteConfig.content

// חדש 10.8.2026 — סקשן FAQ (רכיב חדש לגמרי, לא היה קיים קודם). אקורדיון פשוט
// (שאלה אחת פתוחה בכל פעם), נגיש עם aria-expanded + aria-controls.
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section id="faq" className="border-b-[3px] border-b-[#9fb8b0] bg-surface-dim px-6 py-24 md:px-10 lg:py-32">
      <div className="mx-auto max-w-2xl">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-accent">{faq.eyebrow}</span>
          <RazorReveal as="h2" className="mx-auto mt-4 overflow-hidden font-display text-4xl text-ink sm:text-5xl">
            {faq.title}
          </RazorReveal>
        </div>

        <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
          {faq.items.map((item, i) => {
            const isOpen = openIndex === i
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-right text-base font-medium text-ink hover:text-accent"
                  >
                    <span>{item.q}</span>
                    <ChevronIcon className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? '-rotate-90' : 'rotate-180'}`} />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${
                    isOpen ? 'grid-rows-[1fr] pb-5' : 'grid-rows-[0fr]'
                  }`}
                >
                  <p className="overflow-hidden text-sm leading-relaxed text-muted">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
