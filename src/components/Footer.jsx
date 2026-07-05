import { siteConfig } from '../config/siteConfig'

const { businessInfo, nav, content } = siteConfig
const { footer } = content

export default function Footer() {
  return (
    <footer className="bg-ink-light px-6 pb-8 pt-16 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 border-b border-muted/10 pb-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-surface"><span className="font-light">{businessInfo.shortName}</span> <span className="text-primary">·</span> {businessInfo.category}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              {businessInfo.footerTagline}
            </p>
          </div>

          <nav aria-label={footer.quickNavTitle}>
            <p className="text-xs tracking-widest text-primary">{footer.quickNavTitle}</p>
            <ul className="mt-3 space-y-2">
              {nav.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-surface-dim hover:text-primary">{l.label}</a>
                </li>
              ))}
              <li>
                <a href="#services" className="text-sm text-surface-dim hover:text-primary">
                  {footer.bookingLinkLabel}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <p className="text-xs tracking-widest text-primary">{footer.socialTitle}</p>
            <ul className="mt-3 space-y-2">
              {businessInfo.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-sm text-surface-dim hover:text-primary">{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} {businessInfo.shortName} - {businessInfo.category}. {footer.rightsNote}</p>
          <p>{footer.demoNote}</p>
        </div>
      </div>
    </footer>
  )
}
