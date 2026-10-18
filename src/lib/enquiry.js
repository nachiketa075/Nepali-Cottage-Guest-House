import { enquiry, property, rooms } from '../data/property.js'
import { nightsBetween, todayISO, formatDate } from './dates.js'
import { rateLabel } from './pricing.js'

export const emptyEnquiry = {
  name: '',
  contact: '',
  checkIn: '',
  checkOut: '',
  adults: '2',
  children: '0',
  roomId: '',
  message: '',
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_CHARS = /^\+?[\d\s().-]+$/

export function contactKind(value) {
  const v = value.trim()
  if (EMAIL.test(v)) return 'email'
  const digits = v.replace(/\D/g, '')
  if (PHONE_CHARS.test(v) && digits.length >= 7 && digits.length <= 15) return 'phone'
  return null
}

// Validates the stay dates on their own (used by the hero bar and the form).
export function validateDates({ checkIn, checkOut }) {
  const errors = {}
  const today = todayISO()
  if (!checkIn) errors.checkIn = 'Choose a check-in date.'
  else if (checkIn < today) errors.checkIn = 'Check-in can’t be in the past.'
  if (!checkOut) errors.checkOut = 'Choose a check-out date.'
  else if (checkIn && checkOut <= checkIn) errors.checkOut = 'Check-out must be after check-in.'
  return errors
}

export function validateEnquiry(values) {
  const errors = { ...validateDates(values) }
  if (values.name.trim().length < 2) errors.name = 'Enter your name.'
  if (!values.contact.trim()) errors.contact = 'Enter an email address or phone number.'
  else if (!contactKind(values.contact)) errors.contact = 'Enter a valid email address or a phone number with country code.'
  const adults = Number(values.adults)
  const children = Number(values.children)
  if (!Number.isInteger(adults) || adults < 1) errors.adults = 'At least one adult is required.'
  else if (adults + children > enquiry.maxGuests) errors.adults = `For groups larger than ${enquiry.maxGuests}, please mention it in your message.`
  if (values.message.length > 1000) errors.message = 'Please keep your message under 1,000 characters.'
  return errors
}

// Plain-text version of an enquiry, for copying, email or WhatsApp.
export function enquiryText(values) {
  const room = rooms.find((r) => r.id === values.roomId)
  const nights = nightsBetween(values.checkIn, values.checkOut)
  const lines = [
    `Stay enquiry — ${property.name}`,
    '',
    `Name: ${values.name.trim()}`,
    `Contact: ${values.contact.trim()}`,
    `Check-in: ${formatDate(values.checkIn)}`,
    `Check-out: ${formatDate(values.checkOut)} (${nights} night${nights === 1 ? '' : 's'})`,
    `Guests: ${values.adults} adult${values.adults === '1' ? '' : 's'}${Number(values.children) ? `, ${values.children} child${values.children === '1' ? '' : 'ren'}` : ''}`,
  ]
  if (room) lines.push(`Room of interest: ${room.name}${room.rate ? ` (listed rate ${rateLabel(room)})` : ''}`)
  if (values.message.trim()) lines.push('', values.message.trim())
  return lines.join('\n')
}

/**
 * Sends the enquiry if an endpoint is configured.
 * Returns { status: 'not-configured' | 'sent' | 'error', message? }.
 */
export async function submitEnquiry(values) {
  if (!enquiry.endpoint) return { status: 'not-configured' }
  try {
    const res = await fetch(enquiry.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...values, summary: enquiryText(values) }),
    })
    if (!res.ok) throw new Error(`Request failed (${res.status})`)
    return { status: 'sent' }
  } catch (err) {
    return { status: 'error', message: err.message }
  }
}
