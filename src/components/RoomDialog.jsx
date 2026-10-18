import { useEffect, useState } from 'react'
import { ArrowRight, X } from 'lucide-react'
import { property, roomFeatures } from '../data/property.js'
import { useEnquiry } from '../lib/EnquiryContext.jsx'
import { Button } from './ui/Button.jsx'
import { Dialog } from './ui/Dialog.jsx'
import { ResponsiveImage } from './ui/ResponsiveImage.jsx'
import { ManagedVideo } from './ui/ManagedVideo.jsx'
import { FeatureList, RoomFacts, RoomRate } from './RoomFacts.jsx'

/**
 * Room category details. Category-specific photos/videos appear only once they are
 * confirmed in property.js; until then the media column is a typographic panel,
 * so no photo is implied to belong to a category.
 */
export function RoomDialog({ room, onClose }) {
  const { startEnquiry } = useEnquiry()
  // Keep the last room rendered while the closing animation runs.
  const [shown, setShown] = useState(room)
  useEffect(() => {
    if (room) setShown(room)
  }, [room])
  const r = room ?? shown
  const media = r ? [...(r.videos ?? []), ...(r.photos ?? [])] : []
  const cover = media[0]

  return (
    <Dialog open={Boolean(room)} onClose={onClose} labelledBy="room-dialog-title">
      {r && (
        <div className="relative grid lg:grid-cols-[1fr_1.15fr]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-ivory text-ink shadow-sm transition-colors hover:bg-ivory-deep"
          >
            <X aria-hidden="true" className="size-5" strokeWidth={1.5} />
            <span className="sr-only">Close room details</span>
          </button>

          {cover ? (
            <div className="bg-forest-deep">
              {cover.type === 'video' ? (
                <ManagedVideo video={cover} eager className="aspect-[4/3] h-full" />
              ) : (
                <ResponsiveImage image={cover} sizes="(min-width: 1024px) 34rem, 100vw" className="aspect-[4/3] h-full" />
              )}
            </div>
          ) : (
            <div className="on-dark flex flex-col justify-end bg-forest p-7 pt-16 text-ivory sm:p-10 sm:pt-20">
              <p className="eyebrow">{property.shortName}</p>
              <p className="mt-4 font-serif text-[2.6rem] leading-[1.02]">{r.name}</p>
              <p className="mt-4 max-w-xs text-sm text-ivory/70">
                Photos and walk-throughs of the rooms are in the Rooms section and gallery.
              </p>
            </div>
          )}

          <div className="p-6 sm:p-8 lg:p-10">
            <h2 id="room-dialog-title" className="pr-10 text-h3">
              {r.name}
            </h2>
            <p className="mt-3 text-ink-soft">{r.description}</p>
            <RoomRate room={r} className="mt-7 border-t border-line pt-6" />
            <RoomFacts room={r} className="mt-6" />
            <FeatureList items={r.amenities} title="This category" className="mt-6" />
            <FeatureList items={roomFeatures} title="In the rooms" className="mt-7" />
            <div className="mt-9 border-t border-line pt-7">
              <Button
                className="w-full"
                onClick={() => {
                  onClose()
                  startEnquiry({ roomId: r.id })
                }}
              >
                Enquire about the {r.name}
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
