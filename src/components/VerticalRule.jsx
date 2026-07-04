/**
 * Thin vertical divider used as a rhythm device between/within sections,
 * replacing full-width colored bands.
 */
export default function VerticalRule({ tone = 'dark', className = '' }) {
  const color = tone === 'dark' ? 'bg-charcoal/15' : 'bg-cream/25'

  return <span aria-hidden="true" className={`hidden w-px self-stretch lg:block ${color} ${className}`} />
}
