/**
 * PROPERTY CONFIGURATION — the single source of truth for every fact on the site.
 *
 * Rules this file follows:
 *  - Only facts that are confirmed (or directly visible in the supplied photos)
 *    are marked as confirmed / verified.
 *  - Anything unknown is `null`, an empty array, or `confirmed: false`.
 *    Layout components hide missing details automatically, so filling a value
 *    here is all that is needed to make it appear.
 *  - Editor preview: missing details can be shown as dashed "Placeholder"
 *    notes so you can see what still needs supplying. Guests never see them.
 *    Turn preview on by adding ?preview to the URL (e.g. localhost:5173/?preview)
 *    or by setting `previewMode: true` below. Leave it false for launch.
 */
import { photos, videos } from './media.js'

export const site = {
  previewMode: false,
}

export const property = {
  name: 'Nepali Cottage Guest House',
  shortName: 'Nepali Cottage',
  descriptor: 'Guest House',
  // Used for the <meta name="description"> as well as the footer.
  summary:
    'A stone-built guest house set around a leafy garden. Explore the rooms, browse the gallery and send an enquiry about your stay.',
  heroHeadline: 'A stone-built guest house wrapped in greenery, with a garden path and simply furnished rooms.',
  intro: {
    eyebrow: 'About the guest house',
    title: 'Stone, bougainvillea and a garden to come home to.',
    paragraphs: [
      'Nepali Cottage Guest House sits behind a stone-built entrance draped in bougainvillea and strung with warm lights.',
      'The garden is laid out around a paved path between two lawns, with palms, ferns and a shaded corner to sit in.',
    ],
    image: photos.gardenFromAbove,
  },
  // Highlights shown in the introduction. Only things visible in the supplied photos.
  highlights: [
    'Stone-built entrance with climbing bougainvillea',
    'Garden with lawns, palms and a stone-paved path',
    'Shaded seating within the garden',
    'Guest rooms with ceiling fans and wood-effect floors',
  ],
}

/**
 * CONTACT DETAILS
 * Call / WhatsApp / email buttons appear only when `verified: true`.
 *
 * The number below is printed on the entrance sign in the supplied photo, but
 * the sign is shared with "Wendy Juice Shop", the +977 (Nepal) country code is
 * assumed, and WhatsApp availability is unknown. Confirm, then set verified.
 */
export const contact = {
  phone: {
    display: '+977 985-6031094',
    tel: '+9779856031094',
    verified: false,
  },
  whatsapp: {
    number: '9779856031094', // international format, digits only
    verified: false,
  },
  email: {
    address: null, // e.g. 'stay@example.com'
    verified: false,
  },
}

/**
 * ENQUIRY SUBMISSION
 * The site is frontend-only. Set `endpoint` to a form/booking service URL that
 * accepts a JSON POST (e.g. a Formspree form or the hotel's own API) to enable
 * real submission. While null, the form validates and explains that sending is
 * not connected yet — it never pretends an enquiry was sent.
 */
export const enquiry = {
  endpoint: null,
  maxGuests: 10,
}

/**
 * LOCATION — nothing is assumed. The section, nav link and map appear once
 * `address` is filled. `mapEmbedUrl` is a Google Maps "Embed a map" iframe src.
 * `directionsUrl` is generated from the address/coordinates if left null.
 */
export const location = {
  address: null, // e.g. ['Street', 'Area', 'City', 'Country']
  coordinates: null, // e.g. { lat: 0, lng: 0 }
  mapEmbedUrl: null,
  directionsUrl: null,
  notes: null, // e.g. 'A five-minute walk from …' — only if verified
  // Only verified places and distances: { name: 'Place', distance: '1.2 km', note: 'optional' }
  nearby: [],
}

/**
 * GUEST REVIEWS — the section is hidden until at least one genuine review is added.
 * Shape: { quote, author, source, sourceUrl?, date? }
 * Copy text verbatim from the original platform and link to it where possible.
 */
export const reviews = []

/**
 * AMENITIES
 * `confirmed: true` items are publicly shown. The ones below are physical
 * features visible in the supplied photos and videos — not services. Anything
 * that is a service (towels, linen, cleaning, breakfast …) stays unconfirmed
 * until the guest house confirms it, even if it appears in a photo. `confirmed: false` items are placeholders:
 * shown (marked as placeholders) only in preview mode, never as facts.
 * `icon` is a name from the icon map in src/components/ui/Icon.jsx.
 */
export const amenities = [
  { icon: 'trees', title: 'Garden', text: 'Lawns, palms and ferns either side of a stone-paved path.', confirmed: true },
  { icon: 'sofa', title: 'Garden seating', text: 'A shaded seating corner set among the plants.', confirmed: true },
  { icon: 'fan', title: 'Ceiling fans', text: 'An overhead fan in each of the rooms pictured and filmed.', confirmed: true },

  { icon: 'towels', title: 'Towels & linen', text: 'Seen in the photos — confirm what is provided for every stay.', confirmed: false },

  { icon: 'wifi', title: 'Wi-Fi', text: 'Confirm availability and coverage.', confirmed: false },
  { icon: 'coffee', title: 'Breakfast', text: 'Confirm whether breakfast is offered and if it is included.', confirmed: false },
  { icon: 'droplets', title: 'Hot water', text: 'Confirm hot water / showers in rooms.', confirmed: false },
  { icon: 'car', title: 'Parking', text: 'Confirm whether guest parking is available.', confirmed: false },
  { icon: 'luggage', title: 'Luggage storage', text: 'Confirm.', confirmed: false },
  { icon: 'shirt', title: 'Laundry', text: 'Confirm.', confirmed: false },
  { icon: 'glass', title: 'Wendy Juice Shop', text: 'Named on the entrance sign — confirm whether it is part of the guest house and should be featured.', confirmed: false },
]

/**
 * ROOMS — SAMPLE CONTENT.
 * Room names, categories, capacities, bed set-ups and rates have NOT been
 * confirmed. Each room is marked `demo: true`, which shows a "Sample listing"
 * tag on the site. Replace the values and set `demo: false`.
 *
 * - `capacity`, `beds`, `rate`: null shows "To be confirmed" / "Contact for rates".
 * - `amenities`: confirmed in-room amenities only.
 * - `seenInPhotos`: plain observations of what the photos show.
 * - Grouping photos 2 & 3 under one room is a guess (they appear to be the
 *   same room from opposite ends) — please confirm.
 * - `videos`: walk-throughs matched to rooms by their furniture (Room One's
 *   armchairs and painting; Room Two's sofa, mirror and window) — please confirm.
 * - In the guest-facing view unknown facts are simply left out; "To be
 *   confirmed" notes and the "Sample listing" tag only appear in editor preview.
 */
export const rooms = [
  {
    id: 'room-one',
    demo: true,
    name: 'Room One',
    description: 'A calm room with a double bed, a pair of red armchairs and a curtained window.',
    capacity: null, // e.g. '2 adults'
    beds: null, // e.g. '1 double bed'
    rate: null, // e.g. 'From NPR 2,500 per night'
    amenities: [],
    seenInPhotos: ['Double bed', 'Two armchairs', 'Curtained window', 'Ceiling fan', 'Framed artwork'],
    photos: [photos.roomDoubleArmchairs],
    videos: [videos.roomOneWalkthrough],
  },
  {
    id: 'room-two',
    demo: true,
    name: 'Room Two',
    description: 'A double and a single bed, a cushioned sofa, and a desk with a mirror.',
    capacity: null,
    beds: null,
    rate: null,
    amenities: [],
    seenInPhotos: ['Double bed', 'Single bed', 'Sofa seat', 'Desk and mirror', 'Attached bathroom', 'Ceiling fan'],
    photos: [photos.roomDoubleSingleWindow, photos.roomDoubleSingleBathroom],
    videos: [videos.roomTwoWalkthrough],
  },
  {
    id: 'room-three',
    demo: true,
    name: 'Room Three',
    description: 'A double and a single bed, an armchair in the corner and a desk beneath a wooden mirror.',
    capacity: null,
    beds: null,
    rate: null,
    amenities: [],
    seenInPhotos: ['Double bed', 'Single bed', 'Armchair', 'Desk and mirror', 'Attached bathroom', 'Ceiling fan'],
    photos: [photos.roomDoubleSingleDesk],
  },
  {
    id: 'room-four',
    demo: true,
    name: 'Room Four',
    description: 'Two single beds with a bedside table between them and full-length curtains.',
    capacity: null,
    beds: null,
    rate: null,
    amenities: [],
    seenInPhotos: ['Two single beds', 'Bedside table', 'Wall light', 'Ceiling fan'],
    photos: [photos.roomTwoSingles],
  },
]

// Social profiles: { label: 'Instagram', url: 'https://…' }. Hidden while empty.
export const social = []

// Policy pages: { label: 'Cancellation policy', url: '/policies/cancellation.html' }. Hidden while empty.
export const policies = []
