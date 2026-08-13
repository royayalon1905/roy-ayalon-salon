import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'

const { businessInfo, content } = siteConfig
const { hero } = content

// עודכן 10.8.2026 — נבנה מחדש לגמרי לפי הרפרנס האמיתי מ-Claude Design: layout
// תמונה+טקסט זה-לצד-זה (לא קרוסלת רקע מלא כמו שהיה קודם). התמונה עדיין "משבצת"
// גרדיאנט placeholder — לא תמונה אמיתית של הסטודיו. TODO: להחליף בתמונה אמיתית
// לפני מעבר ללקוח אמיתי (ראו גם הערה על אותו רעיון ב-src/data/gallery.js).
export default function Hero({ onBook }) {
  return (
    <section id="top" className="border-b-[3px] border-b-[#9fb8b0] bg-surface px-6 pb-20 pt-32 md:px-10 lg:pb-28 lg:pt-40" aria-label={hero.ariaLabel}>
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-1 aspect-[4/3] overflow-hidden lg:order-none">
          <div
            className="h-full w-full"
            style={{ background: 'linear-gradient(135deg, #9fc4b8 0%, #3e7c6f 55%, #1e2b26 100%)' }}
            role="img"
            aria-label="תמונת פתיחה מהסטודיו"
          />
          <span className="absolute bottom-4 right-4 bg-ink/80 px-3 py-1.5 text-xs font-semibold tracking-wide text-surface-dim">
            פן ועיצוב
          </span>
        </div>

        <div className="order-2 text-center lg:order-none lg:text-right">
          <span className="text-xs font-semibold tracking-[0.3em] text-accent">
            {businessInfo.shortName} · {businessInfo.city}
          </span>
          <RazorReveal as="h1" className="mx-auto mt-4 overflow-hidden font-display text-4xl leading-tight text-ink sm:text-5xl lg:mx-0 lg:text-6xl">
            {businessInfo.heroHeadline.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </RazorReveal>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted lg:mx-0">{businessInfo.heroSubtitle}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
            <button
              type="button"
              onClick={() => onBook?.()}
              className="flex h-[52px] w-full min-w-[200px] items-center justify-center bg-primary text-sm font-semibold tracking-wide text-white transition-opacity hover:opacity-90 sm:w-auto"
            >
              {hero.ctaBook}
            </button>
            <a href="#services" className="text-sm font-semibold tracking-wide text-ink underline-offset-4 hover:underline">
              {hero.ctaPrices} ←
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
