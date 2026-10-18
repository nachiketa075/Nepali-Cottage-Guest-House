import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Maximize2, Play } from 'lucide-react'
import { gallery, galleryCategories } from '../data/media.js'
import { cn } from '../lib/cn.js'
import { ResponsiveImage } from './ui/ResponsiveImage.jsx'
import { ManagedVideo } from './ui/ManagedVideo.jsx'
import { SectionHeading } from './ui/SectionHeading.jsx'
import { Lightbox } from './Lightbox.jsx'

const isPortrait = (item) => item.height > item.width
const isVideo = (item) => item.type === 'video'

/**
 * Tile sizes. Phones/tablets use 2 columns, large screens 6 (a standard tile is 2).
 *  - featured photo: 2×2 on phones, 4 columns × 2 rows on desktop
 *  - portrait photo: 2 rows tall
 *  - video: full width on phones, half width on desktop, always 16:9
 *  - photos left over at the end of a desktop row widen to fill it (3 + 3)
 */
function layout(items, filtered) {
  const photos = items.filter((i) => !isVideo(i) && !(i.featured && !filtered) && !isPortrait(i))
  // Each featured tile after the first sits beside two stacked standard tiles.
  const featuredCount = filtered ? 0 : items.filter((i) => i.featured).length
  const rowPhotos = photos.slice(Math.max(0, featuredCount - 1) * 2)
  const leftover = rowPhotos.length % 3
  // Fill the last rows: 2 left over → two half-width tiles; 1 left over → four half-width tiles (two rows).
  const widenCount = leftover === 2 ? 2 : leftover === 1 ? (rowPhotos.length >= 4 ? 4 : 1) : 0
  const widen = new Set(widenCount ? rowPhotos.slice(-widenCount) : [])
  return items.map((item) => {
    if (isVideo(item)) return { item, cls: 'col-span-2 lg:col-span-3', aspect: 'aspect-video' }
    if (item.featured && !filtered) return { item, cls: 'col-span-2 row-span-2 lg:col-span-4', aspect: 'aspect-[4/3]', featured: true }
    if (isPortrait(item)) return { item, cls: 'row-span-2 lg:col-span-2', aspect: 'aspect-[3/4]' }
    return { item, cls: widen.has(item) ? 'lg:col-span-3' : 'lg:col-span-2', aspect: 'aspect-[4/3]' }
  })
}

export function Gallery() {
  // Filters only for categories that actually have media.
  const categories = useMemo(
    () => galleryCategories.filter((c) => gallery.some((item) => item.category === c.id)),
    [],
  )
  const [filter, setFilter] = useState('all')
  const [openIndex, setOpenIndex] = useState(null)
  const items = filter === 'all' ? gallery : gallery.filter((item) => item.category === filter)
  const tiles = layout(items, filter !== 'all')
  const videoCount = items.filter(isVideo).length
  const photoCount = items.length - videoCount

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="py-20 md:py-28 lg:py-32">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="gallery-title" eyebrow="Gallery" title="A look around the guest house." />
          {categories.length > 1 && (
            <div role="group" aria-label="Filter gallery" className="flex flex-wrap gap-2">
              {[{ id: 'all', label: 'All' }, ...categories].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={filter === c.id}
                  onClick={() => setFilter(c.id)}
                  className={cn(
                    'min-h-11 rounded-full border px-5 text-[0.76rem] font-semibold uppercase tracking-[0.14em] transition-colors duration-300',
                    filter === c.id ? 'border-forest bg-forest text-ivory' : 'border-line-strong text-ink hover:border-forest',
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="sr-only" aria-live="polite">
          {`Showing ${photoCount} photo${photoCount === 1 ? '' : 's'}${videoCount ? ` and ${videoCount} video${videoCount === 1 ? '' : 's'}` : ''}`}
        </p>

        <motion.ul
          layout
          className={cn(
            'mt-12 grid grid-flow-dense grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-6 lg:gap-5',
            filter !== 'all' && 'items-start',
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {tiles.map(({ item, cls, aspect, featured }, i) => (
              <motion.li
                key={item.src}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={cn('relative', cls)}
              >
                <GalleryTile item={item} aspect={aspect} featured={featured} onOpen={() => setOpenIndex(i)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <Lightbox items={items} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </section>
  )
}

const zoom =
  'transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100'

export function GalleryTile({ item, aspect, featured, onOpen }) {
  const video = isVideo(item)
  return (
    <div className={cn('group relative h-full w-full overflow-hidden rounded-md bg-line', aspect)}>
      {video ? (
        // The zoom is applied to the <video> only, so the tile's pause/play button
        // stays above the larger "open" button (no transformed parent).
        <ManagedVideo
          video={item}
          decorative
          variant="corner"
          fill
          videoClassName={zoom}
          controlClassName="bottom-auto right-3 top-3"
        />
      ) : (
        <div className="absolute inset-0">
          <ResponsiveImage
            image={item}
            alt=""
            sizes={featured ? '(min-width: 1024px) 62vw, 100vw' : '(min-width: 1024px) 31vw, 50vw'}
            className="h-full"
            imgClassName={zoom}
          />
        </div>
      )}
      <button
        type="button"
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-label={`Open ${video ? 'video' : 'photo'}: ${item.caption}`}
        className="absolute inset-0 z-[5] flex items-end text-left"
      >
        <span
          aria-hidden="true"
          className="flex w-full items-end justify-between gap-3 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10 text-sm text-ivory opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100 sm:p-4 sm:pt-12"
        >
          <span className="hidden sm:block">{item.caption}</span>
          <Maximize2 className="size-4 shrink-0" strokeWidth={1.75} />
        </span>
      </button>
      {video && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-3 z-[6] inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ivory"
        >
          <Play className="size-3" strokeWidth={2} />
          Video
        </span>
      )}
    </div>
  )
}
