import { useEffect, useRef, useState } from 'react'
import { testimonials } from '../data/testimonials'
import RazorReveal from './RazorReveal'
import ChevronIcon from './ChevronIcon'
import { siteConfig } from '../config/siteConfig'

const testimonialsContent = siteConfig.content.testimonials

function Stars() {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-primary">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
        </svg>
      ))}
    </div>
  )
}

function ChevronButton({ direction, onClick, disabled, label }) {
  const rotate = direction === 'prev' ? '' : 'rotate-180'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center border border-ink/15 bg-white text-ink transition-colors hover:border-primary hover:text-accent disabled:pointer-events-none disabled:opacity-30"
    >
      <ChevronIcon className={`h-4 w-4 ${rotate}`} />
    </button>
  )
}

export default function Testimonials() {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const item = trackRef.current?.children[index]
    item?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [index])

  const atStart = index === 0
  const atEnd = index >= testimonials.length - 1

  return (
    <section id="testimonials" className="border-y border-ink/10 bg-surface py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] text-accent">{testimonialsContent.eyebrow}</span>
            <RazorReveal as="h2" className="mt-4 overflow-hidden font-display text-4xl text-ink sm:text-5xl">
              {testimonialsContent.title}
            </RazorReveal>
          </div>

          <div className="flex gap-2">
            <ChevronButton direction="prev" onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={atStart} label={testimonialsContent.prevLabel} />
            <ChevronButton direction="next" onClick={() => setIndex((i) => Math.min(i + 1, testimonials.length - 1))} disabled={atEnd} label={testimonialsContent.nextLabel} />
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 grid auto-cols-[85vw] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2 sm:auto-cols-[calc(20%-13px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t) => (
            <figure key={t.id} className="flex flex-col border border-ink/10 bg-white p-6">
              <Stars />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-muted">&rdquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="block font-semibold text-ink">{t.name}</span>
                <span className="block text-xs text-muted">{t.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
