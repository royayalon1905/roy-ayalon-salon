import { useEffect, useState } from 'react'
import { siteConfig } from '../config/siteConfig'

const { businessInfo } = siteConfig

const LINKS = [
  { href: '#services', label: 'שירותים' },
  { href: '#gallery', label: 'עבודות' },
  { href: '#testimonials', label: 'לקוחות ממליצות' },
  { href: '#contact', label: 'צור קשר' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          scrolled ? 'border-b border-charcoal/10 bg-cream/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10" aria-label="ניווט ראשי">
        <a href="#top" className="font-display text-xl tracking-wide text-charcoal md:text-2xl">
          <span className="font-light">{businessInfo.shortName}</span><span className="text-burgundy"> · </span><span className="text-stone">{businessInfo.category}</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-sm font-medium text-charcoal/80 transition-colors hover:text-burgundy after:absolute after:-bottom-1 after:right-0 after:h-px after:w-0 after:bg-burgundy after:transition-all after:duration-300 hover:after:w-full"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#services"
          className="hidden rounded-none border border-charcoal px-5 py-2 text-sm font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-cream md:inline-block"
        >
          קבעו תור
        </a>

        <button
          type="button"
          className="flex flex-col gap-1.5 p-2 md:hidden"
          aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-px w-6 bg-charcoal transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-px w-6 bg-charcoal transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`h-px w-6 bg-charcoal transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={`relative overflow-hidden border-b border-charcoal/10 bg-cream transition-[max-height] duration-400 ease-in-out md:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-charcoal/10 py-3 text-charcoal/80 hover:text-burgundy"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#services"
              onClick={() => setOpen(false)}
              className="mt-2 block border border-charcoal px-5 py-2 text-center text-sm font-semibold text-charcoal"
            >
              קבעו תור
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
