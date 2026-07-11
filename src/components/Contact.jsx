import { useId, useState } from 'react'
import RazorReveal from './RazorReveal'
import { siteConfig } from '../config/siteConfig'
import { isValidEmail, isValidIsraeliPhone } from '../utils/validation'

const { businessInfo, content } = siteConfig
const { contact } = content
const { form, info } = contact

function AccessibilityIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="3.5" r="1.5" />
      <path
        d="M10 6.5v4l-3.5 5M10 10.5l3.5 5M6 9h6.5M10 10.5V6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4.5 14.5a5.5 5.5 0 0 1 4-9" strokeLinecap="round" />
    </svg>
  )
}

export default function Contact() {
  const [values, setValues] = useState({ name: '', contact: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const { accessibility } = businessInfo
  const accessibilitySegments = [accessibility.wheelchairAccess ? info.accessibilityWheelchairYes : info.accessibilityWheelchairNo]
  if (accessibility.accessibleParking) accessibilitySegments.push(info.accessibilityParkingYes)
  const accessibilitySentence = `${accessibilitySegments.join(', ')}.`

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
    if (!values.name.trim()) nextErrors.name = form.nameError
    if (!isValidIsraeliPhone(values.contact) && !isValidEmail(values.contact)) nextErrors.contact = form.contactError
    if (!values.message.trim()) nextErrors.message = form.messageError

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setSent(true)
  }

  return (
    <section id="contact" className="bg-surface px-6 py-24 md:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <span className="text-xs font-semibold tracking-[0.3em] text-accent">{contact.eyebrow}</span>
        <RazorReveal as="h2" className="mt-4 overflow-hidden font-display text-4xl text-ink sm:text-5xl">
          {contact.title}
        </RazorReveal>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center border border-primary/30 bg-ink p-10 text-center" role="status">
                <p className="font-display text-2xl text-surface">{form.sentTitle}</p>
                <p className="mt-2 text-muted-on-dark">{form.sentBody}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSent(false)
                    setValues({ name: '', contact: '', message: '' })
                  }}
                  className="mt-6 text-sm font-semibold text-primary hover:underline"
                >
                  {form.sendAnotherLabel}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={nameId} className="text-sm text-muted">{form.nameLabel}</label>
                  <input
                    id={nameId}
                    type="text"
                    value={values.name}
                    onChange={(e) => update('name', e.target.value)}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${nameId}-err` : undefined}
                    className={`border bg-transparent px-3 py-2.5 text-ink placeholder:text-muted/50 focus:border-accent ${errors.name ? 'border-accent' : 'border-ink/20'}`}
                    placeholder={form.namePlaceholder}
                  />
                  {errors.name && <p id={`${nameId}-err`} className="text-xs text-accent">{errors.name}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={contactId} className="text-sm text-muted">{form.contactLabel}</label>
                  <input
                    id={contactId}
                    type="text"
                    value={values.contact}
                    onChange={(e) => update('contact', e.target.value)}
                    aria-invalid={Boolean(errors.contact)}
                    aria-describedby={errors.contact ? `${contactId}-err` : undefined}
                    className={`border bg-transparent px-3 py-2.5 text-ink placeholder:text-muted/50 focus:border-accent ${errors.contact ? 'border-accent' : 'border-ink/20'}`}
                    placeholder={form.contactPlaceholder}
                  />
                  {errors.contact && <p id={`${contactId}-err`} className="text-xs text-accent">{errors.contact}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={messageId} className="text-sm text-muted">{form.messageLabel}</label>
                  <textarea
                    id={messageId}
                    rows={4}
                    value={values.message}
                    onChange={(e) => update('message', e.target.value)}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? `${messageId}-err` : undefined}
                    className={`border bg-transparent px-3 py-2.5 text-ink placeholder:text-muted/50 focus:border-accent ${errors.message ? 'border-accent' : 'border-ink/20'}`}
                    placeholder={form.messagePlaceholder}
                  />
                  {errors.message && <p id={`${messageId}-err`} className="text-xs text-accent">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  className="bg-ink px-7 py-3.5 text-sm font-bold text-surface transition-transform hover:-translate-y-0.5"
                >
                  {form.submitLabel}
                </button>
              </form>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="overflow-hidden border border-ink/10 grayscale-[10%]">
              <iframe
                title={info.mapTitle}
                src={`https://www.google.com/maps?q=${encodeURIComponent(businessInfo.mapQuery)}&output=embed`}
                className="h-64 w-full border-0 sm:h-72"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="grid grid-cols-2 gap-6 border border-primary/20 bg-ink p-6">
              <div>
                <p className="text-xs tracking-widest text-primary">{info.addressLabel}</p>
                <p className="mt-2 text-sm text-surface-dim">{businessInfo.address}</p>
              </div>
              <div>
                <p className="text-xs tracking-widest text-primary">{info.phoneLabel}</p>
                <p className="mt-2 text-sm text-surface-dim" dir="ltr">{businessInfo.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs tracking-widest text-primary">{info.hoursLabel}</p>
                <ul className="mt-2 space-y-1 text-sm text-surface-dim">
                  {businessInfo.hours.map((h) => (
                    <li key={h.day} className="flex justify-between border-b border-muted/10 py-1 last:border-none">
                      <span>{h.day}</span>
                      <span>{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 flex items-start gap-2.5 border-t border-primary/20 pt-4">
                <AccessibilityIcon />
                <div>
                  <p className="text-xs tracking-widest text-primary">{info.accessibilityLabel}</p>
                  <p className="mt-1.5 text-sm text-surface-dim">{accessibilitySentence}</p>
                  {accessibility.notes && <p className="mt-1 text-sm text-surface-dim">{accessibility.notes}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
