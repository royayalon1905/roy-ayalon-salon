import { gallery } from '../data/gallery'
import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'

const galleryContent = siteConfig.content.gallery

// עודכן 10.8.2026 — מבנה "לפני/אחרי" (6 זוגות) לפי מפרט העיצוב החדש,
// במקום גלריית תמונות בודדות. כרגע כל חצי הוא "משבצת" גרדיאנט placeholder —
// לא תמונה אמיתית. TODO: להחליף ב-<img> אמיתי לפני מעבר ללקוח אמיתי
// (ראה הערה מפורטת יותר ב-src/data/gallery.js).
export default function Gallery() {
  return (
    <section id="gallery" className="border-b-[3px] border-b-[#9fb8b0] bg-surface-dim py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-accent">{galleryContent.eyebrow}</span>
          <RazorReveal as="h2" className="mx-auto mt-4 overflow-hidden font-display text-4xl text-ink sm:text-5xl">
            {galleryContent.title}
          </RazorReveal>
          <span className="mx-auto mt-5 block h-px w-16 bg-primary" />
        </div>

        <div
          role="region"
          aria-label={galleryContent.title}
          tabIndex={0}
          className="mt-12 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:pb-0 lg:grid-cols-3"
        >
          {gallery.map((g) => (
            <figure
              key={g.id}
              className="group relative w-[80vw] max-w-[360px] shrink-0 snap-center overflow-hidden border border-ink/10 bg-white sm:w-auto sm:max-w-none"
            >
              <div className="grid grid-cols-2">
                <div className="relative aspect-[3/4]">
                  <div
                    className="h-full w-full grayscale-[10%]"
                    style={{ background: g.before.gradient }}
                    role="img"
                    aria-label={g.before.alt}
                  />
                  <span className="absolute inset-x-0 top-0 bg-ink/70 py-1 text-center text-[10px] font-semibold tracking-[0.2em] text-surface-dim">
                    לפני
                  </span>
                </div>
                <div className="relative aspect-[3/4]">
                  <div
                    className="h-full w-full"
                    style={{ background: g.after.gradient }}
                    role="img"
                    aria-label={g.after.alt}
                  />
                  <span className="absolute inset-x-0 top-0 bg-primary/90 py-1 text-center text-[10px] font-semibold tracking-[0.2em] text-white">
                    אחרי
                  </span>
                </div>
              </div>
              <figcaption className="border-t border-ink/10 bg-white px-4 py-3 text-center text-sm text-ink">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
