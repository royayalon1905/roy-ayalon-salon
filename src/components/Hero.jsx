import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'

const { businessInfo, theme } = siteConfig

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col justify-center overflow-hidden" aria-label="כותרת ראשית">
      <img
        src={theme.heroImage}
        alt={theme.heroImageAlt}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/55" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col px-6 py-32 text-center">
        <div className="mb-8 flex items-center justify-center gap-4 sm:gap-5">
          <span className="h-px max-w-[45px] flex-1 bg-gold sm:max-w-[75px] lg:max-w-[95px]" />
          <p className="whitespace-nowrap text-sm tracking-[0.25em] text-gold sm:text-base">{businessInfo.heroEyebrow}</p>
          <span className="h-px max-w-[45px] flex-1 bg-gold sm:max-w-[75px] lg:max-w-[95px]" />
        </div>

        <RazorReveal as="h1" className="mb-6 overflow-hidden font-display text-4xl font-light leading-tight tracking-wide text-cream sm:text-5xl lg:text-6xl">
          {businessInfo.shortName} {businessInfo.category}
        </RazorReveal>

        <RazorReveal delay={140} as="p" className="mb-12 overflow-hidden text-sm font-light tracking-widest text-cream-dim">
          {businessInfo.heroSubtitle}
        </RazorReveal>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#services"
            className="flex h-[54px] w-full min-w-[220px] items-center justify-center bg-gold text-sm font-semibold tracking-wide text-charcoal transition-opacity hover:opacity-90 sm:w-auto"
          >
            קביעת תור
          </a>
          <a
            href="#services"
            className="flex h-[54px] w-full min-w-[220px] items-center justify-center border-2 border-cream/70 text-sm font-semibold tracking-wide text-cream transition-all hover:bg-cream hover:text-charcoal sm:w-auto"
          >
            מחירון שירותים
          </a>
        </div>

        <div className="mt-24 grid grid-cols-3 gap-4 border-t border-cream/20 pt-10">
          {businessInfo.stats.map(({ num, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-2xl font-light text-gold">{num}</p>
              <p className="mt-2 text-sm text-cream-dim">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
