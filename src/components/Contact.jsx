import { useId, useState } from 'react'
import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'

const { businessInfo } = siteConfig

export default function Contact() {
  const [values, setValues] = useState({ name: '', contact: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const nameId = useId()
  const contactId = useId()
  const messageId = useId()

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = {}
    if (!values.name.trim()) nextErrors.name = 'נא למלא שם'
    const isPhone = /^0\d{8,9}$/.test(values.contact.trim())
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contact.trim())
    if (!isPhone && !isEmail) nextErrors.contact = 'נא להזין טלפון או אימייל תקין'
    if (!values.message.trim()) nextErrors.message = 'נא לכתוב הודעה קצרה'

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setSent(true)
  }

  return (
    <section id="contact" className="bg-cream px-6 py-24 md:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <span className="text-xs font-semibold tracking-[0.3em] text-burgundy">בואו לבקר</span>
        <RazorReveal as="h2" className="mt-4 overflow-hidden font-display text-4xl text-charcoal sm:text-5xl">
          יש שאלה? בואו נדבר
        </RazorReveal>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center border border-gold/30 bg-charcoal p-10 text-center" role="status">
                <p className="font-display text-2xl text-cream">ההודעה נשלחה</p>
                <p className="mt-2 text-stone">נחזור אליכם בהקדם. תודה שפניתם אלינו.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false)
                    setValues({ name: '', contact: '', message: '' })
                  }}
                  className="mt-6 text-sm font-semibold text-gold hover:underline"
                >
                  שליחת הודעה נוספת
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={nameId} className="text-sm text-stone">שם</label>
                  <input
                    id={nameId}
                    type="text"
                    value={values.name}
                    onChange={(e) => update('name', e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${nameId}-err` : undefined}
                    className={`border bg-transparent px-3 py-2.5 text-charcoal placeholder:text-stone/50 focus:border-burgundy ${errors.name ? 'border-burgundy' : 'border-charcoal/20'}`}
                    placeholder="השם שלך"
                  />
                  {errors.name && <p id={`${nameId}-err`} className="text-xs text-burgundy">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={contactId} className="text-sm text-stone">טלפון או אימייל</label>
                  <input
                    id={contactId}
                    type="text"
                    value={values.contact}
                    onChange={(e) => update('contact', e.target.value)}
                    aria-invalid={Boolean(errors.contact)}
                    aria-describedby={errors.contact ? `${contactId}-err` : undefined}
                    className={`border bg-transparent px-3 py-2.5 text-charcoal placeholder:text-stone/50 focus:border-burgundy ${errors.contact ? 'border-burgundy' : 'border-charcoal/20'}`}
                    placeholder="0501234567 או you@example.com"
                  />
                  {errors.contact && <p id={`${contactId}-err`} className="text-xs text-burgundy">{errors.contact}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={messageId} className="text-sm text-stone">הודעה</label>
                  <textarea
                    id={messageId}
                    rows={4}
                    value={values.message}
                    onChange={(e) => update('message', e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? `${messageId}-err` : undefined}
                    className={`border bg-transparent px-3 py-2.5 text-charcoal placeholder:text-stone/50 focus:border-burgundy ${errors.message ? 'border-burgundy' : 'border-charcoal/20'}`}
                    placeholder="איך נוכל לעזור?"
                  />
                  {errors.message && <p id={`${messageId}-err`} className="text-xs text-burgundy">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="bg-charcoal px-7 py-3.5 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5"
                >
                  שליחת הודעה
                </button>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="overflow-hidden border border-charcoal/10 grayscale-[10%]">
              <iframe
                title="מיקום הסטודיו על מפה"
                src={`https://www.google.com/maps?q=${encodeURIComponent(businessInfo.mapQuery)}&output=embed`}
                className="h-64 w-full border-0 sm:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 border border-gold/20 bg-charcoal p-6">
              <div>
                <p className="text-xs tracking-widest text-gold">כתובת</p>
                <p className="mt-2 text-sm text-cream-dim">{businessInfo.address}</p>
              </div>
              <div>
                <p className="text-xs tracking-widest text-gold">טלפון</p>
                <p className="mt-2 text-sm text-cream-dim" dir="ltr">{businessInfo.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs tracking-widest text-gold">שעות פתיחה</p>
                <ul className="mt-2 space-y-1 text-sm text-cream-dim">
                  {businessInfo.hours.map((h) => (
                    <li key={h.day} className="flex justify-between border-b border-stone/10 py-1 last:border-none">
                      <span>{h.day}</span>
                      <span>{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
