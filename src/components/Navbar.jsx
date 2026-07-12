import { useEffect, useState } from 'react'
import { siteConfig } from '../config/siteConfig'
import { useEscapeKey } from '../hooks/useEscapeKey'

const { businessInfo, nav } = siteConfig

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEscapeKey(open, () => setOpen(false))

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          scrolled ? 'border-b border-ink/10 bg-surface/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      />

      <nav
        className="relative mx-auto flex max-w-7xl items-center justify-between py-4 pl-[max(1.5rem,env(safe-area-inset-left))] pr-[max(1.5rem,env(safe-area-inset-right))] md:pl-[max(2.5rem,env(safe-area-inset-left))] md:pr-[max(2.5rem,env(safe-area-inset-right))]"
        aria-label={nav.ariaLabel}
      >
        <a href="#top" className={`font-display text-xl tracking-wide transition-colors duration-500 md:text-2xl ${scrolled ? 'text-ink' : 'text-surface'}`}>
          <span className="font-light">{businessInfo.shortName}</span><span className={scrolled ? 'text-accent' : 'text-primary'}> · </span><span className={scrolled ? 'text-muted' : 'text-surface-dim'}>{businessInfo.category}</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`relative text-sm font-medium transition-colors after:absolute after:-bottom-1 after:right-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full ${
                  scrolled
                    ? 'text-ink/80 hover:text-accent after:bg-accent'
                    : 'text-surface hover:text-primary after:bg-primary'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#services"
          className={`hidden rounded-none border px-5 py-2 text-sm font-semibold transition-colors md:inline-block ${
            scrolled
              ? 'border-ink text-ink hover:bg-ink hover:text-surface'
              : 'border-surface text-surface hover:bg-surface hover:text-ink'
          }`}
        >
          {nav.bookCta}
        </a>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-label={open ? nav.menuCloseLabel : nav.menuOpenLabel}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-px w-6 transition-transform ${scrolled ? 'bg-ink' : 'bg-surface'} ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-px w-6 transition-opacity ${scrolled ? 'bg-ink' : 'bg-surface'} ${open ? 'opacity-0' : ''}`} />
          <span className={`h-px w-6 transition-transform ${scrolled ? 'bg-ink' : 'bg-surface'} ${open ? '-translate-y-2 -rotate-45' : ''}`} />
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
            <a
              href="#services"
              onClick={() => setOpen(false)}
              className="mt-2 block border border-ink px-5 py-2 text-center text-sm font-semibold text-ink"
            >
              {nav.bookCta}
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
