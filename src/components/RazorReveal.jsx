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
 *
 * CSP 9.9.2026: style-src בלי 'unsafe-inline' — הועבר מ-style={{}} דינמי
 * ל-classes קבועים (.razor-reveal / .razor-reveal--visible ב-index.css).
 * `delay` לא נעשה בו שימוש באף קריאה בקוד הקיים (תמיד 0) — ה-CSS קובע
 * 0ms קבוע. אם ירצו delay משתנה בעתיד, זה ידרוש פתרון אחר (לא inline style).
 */
export default function RazorReveal({ children, as: Tag = 'div', className = '' }) {
  const [ref, visible] = useReveal()

  return (
    <Tag ref={ref} className={className}>
      <span className={`razor-reveal${visible ? ' razor-reveal--visible' : ''}`}>{children}</span>
    </Tag>
  )
}
