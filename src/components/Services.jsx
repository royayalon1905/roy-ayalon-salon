import { useState } from 'react'
import { siteConfig } from '../config/siteConfig'
import ServiceCard from './ServiceCard'

const { servicesData, staffData } = siteConfig

export default function Services({ onBook }) {
  const [activeId, setActiveId] = useState(staffData[0].id)
  const filtered = servicesData.filter((s) => s.barberId === activeId)

  return (
    <section id="services" className="bg-cream px-6 py-24 md:px-10 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-burgundy">מה אנחנו מציעים</span>
          <h2 className="mx-auto mt-4 font-display text-4xl text-charcoal sm:text-5xl">
            מחירון שירותים
          </h2>
          <span className="mx-auto mt-5 block h-px w-16 bg-gold" />
        </div>

        <div role="tablist" aria-label="בחירת מעצב/ת" className="mt-12 flex justify-start gap-2 overflow-x-auto pb-2 sm:justify-center">
          {staffData.map((b) => {
            const active = b.id === activeId
            return (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveId(b.id)}
                className={`flex shrink-0 items-center gap-2.5 rounded-full border px-3.5 py-2 text-sm transition-colors ${
                  active
                    ? 'border-charcoal bg-charcoal text-cream'
                    : 'border-charcoal/15 bg-white text-charcoal/80 hover:border-gold/60'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-display text-xs ${
                    active ? 'bg-gold text-charcoal' : 'bg-charcoal text-gold'
                  }`}
                >
                  {b.name.charAt(0)}
                </span>
                {b.name}
              </button>
            )
          })}
        </div>

        <ul className="mt-8 space-y-4">
          {filtered.map((s) => (
            <ServiceCard key={s.id} service={s} onBook={() => onBook(s.id, s.barberId)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
