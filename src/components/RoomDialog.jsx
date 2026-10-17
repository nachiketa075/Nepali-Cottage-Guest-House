import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Play, X } from 'lucide-react'
import { useEnquiry } from '../lib/EnquiryContext.jsx'
import { cn } from '../lib/cn.js'
import { Button } from './ui/Button.jsx'
import { Dialog } from './ui/Dialog.jsx'
import { ResponsiveImage } from './ui/ResponsiveImage.jsx'
import { ManagedVideo } from './ui/ManagedVideo.jsx'
import { RoomAmenities, RoomFacts, SampleTag, SeenInPhotos } from './RoomFacts.jsx'

export function RoomDialog({ room, onClose }) {
  const { startEnquiry } = useEnquiry()
  const [current, setCurrent] = useState(0)
  // Keep the last room rendered while the closing animation runs.
  const [shown, setShown] = useState(room)
  useEffect(() => {
    if (room) {
      setShown(room)
      setCurrent(0)
    }
  }, [room])

  const r = room ?? shown
  const media = r ? [...r.photos, ...(r.videos ?? [])] : []
  const count = media.length
  const item = media[current]

  const onKeyDown = (e) => {
    if (count < 2 || e.target.closest('input, textarea, select')) return
    if (e.key === 'ArrowRight') setCurrent((i) => (i + 1) % count)
    if (e.key === 'ArrowLeft') setCurrent((i) => (i - 1 + count) % count)
  }

  return (
    <Dialog open={Boolean(room)} onClose={onClose} labelledBy="room-dialog-title" onKeyDown={onKeyDown}>
      {r && (
        <div className="relative grid lg:grid-cols-[1.45fr_1fr]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-ivory text-ink shadow-sm transition-colors hover:bg-ivory-deep"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
            <span className="sr-only">Close room details</span>
          </button>
          <div className="bg-forest-deep lg:sticky lg:top-0 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={current}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {item?.type === 'video' ? (
                    <ManagedVideo video={item} eager className="h-full" />
                  ) : (
                    <ResponsiveImage image={item} sizes="(min-width: 1024px) 40rem, 100vw" className="h-full" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            {count > 1 && (
              <ul className="flex gap-2 p-3" aria-label="Room photos and video">
                {media.map((p, i) => (
                  <li key={p.src}>
                    <button
                      type="button"
                      onClick={() => setCurrent(i)}
                      aria-current={i === current ? 'true' : undefined}
                      aria-label={`Show ${p.type === 'video' ? 'video' : 'photo'} ${i + 1} of ${count}`}
                      className={cn(
                        'on-dark block w-20 overflow-hidden rounded-sm border-2 transition-opacity sm:w-24',
                        i === current ? 'border-gold-soft opacity-100' : 'border-transparent opacity-60 hover:opacity-100',
                      )}
                    >
                      <span className="relative block">
                        <ResponsiveImage image={p.type === 'video' ? p.poster : p} alt="" sizes="96px" className="aspect-[4/3]" />
                        {p.type === 'video' && (
                          <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-ivory">
                            <Play aria-hidden="true" className="size-4" strokeWidth={2} />
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="sr-only" aria-live="polite">
              {item?.alt}
            </p>
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10">
            {r.demo && <SampleTag />}
            <h2 id="room-dialog-title" className="mt-3 pr-10 text-h3">
              {r.name}
            </h2>
            <p className="mt-4 text-ink-soft">{r.description}</p>
            <RoomFacts room={r} className="mt-7" />
            <RoomAmenities items={r.amenities} className="mt-7" />
            <SeenInPhotos items={r.seenInPhotos} className="mt-7" />
            <div className="mt-9 border-t border-line pt-7">
              <Button
                className="w-full"
                onClick={() => {
                  onClose()
                  startEnquiry({ roomId: r.id })
                }}
              >
                Enquire about {r.name}
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </Button>
              <p className="mt-3 text-center text-sm text-ink-soft">An enquiry is not a confirmed reservation.</p>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  )
}
