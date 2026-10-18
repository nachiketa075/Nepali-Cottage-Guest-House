import { contact, location, property } from '../data/property.js'
import { verifiedContact } from './contact.js'

/**
 * Adds schema.org LodgingBusiness data built only from verified fields in
 * property.js. No URL, image, price or rating is included: there is no confirmed
 * domain yet, and third-party ratings are not eligible as self-published data.
 */
export function injectStructuredData() {
  if (typeof document === 'undefined' || !location.address?.length) return
  const { phone } = verifiedContact()
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.name,
    description: property.summary,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${location.address[0]}, ${location.address[1]}`,
      addressLocality: 'Pokhara',
      postalCode: '33700',
      addressRegion: 'Gandaki Province',
      addressCountry: 'NP',
    },
    ...(location.coordinates && {
      geo: { '@type': 'GeoCoordinates', latitude: location.coordinates.lat, longitude: location.coordinates.lng },
    }),
    ...(phone && { telephone: contact.phone.tel }),
    ...(property.languages?.length && { knowsLanguage: property.languages }),
  }
  const el = document.createElement('script')
  el.type = 'application/ld+json'
  el.textContent = JSON.stringify(data)
  document.head.appendChild(el)
}
