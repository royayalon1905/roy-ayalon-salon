import { useEffect, useState } from 'react'

export default function FloatingButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href="#services"
      className={`fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-gold px-5 py-3.5 text-sm font-bold text-charcoal shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75">
        <rect x="3" y="4" width="14" height="13" rx="1.5" />
        <path d="M3 8h14M7 2.5v3M13 2.5v3" strokeLinecap="round" />
      </svg>
      קביעת תור
    </a>
  )
}
