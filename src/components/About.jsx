import RazorReveal from './RazorReveal'
import { siteConfig, fmt } from '../config/siteConfig'

const { businessInfo, content } = siteConfig
const { about } = content

export default function About() {
  return (
    <section id="about" className="bg-surface px-6 py-24 md:px-10 lg:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold tracking-[0.3em] text-accent">{about.eyebrow}</span>
        <RazorReveal as="h2" className="mx-auto mt-4 overflow-hidden font-display text-4xl text-ink sm:text-5xl">
          {about.title}
        </RazorReveal>

        {about.paragraphs.map((p, i) => (
          <p key={i} className={`leading-relaxed text-muted ${i === 0 ? 'mt-6' : 'mt-4'}`}>
            {fmt(p, { year: businessInfo.foundedYear })}
          </p>
        ))}

        <div className="mx-auto mt-8 inline-flex items-center gap-2 border border-ink/15 px-4 py-2">
          <span className="font-display text-lg text-primary">{businessInfo.foundedYear}</span>
          <span className="text-sm text-muted">{about.foundedNote}</span>
        </div>
      </div>
    </section>
  )
}
