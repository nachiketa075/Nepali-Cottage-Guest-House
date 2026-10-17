# Nepali Cottage Guest House — website frontend

A responsive, single-page website for the hotel, built with React, Vite, Tailwind CSS v4 and Motion for React.
It runs entirely in the browser. There is no booking engine, payment or login.

## Setup

Requires Node 20+.

```bash
npm install
npm run dev       # local development at http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build locally
npm run media     # regenerate WebP variants after adding photos (needs ffmpeg with libwebp)
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, an ordinary web server).

## Where to edit things

| What | File |
| --- | --- |
| Hotel facts, rooms, amenities, contact, location, reviews, social links, policies | `src/data/property.js` |
| Photo and video paths, alt text, captions, gallery order, hero video | `src/data/media.js` |
| Video behaviour (autoplay, pausing, controls) | `src/components/ui/ManagedVideo.jsx` |
| Page title and meta description | `index.html` |
| Colours, fonts, type scale | `src/index.css` (`@theme`) |

The layout components read everything from these data files, so filling in a missing detail never requires a
layout change. Anything left `null` or empty is hidden from visitors automatically, and so is its nav link.

### Editor preview

Guests see only confirmed content. To see dashed **"Placeholder"** notes for every missing detail, open the site
with `?preview` in the URL (for example `http://localhost:5173/?preview`), or set `site.previewMode: true` in
`src/data/property.js`. Preview also shows these items, which guests don't see:

- the "Sample listing" tag on each room
- "To be confirmed" next to a room's guest count and beds
- the Location section and its menu link
- the list of amenities still awaiting confirmation

### Videos

The two supplied WhatsApp clips are kept untouched in the project root. Website copies live in `public/videos/`:

| Web file | Source | Notes |
| --- | --- | --- |
| `room-one-walkthrough.mp4` | `WhatsApp Video 2026-10-16 at 21.36.35.mp4` | full 12.2 s; hero (landscape screens), Room One dialog, gallery |
| `room-two-walkthrough.mp4` | `WhatsApp Video 2026-10-16 at 21.36.38.mp4` | trimmed to 1.5–12.5 s (door opening and bathroom close-ups removed); "A glimpse of your stay", Room Two dialog, gallery |

How the copies were made:

- Re-encoded to H.264 High at 1024×576, 30 fps, `yuv420p`, with `+faststart`.
- The audio track was removed.
- Sizes are 1.4 MB and 1.3 MB.
- Poster frames are in `public/videos/posters/` (JPEG plus 640 px and 1024 px WebP).

To regenerate or add a clip:

```bash
ffmpeg -i "source.mp4" -an -c:v libx264 -preset slow -crf 23 -profile:v high -level 4.0 \
  -pix_fmt yuv420p -movflags +faststart public/videos/new-clip.mp4
ffmpeg -ss 4 -i public/videos/new-clip.mp4 -frames:v 1 -q:v 3 public/videos/posters/new-clip.jpg
```

Then add it with the `video()` helper in `src/data/media.js`.

All videos share one component (`ManagedVideo`):

- **Always silent.** Videos are muted before every play attempt, carry no audio track, and have no volume or unmute
  control.
- **Lazy loading.** Nothing downloads until a video is near the viewport. The hero clip is the only exception, and
  it loads only on landscape screens.
- **Pausing.** Videos play while visible and pause when off-screen, when the browser tab is hidden, or when a dialog
  covers the page. A visitor's manual pause is respected.
- **No duplicates.** If the same clip starts playing elsewhere on the page, the other copy pauses.
- **Blocked autoplay.** The poster stays visible and a Play button appears.
- **Reduced motion.** Only posters show at first; visitors can start playback deliberately.

The hero uses video only on screens at least as wide as they are tall. On phones and portrait tablets, the entrance
photo is shown instead of an extreme crop of the 16:9 footage. The photo is also the hero's loading and failure
fallback.

### Connecting the enquiry form

Enquiry details are checked for completeness. Dates cannot be in the past, check-out must come after check-in,
and the contact field must be a valid email or phone number. While `enquiry.endpoint` is `null`, the form does
**not** pretend to send. It explains that sending is not yet connected and offers a **Copy enquiry** button, plus
Call/WhatsApp/Email buttons for any contact channel marked verified. To enable real sending, set
`enquiry.endpoint` to a service that accepts a JSON POST (Formspree, Basin, or the hotel's own API).

## Missing property details needed before launch

1. **Room information.** Real room names or types, guest capacity, bed configuration, in-room amenities and rates,
   if they are to be published. Also confirm two groupings: the two photos assigned to Room Two, and which room each
   video shows.
2. **Phone / WhatsApp.** The entrance sign shows **985-6031094**, shared with *Wendy Juice Shop*. Confirm that this
   is the guest house line, that the country code is +977, and whether it takes WhatsApp. Then set `verified: true`.
3. **Email address** for enquiries.
4. **Address and map.** Full address, map coordinates or a Google Maps embed URL, and any directions notes.
5. **Nearby places.** Only those with verified distances.
6. **Amenities to confirm.** Wi-Fi, breakfast, hot water, parking, luggage storage, laundry, and towels and linen.
   Also whether Wendy Juice Shop is part of the property and should be featured.
7. **Guest reviews.** Genuine quotes with author and source. The section stays hidden until at least one is added.
8. **Better footage (optional).**
   - Exterior or garden video.
   - Higher-resolution clips. The supplied ones are 1024×576 and look soft at full width on large screens; 1920×1080
     or more is recommended.
   - A wider entrance photo, around 2400 px.
9. **Social media links** and any **policy pages**. These are hidden until added.
10. **Enquiry service endpoint** for the contact form.
11. **Domain.** Once known, change `og:image` in `index.html` to an absolute URL.

## What was verified

### Automated checks

These ran in headless Chrome against the production build.

**Layout**
- At 360 px, 768 px and 1440 px there is no horizontal overflow, no console errors and no failed requests.

**Video loading**
- Every video and poster URL returns HTTP 200 with the correct content type.
- No video downloads at page load on 360 px or 768 px screens. At 1440 px, only the hero clip downloads at load.

**Playback**
- Videos are always muted, and no audio bytes are decoded.
- Looping works: after seeking to the end, playback wrapped and continued.
- Pause and play work. A manual pause persists after scrolling away and back.
- Videos pause off-screen and when the tab is hidden, and resume when visible again.
- No two copies of the same clip played at once.
- Page videos pause while a dialog is open.

**Fallbacks**
- When autoplay is blocked (simulated), the hero keeps the photo and the glimpse section shows its poster with a Play
  button, which works when clicked.
- With reduced motion set, nothing autoplays and deliberate playback works.

**Keyboard and focus (scripted)**
- The skip link works.
- The menu, room dialog and lightbox all trap focus, close on Escape and return focus to the trigger.
- Arrow-key navigation works in the room dialog and lightbox.

**Forms and filters**
- Enquiry bar → form prefill works.
- Form validation shows an error summary and catches invalid contact details and check-out before check-in.
- The form never claims an enquiry was sent.
- Gallery filters work.

### Not yet done

- Manual screen-reader testing.
- Testing on real phones and Safari.
- A manual colour-contrast audit.
