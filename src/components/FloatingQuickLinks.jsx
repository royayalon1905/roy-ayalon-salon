import { useRef, useState } from 'react'
import { siteConfig } from '../config/siteConfig'
import { useAccessibilityPrefs } from '../hooks/useAccessibilityPrefs'
import { useEscapeKey } from '../hooks/useEscapeKey'
import { useFocusTrap } from '../hooks/useFocusTrap'

// עודכן 10.8.2026 — עכשיו משתמש ב-businessInfo.whatsappPhone (מספר נייד, פורמט 05X-XXX-XXXX)
// במקום businessInfo.phone (הקווי) — קודם הכפתור ניסה לפתוח וואטסאפ למספר קווי שלא יכול לקבל הודעות.
// עדיין מספר דמו/placeholder — להחליף למספר אמיתי לפני פריסה ללקוח אמיתי.
function toWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `972${digits.slice(1)}` : digits
}

function Toggle({ id, label, checked, onChange }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-3 py-2 text-sm text-ink">
      <span>{label}</span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-ink/20 transition-colors peer-checked:bg-primary" aria-hidden="true" />
        <span
          className={`absolute h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'right-1' : 'right-6'}`}
          aria-hidden="true"
        />
      </span>
    </label>
  )
}

// חדש 10.8.2026 — ווידג'ט נגישות אמיתי (במקום כפתור שהיה רק לינק סטטי להצהרת נגישות).
// מפעיל שינויים אמיתיים בעמוד: גודל טקסט, ניגודיות, גווני אפור, עצירת אנימציות,
// הדגשת קישורים — כל אלה מיושמים בפועל דרך useAccessibilityPrefs + class-ים ב-index.css.
// תוקן 10.8.2026 — באג ניראות אמיתי במובייל: הכפתור הצף "קביעת תור" (FloatingButton)
// וצרור הכפתורים הזה (וואטסאפ+נגישות) היו שניהם עגונים לאותה פינה שמאלית-תחתונה, זה
// מעל זה, וקטעו טקסט/כפתורים בכרטיסים (שירותים, צוות, שאלות נפוצות) — כי במסך צר אין
// שוליים ריקים בפינה כמו בדסקטופ. הפתרון: ה-CTA הצף (FloatingButton) הוסתר במובייל
// (יש כבר כפתור בנאבבר, ב-Hero, ובסקשן קביעת התור המוטמע — הוא היה מיותר שם ממילא).
// הצרור הזה הוקטן והוזז למקום שהתפנה למטה, כדי לצמצם את שטח החפיפה עם התוכן.
export default function FloatingQuickLinks() {
  const { businessInfo, content } = siteConfig
  const { floatingQuickLinks: labels, legal, accessibilityWidget: w } = content
  const waHref = `https://wa.me/${toWhatsAppNumber(businessInfo.whatsappPhone)}?text=${encodeURIComponent(labels.whatsappMessage)}`

  const [open, setOpen] = useState(false)
  const { prefs, toggle, cycleFontScale, reset } = useAccessibilityPrefs()
  const panelRef = useRef(null)

  useEscapeKey(open, () => setOpen(false))
  useFocusTrap(open, panelRef)

  return (
    <div
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-[max(1.25rem,env(safe-area-inset-left))] z-40 flex flex-col items-start gap-2 sm:bottom-[calc(6rem+env(safe-area-inset-bottom))] sm:left-[max(1.5rem,env(safe-area-inset-left))] sm:gap-3"
      role="group"
      aria-label={labels.groupLabel}
    >
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={w.title}
          className="order-first w-[min(18rem,calc(100vw-2.5rem))] border border-ink/10 bg-white p-5 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-ink/10 pb-3">
            <h2 className="font-display text-lg text-ink">{w.title}</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={w.closeLabel}
              className="flex h-11 w-11 items-center justify-center text-ink hover:text-accent"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 divide-y divide-ink/5">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-ink">{w.fontSizeLabel}</span>
              <button
                type="button"
                onClick={cycleFontScale}
                className="border border-ink/20 px-3 py-1 text-xs font-semibold text-ink hover:border-primary"
              >
                {w.fontSizeButton} {prefs.fontScale > 0 ? `(${prefs.fontScale === 1 ? '1' : '2'})` : ''}
              </button>
            </div>
            <Toggle id="a11y-contrast" label={w.contrastLabel} checked={prefs.highContrast} onChange={() => toggle('highContrast')} />
            <Toggle id="a11y-grayscale" label={w.grayscaleLabel} checked={prefs.grayscale} onChange={() => toggle('grayscale')} />
            <Toggle
              id="a11y-stop-animations"
              label={w.stopAnimationsLabel}
              checked={prefs.stopAnimations}
              onChange={() => toggle('stopAnimations')}
            />
            <Toggle
              id="a11y-highlight-links"
              label={w.highlightLinksLabel}
              checked={prefs.highlightLinks}
              onChange={() => toggle('highlightLinks')}
            />
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3">
            <button type="button" onClick={reset} className="text-xs font-semibold text-muted hover:text-accent">
              {w.resetLabel}
            </button>
            <a href={legal.accessibility.path} className="text-xs font-semibold text-primary hover:underline">
              {w.statementLinkLabel}
            </a>
          </div>
        </div>
      )}

      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.whatsappLabel}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:h-14 sm:w-14"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 fill-white sm:h-7 sm:w-7">
          <path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.23.62 4.36 1.79 6.22L4 29l7.94-1.74a11.94 11.94 0 004.07.71h.01c6.63 0 12.01-5.38 12.01-12.01C28.03 8.38 22.65 3 16.01 3zm0 21.98h-.01a9.9 9.9 0 01-5.06-1.39l-.36-.21-3.77.98 1.01-3.68-.24-.38a9.94 9.94 0 01-1.53-5.3c0-5.5 4.48-9.98 9.98-9.98 2.67 0 5.17 1.04 7.06 2.93a9.9 9.9 0 012.92 7.06c0 5.5-4.48 9.97-9.98 9.97zm5.47-7.47c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
        </svg>
      </a>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={labels.accessibilityLabel}
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0057D8] text-xl leading-none text-white shadow-xl transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100 sm:h-14 sm:w-14 sm:text-3xl"
      >
        <span aria-hidden="true">♿</span>
      </button>
    </div>
  )
}
