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

// TODO(סימולציית-מכירות): כל עוד true, שום קריאת רשת אמיתית לא יוצאת מתהליך ההזמנה —
// גם אם VITE_SUPABASE_URL/KEY מוגדרים ב-.env. כדי להחזיר זמינות אמיתית: להפוך ל-false.
const SIMULATION_MODE = true
const SIMULATED_BUSY_SLOTS = ['10:00', '14:00', '17:00']

// Real availability via the get_busy_slots RPC (SECURITY DEFINER, scoped to
// this client_id server-side — direct mt_busy_slots access is blocked by RLS).
// Falls back to the demo hash when the site runs without a configured
// backend (white-label clone before hookup).
export async function fetchBusySlots(dateKey, barberName) {
  if (!dateKey) return []
  if (SIMULATION_MODE) return SIMULATED_BUSY_SLOTS
  if (!SUPABASE_URL || !SUPABASE_KEY) return getBookedSlots(dateKey)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_busy_slots`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_client_id: MT_CLIENT_ID, p_date_from: dateKey, p_date_to: dateKey }),
  })
  if (!res.ok) throw new Error(`get_busy_slots request failed: ${res.status}`)
  const rows = await res.json()
  // barber === null = חסימה כלל-עסקית (בעל העסק סגר את כל הספרים לשעה הזו), חייבת להופיע
  // לכל בחירת ספר, לא רק לספר ספציפי. ראו mt_blocked_slots + mt_busy_slots (10.8.2026).
  return rows
    .filter((row) => !barberName || row.barber === null || row.barber === barberName)
    .map((row) => String(row.time).slice(0, 5))
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
