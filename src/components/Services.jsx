import { siteConfig } from '../config/siteConfig'
import ServiceCard from './ServiceCard'

const { servicesData, content } = siteConfig
const { services } = content

// עודכן 10.8.2026 — מחירון שטוח (5 טיפולים קבועים), לא מסונן לפי ספר/ית.
// בחירת הספר/ית נעשית בנפרד לגמרי בתוך BookingModal (שלב עצמאי משלה).
export default function Services({ onBook }) {
  return (
    <section id="services" className="border-y-[3px] border-y-[#9fb8b0] bg-surface-dim px-6 py-24 md:px-10 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-accent">{services.eyebrow}</span>
          <h2 className="mx-auto mt-4 font-display text-4xl text-ink sm:text-5xl">
            {services.title}
          </h2>
          <span className="mx-auto mt-5 block h-px w-16 bg-primary" />
        </div>

        <ul className="mt-12 space-y-4">
          {servicesData.map((s) => (
            <ServiceCard key={s.id} service={s} onBook={() => onBook(s.id, null)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
