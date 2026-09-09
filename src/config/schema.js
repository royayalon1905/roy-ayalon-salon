// חדש 9.9.2026 (סבב QA) — Schema.org JSON-LD (HairSalon + FAQPage) שנבנה בזמן ריצה מתוך
// siteConfig, כדי שכל שכפול white-label יקבל structured data נכון בלי לערוך index.html.
// מוזרק ל-<head> מ-main.jsx. AggregateRating/Review לא נכללים בכוונה — אין דירוגים אמיתיים
// (ראו local-business-schema: לא ממציאים social proof, גם לא בדמו).
import { siteConfig } from './siteConfig'

const DAY_MAP = {
  'ראשון': 'Sunday', 'שני': 'Monday', 'שלישי': 'Tuesday', 'רביעי': 'Wednesday',
  'חמישי': 'Thursday', 'שישי': 'Friday', 'שבת': 'Saturday',
}
const DAY_ORDER = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

// "ראשון – חמישי" → [Sunday..Thursday]; "שישי" → [Friday]; "סגור" → מדולג.
function parseHours(hours) {
  const out = []
  for (const h of hours) {
    const time = h.time.replace(/\s/g, '')
    const m = time.match(/^(\d{1,2}:\d{2})[–-](\d{1,2}:\d{2})$/)
    if (!m) continue
    const parts = h.day.split(/\s*[–-]\s*/)
    let days
    if (parts.length === 2 && DAY_MAP[parts[0]] && DAY_MAP[parts[1]]) {
      const a = DAY_ORDER.indexOf(parts[0]), b = DAY_ORDER.indexOf(parts[1])
      days = DAY_ORDER.slice(a, b + 1).map((d) => DAY_MAP[d])
    } else {
      days = parts.map((d) => DAY_MAP[d]).filter(Boolean)
    }
    if (!days.length) continue
    out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens: m[1].padStart(5, '0'), closes: m[2].padStart(5, '0') })
  }
  return out
}

// "03-555-1234" → "+972-3-555-1234"
function intlPhone(phone) {
  const digits = phone.replace(/\D/g, '')
  if (!digits.startsWith('0')) return phone
  const rest = digits.slice(1)
  const area = rest.length === 9 ? rest.slice(0, 2) : rest.slice(0, 1)
  const local = rest.slice(area.length)
  return `+972-${area}-${local.slice(0, 3)}-${local.slice(3)}`
}

// "מ-250₪" → 250 ; "80₪" → 80
function priceNumber(price) {
  const m = String(price).match(/\d+/)
  return m ? m[0] : undefined
}

export function buildSchema(config = siteConfig) {
  const { businessInfo: b, servicesData, content } = config
  const url = b.siteUrl ? b.siteUrl.replace(/\/?$/, '/') : undefined
  const [street, city] = b.address.split(',').map((s) => s.trim())

  const business = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    ...(url && { '@id': `${url}#business`, url }),
    name: b.shortName,
    description: b.footerTagline,
    ...(config.theme?.heroImage && { image: config.theme.heroImage }),
    telephone: intlPhone(b.phone),
    priceRange: '₪₪',
    currenciesAccepted: 'ILS',
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: city || b.city,
      addressCountry: 'IL',
    },
    ...(b.foundedYear && { foundingDate: String(b.foundedYear) }),
    openingHoursSpecification: parseHours(b.hours),
    ...(b.accessibility?.wheelchairAccess && { amenityFeature: [{ '@type': 'LocationFeatureSpecification', name: 'גישה לכיסא גלגלים', value: true }] }),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: content.services.title,
      itemListElement: servicesData.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.title, description: s.desc },
        ...(priceNumber(s.price) && { price: priceNumber(s.price), priceCurrency: 'ILS' }),
      })),
    },
  }
  const sameAs = (b.socials || []).map((s) => s.href).filter((h) => /^https?:/.test(h))
  if (sameAs.length) business.sameAs = sameAs

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  }
  return [business, faq]
}

export function injectSchema(config = siteConfig) {
  if (typeof document === 'undefined') return
  for (const block of buildSchema(config)) {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.textContent = JSON.stringify(block)
    document.head.appendChild(el)
  }
}
