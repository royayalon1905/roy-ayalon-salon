import { testimonials } from '../data/testimonials'
import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'

const testimonialsContent = siteConfig.content.testimonials

// עודכן 10.8.2026 — נבנה מחדש לפי הרפרנס: 3 כרטיסים קבועים בגריד, בלי קרוסלה/חצים.
// נבחרו 3 ההמלצות הראשונות מתוך הרשימה המלאה ב-data/testimonials.js (שנשארה כמו
// שהיא, גם אם רק חלק מוצג כרגע).
function Stars() {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-primary">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const featured = testimonials.slice(0, 3)

  return (
    <section id="testimonials" className="border-b-[3px] border-b-[#9fb8b0] bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-accent">{testimonialsContent.eyebrow}</span>
          <RazorReveal as="h2" className="mx-auto mt-4 overflow-hidden font-display text-4xl text-ink sm:text-5xl">
            {testimonialsContent.title}
          </RazorReveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {featured.map((t) => (
            <figure key={t.id} className="flex flex-col border border-ink/10 bg-white p-6">
              <Stars />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted">&rdquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="block font-semibold text-ink">{t.name}</span>
                <span className="block text-xs text-muted">{t.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
