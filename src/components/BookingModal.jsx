import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { siteConfig } from '../config/siteConfig'
import { TIME_SLOTS, nextDays, getBookedSlots } from '../data/times'

const { servicesData, staffData } = siteConfig

const STEP_COUNT = 4

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M12 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M13 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-stone" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 3.5c-.8 0-1.5.7-1.5 1.5 0 6.6 5.4 12 12 12 .8 0 1.5-.7 1.5-1.5v-2l-3-1-1.5 1.5a9 9 0 0 1-5-5L9 7 8 4 6 3.5z" strokeLinejoin="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-stone" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="6.5" r="3.25" />
      <path d="M3.5 17c1-3.5 4-5.5 6.5-5.5s5.5 2 6.5 5.5" strokeLinecap="round" />
    </svg>
  )
}

export default function BookingModal({ isOpen, onClose, initialServiceId, initialBarberId }) {
  const [step, setStep] = useState(0)
  const [serviceId, setServiceId] = useState(null)
  const [barberId, setBarberId] = useState(null)
  const [date, setDate] = useState(null)
  const [time, setTime] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(true)
  const [phoneError, setPhoneError] = useState('')
  const [done, setDone] = useState(false)

  const days = useMemo(() => nextDays(7), [])
  const bookedSlots = useMemo(() => getBookedSlots(date), [date])
  const nameId = useId()
  const phoneId = useId()
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    setServiceId(initialServiceId ?? null)
    setBarberId(initialBarberId ?? null)
    setDate(null)
    setTime(null)
    setName('')
    setPhone('')
    setPhoneError('')
    setDone(false)
    setStep(initialServiceId && initialBarberId ? 2 : initialServiceId ? 1 : 0)

    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, initialServiceId, initialBarberId])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const service = servicesData.find((s) => s.id === serviceId)
  const barber = staffData.find((b) => b.id === barberId)
  const dateInfo = days.find((d) => d.key === date)

  const canNext = [Boolean(serviceId), Boolean(barberId), Boolean(date && time), Boolean(name.trim() && phone.trim())]

  function goNext() {
    if (step === 3) {
      const digitsOnly = /^0\d{8,9}$/.test(phone.trim())
      if (!digitsOnly) {
        setPhoneError('מספר טלפון לא תקין — נסו לדוגמה 0501234567')
        return
      }
      setDone(true)
      return
    }
    if (canNext[step]) setStep((s) => Math.min(s + 1, STEP_COUNT - 1))
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function handleReset() {
    setStep(0)
    setServiceId(null)
    setBarberId(null)
    setDate(null)
    setTime(null)
    setName('')
    setPhone('')
    setPhoneError('')
    setDone(false)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/65 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-cream shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4">
          {!done && step > 0 ? (
            <button type="button" onClick={goBack} aria-label="חזרה" className="text-charcoal/70 transition-colors hover:text-burgundy">
              <BackIcon />
            </button>
          ) : (
            <span className="w-5" />
          )}

          <div className="text-center">
            <p id="booking-modal-title" className="font-display text-lg text-charcoal">
              {done ? 'התור נקבע' : 'קביעת תור'}
            </p>
            {service && !done && <p className="text-xs text-gold">{service.title}</p>}
          </div>

          <button type="button" onClick={onClose} aria-label="סגירה" className="text-charcoal/70 transition-colors hover:text-burgundy">
            <CloseIcon />
          </button>
        </div>

        {!done && (
          <div className="flex items-center justify-center gap-2 py-4" aria-hidden="true">
            {Array.from({ length: STEP_COUNT }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-5 bg-gold' : i < step ? 'w-1.5 bg-gold' : 'w-1.5 bg-charcoal/15'
                }`}
              />
            ))}
          </div>
        )}

        <div className="overflow-y-auto px-5 pb-5">
          {done ? (
            <ConfirmationView service={service} barber={barber} dateInfo={dateInfo} time={time} name={name} onReset={handleReset} onClose={onClose} />
          ) : (
            <>
              {step === 0 && (
                <ul role="radiogroup" aria-label="בחירת שירות" className="flex flex-col gap-2.5">
                  {servicesData.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={serviceId === s.id}
                        onClick={() => setServiceId(s.id)}
                        className={`flex w-full items-center justify-between border bg-white px-4 py-3 text-right transition-colors ${
                          serviceId === s.id ? 'border-gold ring-1 ring-gold' : 'border-charcoal/10 hover:border-gold/50'
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-medium text-charcoal">{s.title}</span>
                          <span className="text-xs text-stone">{s.duration}</span>
                        </span>
                        <span className="text-sm font-semibold text-gold">{s.price}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {step === 1 && (
                <ul role="radiogroup" aria-label="בחירת ספר/ית" className="flex flex-col gap-2.5">
                  {staffData.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={barberId === b.id}
                        onClick={() => setBarberId(b.id)}
                        className={`flex w-full items-center gap-4 border bg-white px-4 py-3 text-right transition-colors ${
                          barberId === b.id ? 'border-gold ring-1 ring-gold' : 'border-charcoal/10 hover:border-gold/50'
                        }`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-base text-gold">
                          {b.name.charAt(0)}
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-charcoal">{b.name}</span>
                          <span className="block text-xs text-stone">{b.role}</span>
                        </span>
                        <ChevronIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {step === 2 && (
                <div>
                  <div role="radiogroup" aria-label="בחירת תאריך" className="flex gap-2 overflow-x-auto pb-2">
                    {days.map((d) => (
                      <button
                        key={d.key}
                        type="button"
                        role="radio"
                        aria-checked={date === d.key}
                        onClick={() => {
                          setDate(d.key)
                          setTime(null)
                        }}
                        className={`flex shrink-0 flex-col items-center gap-1 border bg-white px-3.5 py-2.5 transition-colors ${
                          date === d.key ? 'border-gold bg-charcoal' : 'border-charcoal/10 hover:border-gold/50'
                        }`}
                      >
                        <span className={`text-xs ${date === d.key ? 'text-cream-dim' : 'text-stone'}`}>{d.isToday ? 'היום' : d.dayName}</span>
                        <span className={`font-display text-lg ${date === d.key ? 'text-cream' : 'text-charcoal'}`}>{d.dayNum}</span>
                        <span className={`text-[10px] ${date === d.key ? 'text-cream-dim' : 'text-stone'}`}>{d.monthName}</span>
                      </button>
                    ))}
                  </div>

                  <div role="radiogroup" aria-label="בחירת שעה" className="mt-5 grid grid-cols-4 gap-2">
                    {TIME_SLOTS.map((t) => {
                      const isBooked = bookedSlots.includes(t)
                      return (
                        <button
                          key={t}
                          type="button"
                          role="radio"
                          aria-checked={time === t}
                          disabled={!date || isBooked}
                          onClick={() => setTime(t)}
                          className={`relative border py-2 text-sm transition-colors disabled:cursor-not-allowed ${
                            isBooked
                              ? 'border-charcoal/5 bg-charcoal/5 text-stone/50 line-through'
                              : time === t
                                ? 'border-gold bg-gold text-charcoal font-semibold'
                                : 'border-charcoal/10 bg-white text-charcoal disabled:opacity-30 hover:border-gold/50'
                          }`}
                        >
                          {isBooked ? 'תפוס' : t}
                        </button>
                      )
                    })}
                  </div>
                  {!date && <p className="mt-3 text-xs text-stone">בחרו תאריך כדי לראות שעות פנויות</p>}
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={nameId} className="text-sm text-stone">שם מלא</label>
                    <div className="flex items-center gap-2 border border-charcoal/15 bg-white px-3 py-2.5 focus-within:border-gold">
                      <UserIcon />
                      <input
                        id={nameId}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ישראל ישראלי"
                        autoComplete="name"
                        className="w-full bg-transparent text-charcoal placeholder:text-stone/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={phoneId} className="text-sm text-stone">טלפון נייד</label>
                    <div className={`flex items-center gap-2 border bg-white px-3 py-2.5 focus-within:border-gold ${phoneError ? 'border-burgundy' : 'border-charcoal/15'}`}>
                      <PhoneIcon />
                      <input
                        id={phoneId}
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                          setPhoneError('')
                        }}
                        placeholder="0501234567"
                        autoComplete="tel"
                        aria-invalid={Boolean(phoneError)}
                        aria-describedby={phoneError ? `${phoneId}-error` : undefined}
                        className="w-full bg-transparent text-charcoal placeholder:text-stone/50 focus:outline-none"
                      />
                    </div>
                    {phoneError && <p id={`${phoneId}-error`} className="text-xs text-burgundy">{phoneError}</p>}
                  </div>

                  <label className="flex items-center gap-2.5 text-xs text-stone">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="h-4 w-4 accent-gold"
                    />
                    מעדכנים אותי במבצעים ותזכורות לתור
                  </label>

                  <div className="border border-charcoal/10 bg-white p-4 text-sm text-charcoal/80">
                    <p className="mb-1 font-semibold text-charcoal">סיכום ההזמנה</p>
                    <p>{service?.title} · {barber?.name}</p>
                    <p>{dateInfo ? `יום ${dateInfo.dayName}, ${dateInfo.dayNum} ל${dateInfo.monthName}` : ''} בשעה {time}</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={goNext}
                disabled={!canNext[step]}
                className="mt-6 w-full bg-gold py-3.5 text-sm font-bold text-charcoal transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {step === 3 ? 'אישור הזמנה' : 'המשך'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ConfirmationView({ service, barber, dateInfo, time, name, onReset, onClose }) {
  return (
    <div className="flex flex-col items-center py-4 text-center" role="status">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="var(--color-gold)" strokeWidth="2">
          <path d="M4 12.5L9.5 18L20 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-6 font-display text-2xl text-charcoal">מחכים לך, {name.split(' ')[0]}</h3>
      <p className="mt-3 text-sm text-stone">
        {service?.title} עם {barber?.name} — יום {dateInfo?.dayName}, {dateInfo?.dayNum} ל{dateInfo?.monthName} בשעה {time}.
      </p>
      <p className="mt-1 text-xs text-stone">זהו דמו — לא נשלח אישור אמיתי.</p>
      <div className="mt-8 flex w-full gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 border border-gold py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-charcoal"
        >
          תור נוסף
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-charcoal py-3 text-sm font-semibold text-cream transition-colors hover:opacity-90"
        >
          סגירה
        </button>
      </div>
    </div>
  )
}
