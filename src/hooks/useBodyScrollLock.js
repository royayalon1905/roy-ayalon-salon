import { useEffect } from 'react'

/**
 * Locks background scroll while `active`. `overflow: hidden` alone doesn't
 * stop touch-scroll/rubber-banding on iOS Safari, so the body is pinned with
 * `position: fixed` at its current offset and released back to that same
 * scroll position on cleanup.
 */
export function useBodyScrollLock(active) {
  useEffect(() => {
    if (!active) return
    const { body } = document
    const scrollY = window.scrollY

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.overflow = 'hidden'

    return () => {
      body.style.position = ''
      body.style.top = ''
      body.style.left = ''
      body.style.right = ''
      body.style.overflow = ''
      window.scrollTo(0, scrollY)
    }
  }, [active])
}
