import { siteConfig } from '../config/siteConfig'

// TODO דמו: businessInfo.phone הוא מספר קווי פיקטיבי (03-...), לא מסוגל לקבל הודעות וואטסאפ בפועל.
// בפריסה אמיתית ללקוח - להחליף למספר נייד אמיתי לפני עלייה לאוויר.
function toWhatsAppNumber(phone) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `972${digits.slice(1)}` : digits
}

export default function FloatingQuickLinks() {
  const { businessInfo, content } = siteConfig
  const { floatingQuickLinks: labels, legal } = content
  const waHref = `https://wa.me/${toWhatsAppNumber(businessInfo.phone)}?text=${encodeURIComponent(labels.whatsappMessage)}`

  return (
    <div
      className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-[max(1.5rem,env(safe-area-inset-left))] z-40 flex flex-col gap-3"
      role="group"
      aria-label={labels.groupLabel}
    >
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={labels.whatsappLabel}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-xl transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 fill-white">
          <path d="M16.01 3C9.38 3 4 8.38 4 15.01c0 2.23.62 4.36 1.79 6.22L4 29l7.94-1.74a11.94 11.94 0 004.07.71h.01c6.63 0 12.01-5.38 12.01-12.01C28.03 8.38 22.65 3 16.01 3zm0 21.98h-.01a9.9 9.9 0 01-5.06-1.39l-.36-.21-3.77.98 1.01-3.68-.24-.38a9.94 9.94 0 01-1.53-5.3c0-5.5 4.48-9.98 9.98-9.98 2.67 0 5.17 1.04 7.06 2.93a9.9 9.9 0 012.92 7.06c0 5.5-4.48 9.97-9.98 9.97zm5.47-7.47c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.47 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
        </svg>
      </a>
      <a
        href={legal.accessibility.path}
        aria-label={labels.accessibilityLabel}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0057D8] text-3xl leading-none text-white shadow-xl transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <span aria-hidden="true">♿</span>
      </a>
    </div>
  )
}
