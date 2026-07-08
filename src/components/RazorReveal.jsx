import { useReveal } from '../hooks/useReveal'

/**
 * Wraps content and reveals it with a diagonal razor-cut wipe, echoing the
 * site's signature motif instead of a generic fade/slide.
 *
 * The reveal styling (clip-path/opacity/transform) lives on an inner span,
 * not on the observed Tag itself: in some browsers, IntersectionObserver
 * reports zero intersection for an element that's already clipped to zero
 * area by its own inline clip-path, which would permanently deadlock the
 * reveal (never intersecting -> never revealed -> never intersecting).
 */
export default function RazorReveal({ children, as: Tag = 'div', delay = 0, className = '' }) {
  const [ref, visible] = useReveal()

  return (
    <Tag ref={ref} className={className}>
      <span
        style={{
          display: 'block',
          clipPath: visible ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' : 'polygon(0 0, 0 0, 0 100%, 0 100%)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(0)' : 'translateX(-14px)',
          transition: `clip-path 750ms cubic-bezier(.65,0,.35,1) ${delay}ms, opacity 600ms ease ${delay}ms, transform 750ms cubic-bezier(.65,0,.35,1) ${delay}ms`,
        }}
      >
        {children}
      </span>
    </Tag>
  )
}
