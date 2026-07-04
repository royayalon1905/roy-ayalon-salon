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

export function nextDays(count = 7) {
  const today = new Date()
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return {
      key: d.toISOString().slice(0, 10),
      dayName: DAY_NAMES[d.getDay()],
      dayNum: d.getDate(),
      monthName: MONTH_NAMES[d.getMonth()],
      isToday: i === 0,
    }
  })
}
