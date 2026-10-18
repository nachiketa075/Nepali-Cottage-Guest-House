/**
 * PROPERTY CONFIGURATION — the single source of truth for every fact on the site.
 *
 * Where facts come from (details, sources and conflicts: docs/research-notes.md):
 *  - Owner-supplied: room categories and prices, photos, videos.
 *  - Published only when at least two independent listings agree, or when it is the
 *    property's own listing text (checked 17 Oct 2026).
 *  - Anything unconfirmed is `null`, an empty array, or `confirmed: false`, and the
 *    layout hides it. Filling a value here is all that is needed to show it.
 *
 * Editor preview: add ?preview to the URL (or set `previewMode: true`) to see dashed
 * "Placeholder" notes for missing details. Guests never see them.
 */

export const site = {
  previewMode: false,
}

export const property = {
  name: 'Nepali Cottage Guest House',
  shortName: 'Nepali Cottage',
  descriptor: 'Guest House',
  locality: 'Lakeside, Pokhara',
  country: 'Nepal',
  // Used for the page description, structured data and the footer.
  summary:
    'A stone-built guest house with a garden on Pahari Marga in Lakeside, Pokhara, near Phewa Lake. Explore the rooms and send an enquiry about your stay.',
  heroHeadline: 'A stone-built guest house with a leafy garden in Lakeside, Pokhara — near Phewa Lake.',
  intro: {
    eyebrow: 'About the guest house',
    title: 'Stone, bougainvillea and a garden in Lakeside.',
    paragraphs: [
      'Nepali Cottage Guest House sits on Pahari Marga in Lakeside, Pokhara, behind a stone-built entrance draped in bougainvillea. Wendy Juice Shop, the café at the gate, serves breakfast, coffee and meals from morning to evening.',
      'Inside, a paved path runs between two lawns, past palms and a hammock, to the white-and-red guest house building. Wi-Fi is free throughout, and the travel desk can help arrange tickets, flights and treks.',
    ],
  },
  // Verified highlights (see docs/research-notes.md).
  highlights: [
    'On Pahari Marga in Lakeside, near Phewa Lake',
    'Garden and terrace',
    'Café and restaurant at the gate',
    'Free Wi-Fi throughout',
    'Travel desk for tickets, flights and treks',
  ],
  languages: ['English', 'Hindi'],
}

/**
 * CONTACT DETAILS — buttons appear only when `verified: true`.
 * Phone verified for this property: Google Hotels listing, OpenStreetMap directory
 * entry for the guest house, and the entrance sign in the owner's photo. The sign
 * and number are shared with Wendy Juice Shop.
 * WhatsApp: no source confirms it — keep false until the owner confirms.
 */
export const contact = {
  phone: {
    display: '+977 985-6031094',
    tel: '+9779856031094',
    verified: true,
  },
  whatsapp: {
    number: '9779856031094', // international format, digits only
    verified: false,
  },
  email: {
    address: null, // none found online; do not invent one
    verified: false,
  },
}

/**
 * ENQUIRY SUBMISSION
 * The site is frontend-only. Set `endpoint` to a form/booking service URL that
 * accepts a JSON POST to enable real submission. While null, the form validates
 * and explains that sending is not connected — it never pretends to have sent.
 */
export const enquiry = {
  endpoint: null,
  maxGuests: 10,
}

/**
 * PRICING — owner-supplied rates (override every third-party price).
 * Currency, billing basis and inclusions are NOT confirmed. Until they are,
 * prices show as plain amounts with `note` beside them.
 *   currency: e.g. 'NPR'  → shown before the amount ("NPR 1,600")
 *   basis:    e.g. 'per room per night' → shown after the amount
 */
export const pricing = {
  currency: null,
  basis: null,
  note: 'Currency, rate basis, taxes and inclusions are confirmed when the guest house replies to your enquiry.',
}

/**
 * ROOM CATEGORIES — owner-supplied names and prices.
 * Unknown per-category details stay null (capacity, beds, size) and are hidden.
 * `photos` / `videos`: left empty on purpose — no evidence yet ties any current
 * photo to a category (listing photos are older and show a different décor).
 * Room media is shown together under "Inside the rooms" (media.js → roomMedia).
 */
export const rooms = [
  {
    id: 'standard',
    name: 'Standard Room',
    rate: 1600,
    description: 'The guest house’s standard category of private room.',
    capacity: null,
    beds: null,
    size: null,
    amenities: [],
    photos: [],
    videos: [],
  },
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    rate: 1700,
    description: 'The guest house’s deluxe category of private room.',
    capacity: null,
    beds: null,
    size: null,
    amenities: [],
    photos: [],
    videos: [],
  },
]

/**
 * IN-ROOM FEATURES listed by both Booking.com and Agoda for the property's rooms
 * (plus hot showers from the owner's Hostelworld text). They describe the rooms
 * in general — not differences between categories.
 */
export const roomFeatures = [
  'Private bathroom with hot shower',
  'Free toiletries; towels and linen',
  'Work desk and seating area',
  'Fan',
  'Free Wi-Fi',
]

/**
 * LOCATION — verified (Google Hotels, Booking.com, Agoda, Hostelworld).
 * Coordinates decoded from Google's plus code 6X65+58W (Pokhara).
 */
const coords = { lat: 28.210488, lng: 83.958328 }
export const location = {
  address: ['Pahari Marga, Da Yatra Street', 'Lakeside, Pokhara-6', 'Pokhara 33700, Nepal'],
  coordinates: coords,
  plusCode: '6X65+58W Pokhara',
  mapEmbedUrl: `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.006}%2C${coords.lat - 0.004}%2C${coords.lng + 0.006}%2C${coords.lat + 0.004}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`,
  mapLink: `https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=18/${coords.lat}/${coords.lng}`,
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${coords.lat}%2C${coords.lng}`,
  notes: 'In the Lakeside neighbourhood (Pokhara-6), on Pahari Marga.',
  // Straight-line distances exactly as listed by Agoda. No walking times are given.
  nearby: [
    { name: 'Phewa (Fewa) Lake', distance: '360 m' },
    { name: 'Tal Barahi (Varahi) Temple', distance: '560 m' },
    { name: 'World Peace Pagoda', distance: '1.7 km' },
    { name: 'Gupteshwor Mahadev Cave', distance: '2.3 km' },
    { name: 'International Mountain Museum', distance: '3.1 km' },
  ],
  nearbySource: {
    label: 'Straight-line distances as listed on Agoda',
    url: 'https://www.agoda.com/en-gb/nepali-cottage-guest-house/hotel/pokhara-np.html',
    checked: '17 October 2026',
  },
}

/**
 * PLATFORM RATINGS — shown separately, never combined. Each needs the platform,
 * scale, review count, link and the date it was checked. Update or remove when stale.
 */
export const ratings = [
  {
    platform: 'Booking.com',
    score: 8.3,
    scale: 10,
    count: 172,
    url: 'https://www.booking.com/hotel/np/nepali-cottage-guest-house.en-gb.html',
    checked: '17 October 2026',
  },
  {
    platform: 'Google',
    score: 4.5,
    scale: 5,
    count: 228,
    url: 'https://www.google.com/travel/hotels/entity/ChgInLivu_vM6YqzARoLL2cvMXdkM3RnMjMQAQ',
    checked: '17 October 2026',
  },
]

/**
 * GUEST REVIEWS — hidden until genuine reviews are supplied with permission.
 * Shape: { quote, author, source, sourceUrl?, date? }
 * Platform review text is not copied (platform terms usually forbid it).
 */
export const reviews = []

/**
 * PROPERTY-WIDE FACILITIES. `confirmed: true` = at least two independent listings
 * agree (docs/research-notes.md). `confirmed: false` = conflicting or single-source:
 * shown only in editor preview. `icon`: see src/components/ui/Icon.jsx.
 */
export const amenities = [
  { icon: 'wifi', title: 'Free Wi-Fi', text: 'Free throughout the property.', confirmed: true },
  { icon: 'trees', title: 'Garden & terrace', text: 'Lawns, palms and a stone-paved path, with a terrace and garden seating.', confirmed: true },
  { icon: 'coffee', title: 'Café & restaurant', text: 'Wendy Juice Shop at the gate — Nepalese and international food. Ask whether breakfast is included in your rate.', confirmed: true },
  { icon: 'bell', title: 'Room service', text: 'Food and drinks brought to your room.', confirmed: true },
  { icon: 'map', title: 'Travel desk', text: 'Help with tickets, flights and treks.', confirmed: true },
  { icon: 'luggage', title: 'Luggage storage', text: 'Store your bags before or after your stay.', confirmed: true },
  { icon: 'nosmoking', title: 'Non-smoking rooms', text: 'Smoking only in the designated area.', confirmed: true },

  { icon: 'car', title: 'Parking', text: 'Listings conflict (Booking.com: none; Agoda/Hostelworld: free).', confirmed: false },
  { icon: 'plane', title: 'Airport transfer', text: 'Listings conflict; also confirm which airport (PHH or the old domestic PKR).', confirmed: false },
  { icon: 'clock', title: 'Check-in / check-out', text: 'Times differ across listings (12:00/11:30, 12:00/12:00, 11:00/12:00).', confirmed: false },
  { icon: 'shirt', title: 'Laundry', text: 'Booking.com only (extra charge).', confirmed: false },
  { icon: 'coffee', title: 'Breakfast included?', text: 'Agoda says free; Booking.com room data says not included.', confirmed: false },
]

// Social profiles: { label: 'Instagram', url: 'https://…' }. None found online — hidden while empty.
export const social = []

// Policy pages: { label: 'Cancellation policy', url: '/policies/cancellation.html' }. Hidden while empty.
export const policies = []
