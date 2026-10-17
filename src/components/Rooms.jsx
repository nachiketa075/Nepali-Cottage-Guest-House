import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { rooms } from '../data/property.js'
import { useEnquiry } from '../lib/EnquiryContext.jsx'
import { cn } from '../lib/cn.js'
import { Button } from './ui/Button.jsx'
import { Placeholder } from './ui/Placeholder.jsx'
import { Reveal } from './ui/Reveal.jsx'
import { ResponsiveImage } from './ui/ResponsiveImage.jsx'
import { ManagedVideo } from './ui/ManagedVideo.jsx'
import { SectionHeading } from './ui/SectionHeading.jsx'
import { RoomAmenities, RoomFacts, SampleTag, SeenInPhotos } from './RoomFacts.jsx'
import { RoomDialog } from './RoomDialog.jsx'

export function Rooms() {
  const [openId, setOpenId] = useState(null)
  const openRoom = rooms.find((r) => r.id === openId) ?? null
  const hasDemo = rooms.some((r) => r.demo)

  return (
    <section id="rooms" aria-labelledby="rooms-title" className="border-t border-line bg-ivory-deep/60 py-20 md:py-28 lg:py-36">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="rooms-title" eyebrow="Rooms" title="Rest well, then step out into the garden." className="lg:col-span-7">
            Every photograph is of the guest house itself. For rates and availability, send an enquiry with your dates.
          </SectionHeading>
          {hasDemo && (
            <Placeholder title="Room details" className="lg:col-span-5">
              <p>
                Room names, guest capacity, bed set-ups and rates are not confirmed yet. Edit <code>rooms</code> in{' '}
                <code>src/data/property.js</code> and set <code>demo: false</code> on each room.
              </p>
            </Placeholder>
          )}
        </div>

        <ol className="mt-16 space-y-20 md:mt-20 md:space-y-28">
          {rooms.map((room, i) => (
            <li key={room.id}>
              <RoomShowcase room={room} index={i} onOpen={() => setOpenId(room.id)} />
            </li>
          ))}
        </ol>
      </div>
      <RoomDialog room={openRoom} onClose={() => setOpenId(null)} />
    </section>
  )
}

const zoom =
  'transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-[1.035] motion-reduce:transition-none motion-reduce:group-hover:scale-100'

function RoomShowcase({ room, index, onOpen }) {
  const { startEnquiry } = useEnquiry()
  const flip = index % 2 === 1
  const titleId = `${room.id}-title`
  const coverVideo = room.videos?.[0]

  return (
    <article aria-labelledby={titleId} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <Reveal className={cn('lg:col-span-7', flip && 'lg:order-2 lg:col-start-6')}>
        {/* One cover per room: its walk-through video if it has one, otherwise its first photo.
            All photos and videos stay available in the "View room" dialog. */}
        <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-md bg-line">
          {coverVideo ? (
            <ManagedVideo video={coverVideo} fill decorative variant="corner" videoClassName={zoom} />
          ) : (
            <ResponsiveImage image={room.photos[0]} sizes="(min-width: 1024px) 56vw, 100vw" className="h-full" imgClassName={zoom} />
          )}
          {/* Mouse/touch shortcut to open the room; keyboard users use the "View room" button */}
          <div aria-hidden="true" onClick={onOpen} className="absolute inset-0 z-[5] cursor-pointer" />
        </div>
      </Reveal>

      <Reveal delay={0.08} className={cn('lg:col-span-5', flip && 'lg:order-1 lg:col-start-1')}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-serif text-lg italic text-gold-ink">{String(index + 1).padStart(2, '0')}</span>
          {room.demo && <SampleTag />}
        </div>
        <h3 id={titleId} className="mt-3 text-h3">
          {room.name}
        </h3>
        <p className="mt-4 text-lead text-ink-soft">{room.description}</p>
        <RoomFacts room={room} className="mt-8" />
        <RoomAmenities items={room.amenities} className="mt-7" />
        <SeenInPhotos items={room.seenInPhotos} className="mt-7" />
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button onClick={onOpen} aria-haspopup="dialog">
            View room
          </Button>
          <Button variant="quiet" href="#contact" onClick={(e) => (e.preventDefault(), startEnquiry({ roomId: room.id }))}>
            Enquire about this room
            <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
      </Reveal>
    </article>
  )
}
