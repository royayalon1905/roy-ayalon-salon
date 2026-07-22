export const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:30', '14:00', '15:30', '17:00', '18:30', '20:00']

const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
const MONTH_NAMES = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
]

export function getBookedSlots(dateKey) {
  if (!dateKey) return []
  const hash = dateKey.split('-').reduce((sum, part) => sum + Number(part), 0)
  return TIME_SLOTS.filter((_, i) => (hash + i) % 4 === 0)
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// mt_clients.id for this clone (salon-demo), from the multi-tenant n8n/Supabase migration.
const MT_CLIENT_ID = '99eeef59-4def-40e4-9fe2-106a26e6f0ce'

// Real availability from the mt_busy_slots view (confirmed appointments only,
// no client details exposed). Falls back to the demo hash when the site
// runs without a configured backend (white-label clone before hookup).
export async function fetchBusySlots(dateKey, barberName) {
  if (!dateKey) return []
  if (!SUPABASE_URL || !SUPABASE_KEY) return getBookedSlots(dateKey)
  const params = new URLSearchParams({ select: 'time', date: `eq.${dateKey}`, client_id: `eq.${MT_CLIENT_ID}` })
  if (barberName) params.set('barber', `eq.${barberName}`)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/mt_busy_slots?${params}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  })
  if (!res.ok) throw new Error(`mt_busy_slots request failed: ${res.status}`)
  const rows = await res.json()
  return rows.map((row) => String(row.time).slice(0, 5))
}

// Local-time key (YYYY-MM-DD). toISOString() is UTC-based, which shifts the
// date back a day between midnight and UTC offset hours (00:00–03:00 IDT).
function localDateKey(d) {
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function nextDays(count = 7) {
  const today = new Date()
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
    return {
      key: localDateKey(d),
      dayName: DAY_NAMES[d.getDay()],
      dayNum: d.getDate(),
      monthName: MONTH_NAMES[d.getMonth()],
      isToday: i === 0,
    }
  })
}
