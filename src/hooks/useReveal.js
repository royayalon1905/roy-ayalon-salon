import { useEffect, useRef, useState } from 'react'

export function useReveal(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(node)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px', ...options }
    )

    observer.observe(node)

    // Safety net: if the observer never reports an intersection (browser
    // quirk, unusual layout), don't leave the content permanently hidden.
    const fallback = setTimeout(() => setVisible(true), 1500)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return [ref, visible]
}
