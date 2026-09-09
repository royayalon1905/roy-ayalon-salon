#!/usr/bin/env node
/**
 * סקריפט קליטת לקוח חדש — DRY-RUN בלבד (9.9.2026).
 *
 * מקבל קובץ JSON עם פרטי הלקוח ומדפיס:
 *   1. טיוטת רשומת mt_clients (+ mt_services, mt_staff) כ-SQL — לא מריץ שום דבר מול Supabase.
 *   2. קטע siteConfig.js (businessInfo / servicesData / staffData) להדבקה בשכפול ה-white-label.
 *   3. רשימת בדיקות ידניות לפני ואחרי ההפעלה.
 *
 * שימוש:
 *   node scripts/onboard-client.mjs path/to/client.json            # dry-run (ברירת מחדל, היחיד שקיים)
 *   node scripts/onboard-client.mjs --example > client.example.json # תבנית קלט
 *
 * מקור האמת לסכימה: list_tables (Supabase, 9.9.2026) — mt_clients:
 *   business_name, slug (unique), timezone (ברירת מחדל Asia/Jerusalem), tier (basic|mid|top),
 *   status (trial|active|paused|pending_instance), settings jsonb, integration_config jsonb
 *   (מזהים לא-סודיים בלבד! טוקנים לעולם לא כאן), owner_name, owner_email, owner_phone,
 *   allowed_origin (scheme://host, בלי path — NULL = get_busy_slots לא מחזיר כלום).
 * הרשומות הקיימות משתמשות ב-integration_config: { block_slots_pin, google_review_link }.
 *
 * הערה: המסמך claude/רשימת-פרטים-לקליטת-לקוח-חדש-25-8-2026.md לא נמצא בריפו בזמן הכתיבה —
 * השדות למטה נגזרו מהסכימה החיה ומ-siteConfig.js. אם המסמך קיים במקום אחר, להשוות ולעדכן.
 */

import { readFileSync } from 'node:fs'
import { randomInt } from 'node:crypto'

const EXAMPLE = {
  business_name: 'מספרת דוגמה',
  slug: 'salon-example',
  tier: 'basic',
  status: 'trial',
  timezone: 'Asia/Jerusalem',
  site_url: 'https://salon-example.netlify.app',
  owner: { name: 'ישראל ישראלי', email: 'owner@example.co.il', phone: '050-000-0000' },
  business: {
    category: 'עיצוב שיער',
    city: 'תל אביב',
    phone: '03-000-0000',
    whatsapp_phone: '050-000-0000',
    address: 'רחוב הדוגמה 1, תל אביב',
    map_query: 'Example St 1 Tel Aviv',
    founded_year: 2015,
    hours: [
      { day: 'ראשון – חמישי', time: '09:00 – 19:00' },
      { day: 'שישי', time: '08:30 – 14:00' },
      { day: 'שבת', time: 'סגור' },
    ],
    wheelchair_access: true,
    accessible_parking: false,
    google_review_link: 'https://g.page/r/XXXX/review',
  },
  services: [{ name: 'תספורת גברים', price: 80, duration_minutes: 30 }],
  staff: [{ name: 'ישראל ישראלי' }],
}

const TIERS = ['basic', 'mid', 'top']
const STATUSES = ['trial', 'active', 'paused', 'pending_instance']
const STAFF_LIMIT = { basic: 1, mid: 2, top: 5 } // לפי דף המחירים: בסיסי 1, מתקדם 2, VIP עד 5

function q(s) {
  return `'${String(s).replace(/'/g, "''")}'`
}
function js(s) {
  return `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
}

function validate(c) {
  const errors = []
  if (!c.business_name) errors.push('business_name חסר')
  if (!/^[a-z0-9-]{3,40}$/.test(c.slug || '')) errors.push('slug חייב להיות a-z0-9- (3–40 תווים)')
  if (!TIERS.includes(c.tier)) errors.push(`tier חייב להיות אחד מ: ${TIERS.join('|')}`)
  if (!STATUSES.includes(c.status)) errors.push(`status חייב להיות אחד מ: ${STATUSES.join('|')}`)
  if (!/^https:\/\/[^/]+$/.test(c.site_url || '')) errors.push('site_url חייב להיות https://host בלי path (משמש כ-allowed_origin)')
  if (!c.business?.phone) errors.push('business.phone חסר')
  if (!c.business?.whatsapp_phone) errors.push('business.whatsapp_phone חסר')
  if (!c.business?.address) errors.push('business.address חסר')
  if (!Array.isArray(c.services) || !c.services.length) errors.push('services ריק')
  if (!Array.isArray(c.staff) || !c.staff.length) errors.push('staff ריק')
  if (Array.isArray(c.staff) && c.staff.length > STAFF_LIMIT[c.tier]) errors.push(`מסלול ${c.tier} מוגבל ל-${STAFF_LIMIT[c.tier]} אנשי צוות (התקבלו ${c.staff.length}) — יש trigger בשרת שיחסום`)
  for (const s of c.services || []) {
    if (!s.name || !(s.price >= 0) || !(s.duration_minutes > 0)) errors.push(`שירות לא תקין: ${JSON.stringify(s)}`)
  }
  for (const k of ['token', 'api_key', 'apiKey', 'secret']) {
    if (JSON.stringify(c).toLowerCase().includes(`"${k.toLowerCase()}"`)) errors.push(`נמצא שדה "${k}" בקלט — סודות לא נכנסים ל-mt_clients בשום מצב`)
  }
  return errors
}

function sqlDraft(c) {
  const pin = String(randomInt(1000, 9999))
  const integration = { block_slots_pin: pin, google_review_link: c.business.google_review_link || 'https://g.page/r/PLACEHOLDER/review' }
  const lines = []
  lines.push('-- DRY-RUN: לא הורץ. להריץ רק דרך apply_migration אחרי אישור מפורש.')
  lines.push('-- (block_slots_pin נוצר אקראית כאן — להעביר לבעל העסק בערוץ מאובטח, לא בצ׳אט)')
  lines.push('begin;')
  lines.push(`insert into public.mt_clients (business_name, slug, tier, status, timezone, allowed_origin, owner_name, owner_email, owner_phone, settings, integration_config)`)
  lines.push(`values (${q(c.business_name)}, ${q(c.slug)}, ${q(c.tier)}, ${q(c.status)}, ${q(c.timezone || 'Asia/Jerusalem')}, ${q(c.site_url)}, ${c.owner?.name ? q(c.owner.name) : 'null'}, ${c.owner?.email ? q(c.owner.email) : 'null'}, ${c.owner?.phone ? q(c.owner.phone) : 'null'}, '{}'::jsonb, ${q(JSON.stringify(integration))}::jsonb)`)
  lines.push(`returning id;  -- => :client_id`)
  lines.push('')
  lines.push('insert into public.mt_services (client_id, name, price, duration_minutes, active) values')
  lines.push(c.services.map((s) => `  (:client_id, ${q(s.name)}, ${Number(s.price)}, ${Number(s.duration_minutes)}, true)`).join(',\n') + ';')
  lines.push('')
  lines.push('insert into public.mt_staff (client_id, name, active) values')
  lines.push(c.staff.map((s) => `  (:client_id, ${q(s.name)}, true)`).join(',\n') + ';')
  lines.push('-- mt_usage_counters: נוצר לבד בשימוש הראשון (period_month, monthly_limit=300)')
  lines.push('rollback;  -- DRY-RUN')
  return { sql: lines.join('\n'), pin }
}

function siteConfigDraft(c) {
  const b = c.business
  const svc = c.services.map((s, i) => `    { id: 'service-${i + 1}', title: ${js(s.name)}, price: '${Number(s.price)}₪', duration: '${Number(s.duration_minutes)} דק׳', desc: '' },`).join('\n')
  const staff = c.staff.map((s, i) => `    { id: 'staff-${i + 1}', name: ${js(s.name)}, role: '' },`).join('\n')
  const hours = (b.hours || []).map((h) => `      { day: ${js(h.day)}, time: ${js(h.time)} },`).join('\n')
  return `// קטע להדבקה ב-src/config/siteConfig.js של השכפול (${c.slug})
  slug: ${js(c.slug)},
  businessInfo: {
    siteUrl: ${js(c.site_url)},
    shortName: ${js(c.business_name)},
    category: ${js(b.category || 'עיצוב שיער')},
    city: ${js(b.city || '')},
    phone: ${js(b.phone)},
    whatsappPhone: ${js(b.whatsapp_phone)},
    address: ${js(b.address)},
    mapQuery: ${js(b.map_query || b.address)},
    foundedYear: ${Number(b.founded_year) || 'null'},
    hours: [
${hours}
    ],
    accessibility: { wheelchairAccess: ${Boolean(b.wheelchair_access)}, accessibleParking: ${Boolean(b.accessible_parking)}, notes: '' },
    // heroHeadline / heroSubtitle / footerTagline — קופי, נכתב ומאושר בנפרד
  },
  servicesData: [
${svc}
  ],
  staffData: [
${staff}
  ],`
}

function checklist(c) {
  return [
    `[ ] slug "${c.slug}" לא קיים כבר ב-mt_clients (select slug from mt_clients)`,
    `[ ] allowed_origin = "${c.site_url}" זהה בדיוק לדומיין שבו האתר יוגש (בלי / בסוף, בלי www אם אין)`,
    `[ ] מספר אנשי צוות (${c.staff.length}) ≤ מגבלת המסלול ${c.tier} (${STAFF_LIMIT[c.tier]})`,
    '[ ] שכפול: robocopy /XD node_modules .git dist .netlify → npm install → npm run build',
    '[ ] .env בשכפול: VITE_SUPABASE_URL/ANON_KEY + webhooks — ורק אחרי כיבוי SIMULATION_MODE ב-BookingModal.jsx ו-times.js',
    '[ ] MT_CLIENT_ID ב-src/data/times.js = ה-id שחזר מה-INSERT (כרגע hardcoded לסטודיו עלה!)',
    '[ ] index.html: title, description, theme-color, canonical/og:url — ידני, לא מגיע מ-siteConfig',
    '[ ] block_slots_pin נמסר לבעל העסק בערוץ מאובטח; public/block-slot.html נבדק עם ה-PIN',
    '[ ] google_review_link אמיתי (לא PLACEHOLDER) — הבקשה האוטומטית לביקורת תשלח אותו',
    '[ ] owner_email/owner_phone מולאו (יעד לדוחות; NULL = לא נשלח כלום)',
    '[ ] אין טוקנים ב-integration_config — רק ב-credential store של n8n',
    '[ ] הצהרת נגישות + מדיניות פרטיות בשכפול: שם עסק, טלפון, רכז/ת נגישות (שם אדם + דוא"ל ללקוח אמיתי)',
    '[ ] תמונות אמיתיות במקום גרדיאנטים: Hero, גלריה (6 זוגות), צוות',
    '[ ] תור בדיקה אמיתי מהאתר החי → מגיע ל-mt_appointments עם client_id הנכון → הודעה לבעל העסק',
    '[ ] חסימת שעה דרך block-slot.html → נעלמת מהזמינות באתר',
    '[ ] mt_usage_counters מתחיל לספור (messages_sent) אחרי ההודעה הראשונה',
    '[ ] git status נקי לפני netlify deploy --prod; אישור מפורש של רועי לפני הדיפלוי',
  ].join('\n')
}

function main() {
  const args = process.argv.slice(2)
  if (args.includes('--example')) {
    process.stdout.write(JSON.stringify(EXAMPLE, null, 2) + '\n')
    return
  }
  const file = args.find((a) => !a.startsWith('--'))
  if (!file) {
    console.error('שימוש: node scripts/onboard-client.mjs client.json   |   --example')
    process.exit(2)
  }
  const client = JSON.parse(readFileSync(file, 'utf8'))
  const errors = validate(client)
  console.log('================ DRY-RUN — קליטת לקוח חדש ================')
  console.log('שום דבר לא נכתב ל-Supabase, לקבצים או ל-n8n.\n')
  if (errors.length) {
    console.log('❌ שגיאות בקלט:\n - ' + errors.join('\n - ') + '\n')
    process.exitCode = 1
    return
  }
  const { sql, pin } = sqlDraft(client)
  console.log('---- 1) טיוטת SQL (mt_clients + mt_services + mt_staff) ----\n' + sql + '\n')
  console.log('---- 2) קטע siteConfig.js ----\n' + siteConfigDraft(client) + '\n')
  console.log('---- 3) רשימת בדיקות ידניות ----\n' + checklist(client) + '\n')
  console.log(`(block_slots_pin שנוצר: ${pin} — יופיע גם ב-SQL; לא לשלוח בצ׳אט פתוח)`)
}

main()
