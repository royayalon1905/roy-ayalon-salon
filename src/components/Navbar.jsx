import { useState } from 'react'
import { siteConfig } from '../config/siteConfig'
import { useEscapeKey } from '../hooks/useEscapeKey'

const { businessInfo, nav } = siteConfig

// עודכן 10.8.2026 — הוסר לגמרי מנגנון "שקוף מעל ה-Hero, לבן הופך לכהה בגלילה":
// זה היה נכון כשה-Hero היה קרוסלת רקע כהה מלאה, אבל עכשיו ה-Hero החדש הוא סקשן בהיר
// (bg-surface) כמו כל השאר — אז הגרסה ה"לא-גלולה" הייתה בעצם טקסט לבן על רקע לבן,
// כלומר בלתי-נראה. הנאבבר עכשיו תמיד באותו סגנון בהיר, לפי הרפרנס.
export default function Navbar({ onBook }) {
  const [open, setOpen] = useState(false)

  useEscapeKey(open, () => setOpen(false))

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-surface/95 backdrop-blur-md">
      <nav
        className="relative mx-auto flex max-w-7xl items-center justify-between py-4 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] md:pl-[max(2.5rem,env(safe-area-inset-left))] md:pr-[max(2.5rem,env(safe-area-inset-right))]"
        aria-label={nav.ariaLabel}
      >
        <a href="#top" className="font-display text-xl tracking-wide text-ink md:text-2xl">
          {businessInfo.shortName}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-sm font-medium text-ink/80 transition-colors after:absolute after:-bottom-1 after:right-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:text-accent hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => onBook?.()}
          className="hidden rounded-none border border-ink px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-surface md:inline-block"
        >
          {nav.bookCta}
        </button>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-3 md:hidden"
          aria-label={open ? nav.menuCloseLabel : nav.menuOpenLabel}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-px w-6 bg-ink transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`h-px w-6 bg-ink transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`relative overflow-hidden border-b border-ink/10 bg-surface transition-[max-height] duration-400 ease-in-out md:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-ink/10 py-3 text-ink/80 hover:text-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onBook?.()
              }}
              className="mt-2 block w-full border border-ink px-5 py-2 text-center text-sm font-semibold text-ink"
            >
              {nav.bookCta}
            </button>
          </li>
        </ul>
      </div>
    </header>
  )
}
