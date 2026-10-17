// Date helpers that work in the visitor's local time zone (never UTC),
// using the YYYY-MM-DD strings produced by <input type="date">.

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function addDaysISO(iso, days) {
  const [y, m, d] = iso.split('-').map(Number)
  return toISODate(new Date(y, m - 1, d + days))
}

export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0
  const a = new Date(`${checkIn}T00:00:00`)
  const b = new Date(`${checkOut}T00:00:00`)
  return Math.round((b - a) / 86400000)
}

export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
