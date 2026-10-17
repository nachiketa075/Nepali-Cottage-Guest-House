import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Dialog } from './ui/Dialog.jsx'
import { ResponsiveImage } from './ui/ResponsiveImage.jsx'
import { ManagedVideo } from './ui/ManagedVideo.jsx'

/** Full-screen viewer: arrow keys / swipe to move, Escape or the close button to exit. */
export function Lightbox({ items, index, onIndexChange, onClose }) {
  const open = index !== null
  const [last, setLast] = useState(0)
  useEffect(() => {
    if (open) setLast(index)
  }, [open, index])
  const i = open ? index : last
  const item = items[i]
  const count = items.length
  const touchX = useRef(null)

  const go = (delta) => onIndexChange((i + delta + count) % count)

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }

  if (!item) return null

  return (
    <Dialog open={open} onClose={onClose} variant="dark" labelledBy="lightbox-caption" onKeyDown={onKeyDown}>
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <p className="text-sm tabular-nums text-ivory/70">
          <span className="sr-only">Item </span>
          {i + 1} / {count}
        </p>
        <button
          type="button"
          onClick={onClose}
          data-autofocus
          className="inline-flex size-11 items-center justify-center rounded-full hover:bg-ivory/10"
        >
          <X aria-hidden="true" className="size-6" strokeWidth={1.5} />
          <span className="sr-only">Close gallery</span>
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.src}
            className="flex h-full w-full items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {item.type === 'video' ? (
              <ManagedVideo
                video={item}
                eager
                className="aspect-video max-h-full w-full max-w-[min(64rem,calc((100dvh-10rem)*16/9))] rounded-sm"
                videoClassName="object-contain"
              />
            ) : (
              <ResponsiveImage
                image={item}
                sizes="100vw"
                className="flex h-full w-full items-center justify-center"
                imgClassName="h-auto! w-auto! max-h-full max-w-full rounded-sm object-contain!"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 hover:bg-ivory/10 sm:inline-flex sm:left-5"
            >
              <ChevronLeft aria-hidden="true" className="size-6" strokeWidth={1.5} />
              <span className="sr-only">Previous</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/30 hover:bg-ivory/10 sm:inline-flex sm:right-5"
            >
              <ChevronRight aria-hidden="true" className="size-6" strokeWidth={1.5} />
              <span className="sr-only">Next</span>
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-6">
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ivory/30 sm:hidden"
          >
            <ChevronLeft aria-hidden="true" className="size-5" strokeWidth={1.5} />
            <span className="sr-only">Previous</span>
          </button>
        )}
        <p id="lightbox-caption" className="flex-1 text-center text-[0.95rem] text-ivory/85" aria-live="polite">
          {item.caption}
        </p>
        {count > 1 && (
          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-ivory/30 sm:hidden"
          >
            <ChevronRight aria-hidden="true" className="size-5" strokeWidth={1.5} />
            <span className="sr-only">Next</span>
          </button>
        )}
      </div>
    </Dialog>
  )
}
