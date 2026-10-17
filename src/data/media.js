/**
 * MEDIA INVENTORY — every image and video path used on the site lives here.
 *
 * To replace or add a photo:
 *   1. Put the JPEG in /public/media/photos/
 *   2. Run `npm run media` to generate the WebP size variants
 *   3. Add or edit an entry below with the file name (no extension), the real
 *      pixel dimensions, and a description of what the photo actually shows.
 *
 * `widths` lists which WebP variants exist. The script makes 640, 1024 and the
 * full width (only sizes smaller than the original are produced).
 */

const PHOTO_DIR = '/media/photos'

function photo({ file, width, height, alt, caption, category, position = 'center' }) {
  const widths = [640, 1024].filter((w) => w < width).concat(width)
  return {
    type: 'image',
    src: `${PHOTO_DIR}/${file}.jpg`,
    srcSet: widths.map((w) => `${PHOTO_DIR}/${file}-${w}.webp ${w}w`).join(', '),
    width,
    height,
    alt,
    caption,
    category,
    position, // CSS object-position used when the photo is cropped
  }
}

export const photos = {
  exteriorEntrance: photo({
    file: 'exterior-entrance-dusk',
    width: 1280,
    height: 960,
    alt: 'The stone-built entrance of Nepali Cottage Guest House at dusk, framed by bougainvillea and warm string lights, with the guest house sign beside the gate',
    caption: 'The entrance at dusk, lit by string lights and framed by bougainvillea.',
    category: 'exterior',
    position: '58% 50%',
  }),
  gardenFromAbove: photo({
    file: 'garden-from-above',
    width: 960,
    height: 1280,
    alt: 'View from above of the guest house garden: lawns on both sides of a stone-paved path, palms, ferns and a shaded seating area',
    caption: 'The garden from above, with a stone path between two lawns.',
    category: 'garden',
  }),
  gardenPath: photo({
    file: 'garden-path',
    width: 1280,
    height: 960,
    alt: 'A stone-paved garden path lined with grasses and palms under a blue sky',
    caption: 'The garden path on a clear day.',
    category: 'garden',
  }),
  roomDoubleArmchairs: photo({
    file: 'room-double-armchairs',
    width: 1600,
    height: 1200,
    alt: 'Guest room with a double bed, two red upholstered armchairs, a curtained window and wood-effect flooring',
    caption: 'A guest room with a double bed and a pair of armchairs.',
    category: 'rooms',
  }),
  roomDoubleSingleWindow: photo({
    file: 'room-double-single-window-view',
    width: 1600,
    height: 1200,
    alt: 'Guest room with a double bed, a single bed, a cushioned wooden sofa and a window with curtains',
    caption: 'A guest room with a double and a single bed, looking towards the window.',
    category: 'rooms',
  }),
  roomDoubleSingleBathroom: photo({
    file: 'room-double-single-bathroom-view',
    width: 1600,
    height: 1200,
    alt: 'Guest room with a double bed and a single bed, a desk and mirror, and an open door to an attached bathroom',
    caption: 'A guest room with a desk, mirror and attached bathroom.',
    category: 'rooms',
  }),
  roomDoubleSingleDesk: photo({
    file: 'room-double-single-desk',
    width: 1600,
    height: 1200,
    alt: 'Guest room with a double bed and a single bed, a red armchair, a desk with mirror and an attached bathroom',
    caption: 'A guest room with an armchair, desk and attached bathroom.',
    category: 'rooms',
  }),
  roomTwoSingles: photo({
    file: 'room-two-single-beds',
    width: 1600,
    height: 1200,
    alt: 'Guest room with two single beds, a bedside table between them and full-length curtains',
    caption: 'A guest room with two single beds.',
    category: 'rooms',
  }),
}

/**
 * VIDEOS — silent web copies of the supplied WhatsApp clips, in /public/videos/.
 * Originals are kept untouched in the project root. Web copies were re-encoded
 * to H.264 High / yuv420p with fast-start metadata and no audio track.
 * Poster frames (JPEG + WebP) live in /public/videos/posters/.
 *
 *  room-one-walkthrough.mp4  ← "WhatsApp Video 2026-10-16 at 21.36.35.mp4" (full 12.2 s)
 *  room-two-walkthrough.mp4  ← "WhatsApp Video 2026-10-16 at 21.36.38.mp4" (1.5–12.5 s;
 *                               the door opening and bathroom close-ups were trimmed)
 */
const VIDEO_DIR = '/videos'

function video({ file, width, height, duration, alt, caption, category }) {
  return {
    type: 'video',
    src: `${VIDEO_DIR}/${file}.mp4`,
    mime: 'video/mp4',
    width,
    height,
    duration,
    alt,
    caption,
    category,
    poster: {
      type: 'image',
      src: `${VIDEO_DIR}/posters/${file}.jpg`,
      srcSet: `${VIDEO_DIR}/posters/${file}-640.webp 640w, ${VIDEO_DIR}/posters/${file}-1024.webp 1024w`,
      width,
      height,
      alt,
      position: 'center',
    },
  }
}

export const videos = {
  roomOneWalkthrough: video({
    file: 'room-one-walkthrough',
    width: 1024,
    height: 576,
    duration: 12.2,
    alt: 'A slow walk through a guest room with a double bed, two red armchairs, a curtained window and the door to an attached bathroom',
    caption: 'Walk-through of the room with a double bed and a pair of armchairs.',
    category: 'rooms',
  }),
  roomTwoWalkthrough: video({
    file: 'room-two-walkthrough',
    width: 1024,
    height: 576,
    duration: 11,
    alt: 'A walk through a guest room with a double bed, a single bed, a wooden-framed sofa and a window with curtains',
    caption: 'Walk-through of the room with a double and a single bed.',
    category: 'rooms',
  }),
}

/**
 * VIDEO SETTINGS
 * `autoplayWithReducedMotion`: when true, videos autoplay (always muted) even for
 * visitors whose device asks for reduced motion — e.g. Linux desktops with
 * animations turned off. The pause/play button is still shown on every video.
 * Set to false to show posters only for those visitors until they press Play.
 */
export const videoSettings = {
  autoplayWithReducedMotion: true,
}

/**
 * HERO VIDEO
 * `sources` play muted and looped behind the hero copy. `poster` (the entrance
 * photo) is always rendered underneath: it is what visitors see while the video
 * loads, if it fails, if autoplay is blocked, or if they prefer reduced motion.
 *
 * `media`: the footage is 16:9 landscape, so it is only used on screens at least
 * as wide as they are tall. Phones and portrait tablets get the photo instead of
 * an extreme crop (and save the download). Set to null to use video everywhere.
 */
export const heroVideo = {
  sources: [{ src: videos.roomOneWalkthrough.src, type: 'video/mp4' }],
  poster: photos.exteriorEntrance,
  media: '(min-aspect-ratio: 1/1) and (min-width: 768px)',
  label: 'background walk-through of a guest room',
}

/**
 * GALLERY ORDER. Images and videos can be mixed.
 * `featured: true` makes a tile span two columns and two rows on larger screens.
 *
 * Video items (always muted, play only while visible) use the `video()` helper above.
 * Videos are laid out half-width on large screens so they keep their 16:9 frame.
 */
export const gallery = [
  { ...photos.exteriorEntrance, featured: true },
  photos.gardenFromAbove,
  photos.gardenPath,
  photos.roomDoubleArmchairs,
  photos.roomDoubleSingleWindow,
  photos.roomDoubleSingleBathroom,
  photos.roomDoubleSingleDesk,
  photos.roomTwoSingles,
  videos.roomOneWalkthrough,
  videos.roomTwoWalkthrough,
]

export const galleryCategories = [
  { id: 'rooms', label: 'Rooms' },
  { id: 'garden', label: 'Garden' },
  { id: 'exterior', label: 'Entrance' },
]
