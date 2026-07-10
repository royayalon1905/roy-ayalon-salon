import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'

const { businessInfo, theme, content } = siteConfig
const { hero } = content

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-dvh flex-col justify-center overflow-hidden" aria-label={hero.ariaLabel}>
      <img
        src={theme.heroImage}
        alt={theme.heroImageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/25" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 45%, color-mix(in srgb, var(--color-ink) 68%, transparent) 0%, color-mix(in srgb, var(--color-ink) 42%, transparent) 68%, transparent 100%), linear-gradient(to top, color-mix(in srgb, var(--color-ink) 60%, transparent) 0%, transparent 30%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col px-6 py-32 text-center">
        <div className="mb-8 flex items-center justify-center gap-4 sm:gap-5">
          <span className="h-px max-w-[45px] flex-1 bg-primary sm:max-w-[75px] lg:max-w-[95px]" />
          <p className="whitespace-nowrap text-sm tracking-[0.25em] text-primary sm:text-base">{businessInfo.heroEyebrow}</p>
          <span className="h-px max-w-[45px] flex-1 bg-primary sm:max-w-[75px] lg:max-w-[95px]" />
        </div>

        <RazorReveal as="h1" className="mb-6 overflow-hidden font-display text-5xl font-medium leading-tight tracking-wide text-surface sm:text-6xl lg:text-7xl">
          {businessInfo.shortName} {businessInfo.category}
        </RazorReveal>

        <RazorReveal delay={140} as="p" className="mb-12 overflow-hidden text-sm font-light tracking-widest text-surface-dim">
          {businessInfo.heroSubtitle}
        </RazorReveal>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#services"
            className="flex h-[54px] w-full min-w-[220px] items-center justify-center bg-primary text-sm font-semibold tracking-wide text-ink transition-opacity hover:opacity-90 sm:w-auto"
          >
            {hero.ctaBook}
          </a>
          <a
            href="#services"
            className="flex h-[54px] w-full min-w-[220px] items-center justify-center border-2 border-surface/70 text-sm font-semibold tracking-wide text-surface transition-all hover:bg-surface hover:text-ink sm:w-auto"
          >
            {hero.ctaPrices}
          </a>
        </div>

        <div className="mt-24 grid grid-cols-3 gap-4 border-t border-surface/20 pt-10">
          {businessInfo.stats.map(({ num, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-2xl font-light text-primary">{num}</p>
              <p className="mt-2 text-sm text-surface-dim">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
