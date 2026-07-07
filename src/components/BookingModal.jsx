import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { siteConfig, fmt } from '../config/siteConfig'
import { TIME_SLOTS, nextDays, getBookedSlots } from '../data/times'
import { isValidIsraeliPhone } from '../utils/validation'
import { useEscapeKey } from '../hooks/useEscapeKey'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import ChevronIcon from './ChevronIcon'

const { servicesData, staffData } = siteConfig
const { booking } = siteConfig.content

const STEP_COUNT = 4

function CloseIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 3.5c-.8 0-1.5.7-1.5 1.5 0 6.6 5.4 12 12 12 .8 0 1.5-.7 1.5-1.5v-2l-3-1-1.5 1.5a9 9 0 0 1-5-5L9 7 8 4 6 3.5z" strokeLinejoin="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5">
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
  const [consent, setConsent] = useState(false)
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
    setConsent(false)
    setPhoneError('')
    setDone(false)
    setStep(initialServiceId && initialBarberId ? 2 : initialServiceId ? 1 : 0)

    dialogRef.current?.focus()
  }, [isOpen, initialServiceId, initialBarberId])

  useBodyScrollLock(isOpen)
  useEscapeKey(isOpen, onClose)
  useFocusTrap(isOpen, dialogRef)

  if (!isOpen) return null

  const service = servicesData.find((s) => s.id === serviceId)
  const barber = staffData.find((b) => b.id === barberId)
  const dateInfo = days.find((d) => d.key === date)

  const canNext = [Boolean(serviceId), Boolean(barberId), Boolean(date && time), Boolean(name.trim() && phone.trim())]

  function goNext() {
    if (step === 3) {
      if (!isValidIsraeliPhone(phone)) {
        setPhoneError(booking.phoneError)
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
    setConsent(false)
    setPhoneError('')
    setDone(false)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/65 p-4 backdrop-blur-sm"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          {!done && step > 0 ? (
            <button type="button" onClick={goBack} aria-label={booking.backLabel} className="text-ink/70 transition-colors hover:text-accent">
              <ChevronIcon className="h-5 w-5" />
            </button>
          ) : (
            <span className="w-5" />
          )}

          <div className="text-center">
            <p id="booking-modal-title" className="font-display text-lg text-ink">
              {done ? booking.doneTitle : booking.title}
            </p>
            {service && !done && <p className="text-xs text-primary">{service.title}</p>}
          </div>

          <button type="button" onClick={onClose} aria-label={booking.closeLabel} className="text-ink/70 transition-colors hover:text-accent">
            <CloseIcon />
          </button>
        </div>

        {!done && (
          <div className="flex items-center justify-center gap-2 py-4" aria-hidden="true">
            {Array.from({ length: STEP_COUNT }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-5 bg-primary' : i < step ? 'w-1.5 bg-primary' : 'w-1.5 bg-ink/15'
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
                <ul role="radiogroup" aria-label={booking.serviceStepLabel} className="flex flex-col gap-2.5">
                  {servicesData.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={serviceId === s.id}
                        onClick={() => setServiceId(s.id)}
                        className={`flex w-full items-center justify-between border bg-white px-4 py-3 text-right transition-colors ${
                          serviceId === s.id ? 'border-primary ring-1 ring-primary' : 'border-ink/10 hover:border-primary/50'
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-medium text-ink">{s.title}</span>
                          <span className="text-xs text-muted">{s.duration}</span>
                        </span>
                        <span className="text-sm font-semibold text-primary">{s.price}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {step === 1 && (
                <ul role="radiogroup" aria-label={booking.staffStepLabel} className="flex flex-col gap-2.5">
                  {staffData.map((b) => (
                    <li key={b.id}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={barberId === b.id}
                        onClick={() => setBarberId(b.id)}
                        className={`flex w-full items-center gap-4 border bg-white px-4 py-3 text-right transition-colors ${
                          barberId === b.id ? 'border-primary ring-1 ring-primary' : 'border-ink/10 hover:border-primary/50'
                        }`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-display text-base text-primary">
                          {b.name.charAt(0)}
                        </span>
                        <span className="flex-1">
                          <span className="block text-sm font-medium text-ink">{b.name}</span>
                          <span className="block text-xs text-muted">{b.role}</span>
                        </span>
                        <ChevronIcon className="h-4 w-4 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {step === 2 && (
                <div>
                  <div role="radiogroup" aria-label={booking.dateStepLabel} className="flex gap-2 overflow-x-auto pb-2">
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
                          date === d.key ? 'border-primary bg-ink' : 'border-ink/10 hover:border-primary/50'
                        }`}
                      >
                        <span className={`text-xs ${date === d.key ? 'text-surface-dim' : 'text-muted'}`}>{d.isToday ? booking.todayLabel : d.dayName}</span>
                        <span className={`font-display text-lg ${date === d.key ? 'text-surface' : 'text-ink'}`}>{d.dayNum}</span>
                        <span className={`text-[10px] ${date === d.key ? 'text-surface-dim' : 'text-muted'}`}>{d.monthName}</span>
                      </button>
                    ))}
                  </div>

                  <div role="radiogroup" aria-label={booking.timeStepLabel} className="mt-5 grid grid-cols-4 gap-2">
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
                              ? 'border-ink/5 bg-ink/5 text-muted/50 line-through'
                              : time === t
                                ? 'border-primary bg-primary text-ink font-semibold'
                                : 'border-ink/10 bg-white text-ink disabled:opacity-30 hover:border-primary/50'
                          }`}
                        >
                          {isBooked ? booking.bookedLabel : t}
                        </button>
                      )
                    })}
                  </div>
                  {!date && <p className="mt-3 text-xs text-muted">{booking.pickDateHint}</p>}
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={nameId} className="text-sm text-muted">{booking.nameLabel}</label>
                    <div className="flex items-center gap-2 border border-ink/15 bg-white px-3 py-2.5 focus-within:border-primary">
                      <UserIcon />
                      <input
                        id={nameId}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={booking.namePlaceholder}
                        autoComplete="name"
                        className="w-full bg-transparent text-ink placeholder:text-muted/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={phoneId} className="text-sm text-muted">{booking.phoneLabel}</label>
                    <div className={`flex items-center gap-2 border bg-white px-3 py-2.5 focus-within:border-primary ${phoneError ? 'border-accent' : 'border-ink/15'}`}>
                      <PhoneIcon />
                      <input
                        id={phoneId}
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                          setPhoneError('')
                        }}
                        placeholder={booking.phonePlaceholder}
                        autoComplete="tel"
                        aria-invalid={Boolean(phoneError)}
                        aria-describedby={phoneError ? `${phoneId}-error` : undefined}
                        className="w-full bg-transparent text-ink placeholder:text-muted/50 focus:outline-none"
                      />
                    </div>
                    {phoneError && <p id={`${phoneId}-error`} className="text-xs text-accent">{phoneError}</p>}
                  </div>

                  <label className="flex items-center gap-2.5 text-xs text-muted">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                    {booking.consentLabel}
                  </label>

                  <div className="border border-ink/10 bg-white p-4 text-sm text-ink/80">
                    <p className="mb-1 font-semibold text-ink">{booking.summaryTitle}</p>
                    <p>{service?.title} · {barber?.name}</p>
                    <p>{dateInfo && time ? fmt(booking.dateTimeSummary, { day: dateInfo.dayName, date: dateInfo.dayNum, month: dateInfo.monthName, time }) : ''}</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={goNext}
                disabled={!canNext[step]}
                className="mt-6 w-full bg-primary py-3.5 text-sm font-bold text-ink transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
              >
                {step === 3 ? booking.confirmLabel : booking.nextLabel}
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
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary">
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="var(--color-primary)" strokeWidth="2">
          <path d="M4 12.5L9.5 18L20 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="mt-6 font-display text-2xl text-ink">{fmt(booking.confirmation.greeting, { name: name.split(' ')[0] })}</h3>
      <p className="mt-3 text-sm text-muted">
        {fmt(booking.confirmation.summary, { service: service?.title, barber: barber?.name, day: dateInfo?.dayName, date: dateInfo?.dayNum, month: dateInfo?.monthName, time })}
      </p>
      <p className="mt-1 text-xs text-muted">{booking.confirmation.demoNote}</p>
      <div className="mt-8 flex w-full gap-3">
        <button
          type="button"
          onClick={onReset}
          className="flex-1 border border-primary py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-ink"
        >
          {booking.confirmation.anotherLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-ink py-3 text-sm font-semibold text-surface transition-colors hover:opacity-90"
        >
          {booking.confirmation.closeLabel}
        </button>
      </div>
    </div>
  )
}
