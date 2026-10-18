import { pricing } from '../data/property.js'

// Owner-supplied amounts, formatted without assuming a currency or billing basis.
export function formatAmount(amount) {
  if (amount == null) return null
  const n = Number(amount).toLocaleString('en-US')
  return pricing.currency ? `${pricing.currency} ${n}` : n
}

/** e.g. "1,600" today; "NPR 1,600 per room per night" once currency and basis are set. */
export function rateLabel(room) {
  const amount = formatAmount(room?.rate)
  if (!amount) return null
  return pricing.basis ? `${amount} ${pricing.basis}` : amount
}

// Shown next to prices until currency and basis are both confirmed.
export const rateNeedsNote = !pricing.currency || !pricing.basis
export const rateNote = pricing.note
