import { useEffect, useRef, useState } from 'react'
import { testimonials } from '../data/testimonials'
import RazorReveal from './RazorReveal'

function Stars() {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-gold">
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
      className="flex h-9 w-9 items-center justify-center border border-charcoal/15 bg-white text-charcoal transition-colors hover:border-gold hover:text-burgundy disabled:pointer-events-none disabled:opacity-30"
    >
      <svg viewBox="0 0 20 20" className={`h-4 w-4 ${rotate}`} fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
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
    <section id="testimonials" className="border-y border-charcoal/10 bg-cream py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] text-burgundy">לקוחות ממליצות</span>
            <RazorReveal as="h2" className="mt-4 overflow-hidden font-display text-4xl text-charcoal sm:text-5xl">
              מה שאומרים עלינו
            </RazorReveal>
          </div>

          <div className="flex gap-2">
            <ChevronButton direction="prev" onClick={() => setIndex((i) => Math.max(i - 1, 0))} disabled={atStart} label="ביקורת קודמת" />
            <ChevronButton direction="next" onClick={() => setIndex((i) => Math.min(i + 1, testimonials.length - 1))} disabled={atEnd} label="ביקורת הבאה" />
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 grid auto-cols-[85vw] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2 sm:auto-cols-[calc(20%-13px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t) => (
            <figure key={t.id} className="flex flex-col border border-charcoal/10 bg-white p-6">
              <Stars />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-stone">&rdquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="block font-semibold text-charcoal">{t.name}</span>
                <span className="block text-xs text-stone">{t.tag}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
