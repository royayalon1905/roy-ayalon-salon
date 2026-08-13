import { useState } from 'react'
import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'

const { servicesData, staffData, content } = siteConfig
const { bookingIntro } = content

// חדש 10.8.2026 — סקשן "קביעת תור" מוטמע בעמוד הבית, לפי הרפרנס מ-Claude Design.
// זה לא מערכת הזמנות נפרדת: השליחה פשוט פותחת את ה-BookingModal האמיתי (הרב-שלבי,
// המחובר ל-n8n/Supabase בפועל) עם השירות/הספר/ית שנבחרו כאן כבר ממולאים מראש.
// תאריך/שעה מועדפים ושם/טלפון/הערות שממלאים כאן הם לנוחות בלבד - לא מועברים אוטומטית
// למודל בשלב הזה (הוא אוסף אותם בעצמו בשלבים הבאים). זו החלטת יישום מכוונת כדי לא
// לשכפל את הלוגיקה האמיתית של הזמנה בשני מקומות.
export default function BookingIntro({ onBook }) {
  const [serviceId, setServiceId] = useState('')
  const [staffId, setStaffId] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onBook?.(serviceId || null, staffId || null)
  }

  return (
    <section id="booking-intro" className="border-b-[3px] border-b-[#9fb8b0] bg-surface px-6 py-24 md:px-10 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="text-xs font-semibold tracking-[0.3em] text-accent">{bookingIntro.eyebrow}</span>
          <RazorReveal as="h2" className="mx-auto mt-4 overflow-hidden font-display text-4xl text-ink sm:text-5xl">
            {bookingIntro.title}
          </RazorReveal>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted">{bookingIntro.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 border border-ink/10 bg-white p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">{bookingIntro.nameLabel}</span>
              <input
                type="text"
                placeholder={bookingIntro.namePlaceholder}
                className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">{bookingIntro.phoneLabel}</span>
              <input
                type="tel"
                placeholder={bookingIntro.phonePlaceholder}
                className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">{bookingIntro.serviceLabel}</span>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
              >
                <option value="">{bookingIntro.serviceAny}</option>
                {servicesData.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">{bookingIntro.staffLabel}</span>
              <select
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
              >
                <option value="">{bookingIntro.staffAny}</option>
                {staffData.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">{bookingIntro.dateLabel}</span>
              <input
                type="date"
                className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink focus:border-primary focus:outline-none"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium text-ink">{bookingIntro.timeLabel}</span>
              <select className="w-full border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink focus:border-primary focus:outline-none">
                {bookingIntro.timeOptions.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block font-medium text-ink">{bookingIntro.notesLabel}</span>
              <textarea
                rows={3}
                placeholder={bookingIntro.notesPlaceholder}
                className="w-full resize-none border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 flex h-[52px] w-full items-center justify-center bg-primary text-sm font-semibold tracking-wide text-white transition-opacity hover:opacity-90"
          >
            {bookingIntro.submitLabel}
          </button>
          <p className="mt-3 text-center text-xs text-muted">{bookingIntro.helperNote}</p>
        </form>
      </div>
    </section>
  )
}
