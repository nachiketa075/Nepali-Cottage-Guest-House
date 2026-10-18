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
| Hotel facts, room categories and prices, currency/rate basis, amenities, contact, location, ratings, reviews | `src/data/property.js` |
| Where every fact came from, conflicts and open questions | `docs/research-notes.md` |
| Photo and video paths, alt text, captions, gallery order, hero video | `src/data/media.js` |
| Video behaviour (autoplay, pausing, controls) | `src/components/ui/ManagedVideo.jsx` |
| Page title, meta description, location metadata | `index.html` (structured data is generated from `property.js`) |
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
| `room-one-walkthrough.mp4` | `WhatsApp Video 2026-10-16 at 21.36.35.mp4` | full 12.2 s; hero (landscape screens), "Inside the rooms", gallery |
| `room-two-walkthrough.mp4` | `WhatsApp Video 2026-10-16 at 21.36.38.mp4` | trimmed to 1.5–12.5 s (door opening and bathroom close-ups removed); "A glimpse of your stay", gallery |

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
- **Reduced motion.** `videoSettings.autoplayWithReducedMotion` in `src/data/media.js` is `true`, as the owner
  requested, so videos still autoplay (muted) on devices that ask for reduced motion. Set it to `false` to show posters
  first, with deliberate playback for those visitors.

The hero uses video only on screens at least as wide as they are tall. On phones and portrait tablets, the entrance
photo is shown instead of an extreme crop of the 16:9 footage. The photo is also the hero's loading and failure
fallback.

### Connecting the enquiry form

Enquiry details are checked for completeness. Dates cannot be in the past, check-out must come after check-in,
and the contact field must be a valid email or phone number. While `enquiry.endpoint` is `null`, the form does
**not** pretend to send. It explains that sending is not yet connected and offers a **Copy enquiry** button, plus
Call/WhatsApp/Email buttons for any contact channel marked verified. To enable real sending, set
`enquiry.endpoint` to a service that accepts a JSON POST (Formspree, Basin, or the hotel's own API).

## Room categories and prices

The owner supplied two room categories and their prices, set in `rooms` in `src/data/property.js`:

- **Standard Room:** 1,600
- **Deluxe Room:** 1,700

`pricing.currency` and `pricing.basis` are `null`. Until they are set, prices show as plain amounts with a note that
currency, basis and inclusions are confirmed on enquiry. Once they are set (for example `'NPR'` and
`'per room per night'`), every price on the page updates together: the room panels, the room details, the enquiry
options and the copied enquiry summary.

Current room photos and videos are shown together under **Inside the rooms**, not assigned to a category. Assign them
by adding them to a room's `photos` / `videos` once the owner confirms which category they show.

## Photos found online (owner review only)

48 listing photos are saved in `media-review/candidates/` with a `manifest.json` that records source, size and
licence status. That folder is git-ignored and never published. See `docs/research-notes.md` for which ones might be
worth using if the owner holds the rights.

## Before launch: details the owner needs to confirm

1. **Currency and rate basis** for 1,600 / 1,700 (for example NPR per room per night). Also whether taxes and
   breakfast are included.
2. **Which category each current photo and video shows.** The listing photos are older and show a different décor,
   so they can't be used to tell.
3. **Per-category details:** guests, beds and size. Listings conflict, for example 18 / 21 m² on Booking.com versus
   "Deluxe 10 m²" on Agoda.
4. **WhatsApp** on +977 985-6031094. It stays hidden until confirmed.
5. **Check-in and check-out times.** Listings give 12:00/11:30, 12:00/12:00 and 11:00/12:00.
6. **Parking and airport transfer.** Listings conflict. Also confirm which airport the transfer serves (most flights
   now use Pokhara International, PHH).
7. **Children, pets and payment methods.** Listings conflict.
8. **Wendy Juice Shop.** Its relationship to the guest house. The site says only that it is the café at the gate.
9. **Email address, social accounts and policy pages.** None were found online.
10. **Rights to any online listing photos** the owner wants to use.
11. **Domain.** Then add a canonical URL and make `og:image` absolute.
12. **Enquiry service endpoint** for the contact form.

## What was verified

### Automated checks

These ran in headless Chrome against the production build on 18 October 2026. 46 of the 46 scripted checks passed.

**Layout (360 px, 768 px, 1440 px)**
- No horizontal overflow, overlapping text blocks, broken images, failed requests or console errors.

**Prices**
- Standard shows 1,600 and Deluxe shows 1,700 in the room panels, the room dialog, the enquiry options, the price
  hint and the prepared enquiry text. No other price appears.

**Contact and content**
- Call links to `tel:+9779856031094`. No WhatsApp link appears.
- The location map loads.
- Both platform ratings show their scale, review count and date checked.
- The guest view shows no editor notes; `?preview` shows them.

**Video**
- Video and poster URLs return 200.
- Videos stay muted, loop, and decode no audio.
- Pause and play work, and a manual pause is respected.
- Videos pause off-screen, when the tab is hidden, and while a dialog is open.
- No two copies of the same clip ever played at once.
- With autoplay blocked (simulated), the poster and a Play button show, and manual play works.

**Keyboard and focus (scripted)**
- The skip link works.
- The menu, room dialog and lightbox all trap focus, close on Escape and return focus to the trigger.
- Arrow-key navigation works in the lightbox.

**Forms and filters**
- Enquiry validation, including past dates, invalid contact details and check-out before check-in.
- The honest "not connected" result and the copy button.
- Gallery filters.

### Not yet done

- Manual screen-reader testing (for example NVDA or VoiceOver).
- Testing on real phones and Safari.
- A manual colour-contrast audit.
