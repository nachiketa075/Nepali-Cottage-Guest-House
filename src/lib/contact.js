import { contact, location } from '../data/property.js'

// Return only the contact channels that have been verified.
export function verifiedContact() {
  const { phone, whatsapp, email } = contact
  return {
    phone: phone.verified && phone.tel ? phone : null,
    whatsapp: whatsapp.verified && whatsapp.number ? whatsapp : null,
    email: email.verified && email.address ? email : null,
  }
}

export function whatsappLink(number, text = '') {
  const q = text ? `?text=${encodeURIComponent(text)}` : ''
  return `https://wa.me/${number}${q}`
}

export function mailtoLink(address, subject, body) {
  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)
  // URLSearchParams encodes spaces as "+", which mail clients show literally.
  return `mailto:${address}?${params.toString().replace(/\+/g, '%20')}`
}

export function directionsUrl() {
  if (location.directionsUrl) return location.directionsUrl
  const dest = location.coordinates
    ? `${location.coordinates.lat},${location.coordinates.lng}`
    : location.address?.join(', ')
  return dest ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}` : null
}
