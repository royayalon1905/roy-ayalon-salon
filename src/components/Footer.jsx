import { siteConfig } from '../config/siteConfig'

const { businessInfo } = siteConfig

const LINKS = [
  { href: '#services', label: 'שירותים' },
  { href: '#gallery', label: 'עבודות' },
  { href: '#testimonials', label: 'לקוחות ממליצות' },
  { href: '#contact', label: 'צור קשר' },
]

export default function Footer() {
  return (
    <footer className="bg-charcoal-light px-6 pb-8 pt-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 border-b border-stone/10 pb-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-cream"><span className="font-light">{businessInfo.shortName}</span> <span className="text-gold">·</span> {businessInfo.category}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone">
              {businessInfo.footerTagline}
            </p>
          </div>

          <nav aria-label="קישורים">
            <p className="text-xs tracking-widest text-gold">ניווט מהיר</p>
            <ul className="mt-3 space-y-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-cream-dim hover:text-gold">{l.label}</a>
                </li>
              ))}
              <li>
                <a href="#services" className="text-sm text-cream-dim hover:text-gold">
                  הזמנת תור
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-xs tracking-widest text-gold">עקבו אחרינו</p>
            <ul className="mt-3 space-y-2">
              {businessInfo.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-sm text-cream-dim hover:text-gold">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-xs text-stone sm:flex-row">
          <p>© {new Date().getFullYear()} {businessInfo.shortName} - {businessInfo.category}. כל הזכויות שמורות.</p>
          <p>אתר דמו לצורכי הדגמה בלבד</p>
        </div>
      </div>
    </footer>
  )
}
