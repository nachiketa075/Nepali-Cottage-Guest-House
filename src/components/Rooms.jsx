import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { roomFeatures, rooms } from '../data/property.js'
import { roomMedia } from '../data/media.js'
import { useEnquiry } from '../lib/EnquiryContext.jsx'
import { cn } from '../lib/cn.js'
import { Button } from './ui/Button.jsx'
import { Placeholder } from './ui/Placeholder.jsx'
import { Reveal } from './ui/Reveal.jsx'
import { SectionHeading } from './ui/SectionHeading.jsx'
import { FeatureList, RoomFacts, RoomRate } from './RoomFacts.jsx'
import { RoomDialog } from './RoomDialog.jsx'
import { GalleryTile } from './Gallery.jsx'
import { Lightbox } from './Lightbox.jsx'

export function Rooms() {
  const [openId, setOpenId] = useState(null)
  const openRoom = rooms.find((r) => r.id === openId) ?? null

  return (
    <section id="rooms" aria-labelledby="rooms-title" className="border-t border-line bg-ivory-deep/60 py-20 md:py-28 lg:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="rooms-title" eyebrow="Rooms" title="Two room categories, one garden." className="lg:col-span-7">
            Rates are set by the guest house. Send an enquiry with your dates and they will confirm availability.
          </SectionHeading>
          <Placeholder title="Room details" className="lg:col-span-5">
            <p>
              Still to confirm per category: currency and rate basis, guests, beds, size, and which current photos and
              videos show which category. See <code>docs/research-notes.md</code>.
            </p>
          </Placeholder>
        </div>

        <ol className="mt-14 grid gap-5 md:mt-16 lg:grid-cols-2 lg:gap-8">
          {rooms.map((room, i) => (
            <Reveal as="li" key={room.id} delay={i * 0.08} className="flex">
              <RoomCategory room={room} index={i} onOpen={() => setOpenId(room.id)} />
            </Reveal>
          ))}
        </ol>

        {roomFeatures.length > 0 && (
          <Reveal className="mt-10 grid gap-6 border-y border-line py-8 md:grid-cols-12 md:items-start">
            <h3 className="font-serif text-[1.7rem] leading-tight md:col-span-4">In the rooms</h3>
            <FeatureList items={roomFeatures} columns={2} className="-mt-3 md:col-span-8" />
          </Reveal>
        )}

        <RoomMedia />
      </div>
      <RoomDialog room={openRoom} onClose={() => setOpenId(null)} />
    </section>
  )
}

function RoomCategory({ room, index, onOpen }) {
  const { startEnquiry } = useEnquiry()
  const titleId = `${room.id}-title`
  return (
    <article
      aria-labelledby={titleId}
      className="relative flex w-full flex-col overflow-hidden rounded-lg border border-line bg-paper p-7 sm:p-9 lg:p-11"
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-gold/70 via-gold-soft/60 to-transparent" />
      <p className="font-serif text-lg italic text-gold-ink">{String(index + 1).padStart(2, '0')}</p>
      <h3 id={titleId} className="mt-2 text-h3">
        {room.name}
      </h3>
      <p className="mt-3 max-w-md text-ink-soft">{room.description}</p>
      <RoomRate room={room} className="mt-8 border-t border-line pt-6" />
      <RoomFacts room={room} className="mt-6" />
      <FeatureList items={room.amenities} title="This category" className="mt-6" />
      <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-4 pt-9">
        <Button
          href="#contact"
          onClick={(e) => {
            e.preventDefault()
            startEnquiry({ roomId: room.id })
          }}
        >
          Enquire — {room.name}
        </Button>
        <Button variant="quiet" onClick={onOpen} aria-haspopup="dialog">
          Room details
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
        </Button>
      </div>
    </article>
  )
}

// Editorial layout: video + one photo, then a row of four photos.
const layout = [
  { cls: 'col-span-2 lg:col-span-7', aspect: 'aspect-video', featured: true },
  { cls: 'col-span-2 lg:col-span-5', aspect: 'aspect-[4/3] lg:aspect-auto' },
  { cls: 'lg:col-span-3', aspect: 'aspect-[4/3]' },
  { cls: 'lg:col-span-3', aspect: 'aspect-[4/3]' },
  { cls: 'lg:col-span-3', aspect: 'aspect-[4/3]' },
  { cls: 'lg:col-span-3', aspect: 'aspect-[4/3]' },
]

function RoomMedia() {
  const [openIndex, setOpenIndex] = useState(null)
  if (!roomMedia.length) return null
  return (
    <div className="mt-16 md:mt-20">
      <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Inside the rooms</p>
          <h3 className="mt-3 font-serif text-[2rem] leading-tight">Current photos and a walk-through.</h3>
        </div>
        <p className="max-w-md text-ink-soft">
          These show guest rooms as they are today. Ask which category a room belongs to when you enquire.
        </p>
      </Reveal>
      <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-12 lg:gap-5">
        {roomMedia.map((item, i) => {
          const l = layout[i] ?? { cls: 'lg:col-span-3', aspect: 'aspect-[4/3]' }
          return (
            <li key={item.src} className={cn('relative', l.cls)}>
              <GalleryTile item={item} aspect={l.aspect} featured={l.featured} onOpen={() => setOpenIndex(i)} />
            </li>
          )
        })}
      </ul>
      <Lightbox items={roomMedia} index={openIndex} onIndexChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
    </div>
  )
}
