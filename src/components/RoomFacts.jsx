import { cn } from '../lib/cn.js'
import { isPreview } from '../lib/preview.js'

/**
 * Guests / beds / rate. Guests only see facts that are known (the rate falls
 * back to "Contact for rates"); editor preview also lists what is unconfirmed.
 */
export function RoomFacts({ room, className }) {
  const facts = [
    { label: 'Guests', value: room.capacity },
    { label: 'Beds', value: room.beds },
    { label: 'Rate', value: room.rate ?? 'Contact for rates' },
  ].filter((f) => f.value || isPreview)
  return (
    <dl
      className={cn(
        'grid divide-x divide-line border-y border-line',
        facts.length === 3 ? 'grid-cols-3' : facts.length === 2 ? 'grid-cols-2' : 'grid-cols-1',
        className,
      )}
    >
      {facts.map((f) => (
        <div key={f.label} className="px-3 py-4 first:pl-0">
          <dt className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">{f.label}</dt>
          <dd className={cn('mt-1.5 text-[0.95rem] leading-snug', !f.value && 'italic text-ink-soft')}>
            {f.value ?? 'To be confirmed'}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function SeenInPhotos({ items, className }) {
  if (!items?.length) return null
  return (
    <div className={className}>
      <h4 className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">Seen in the photos &amp; video</h4>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-full border border-line-strong/70 px-3 py-1 text-sm">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function RoomAmenities({ items, className }) {
  if (!items?.length) return null
  return (
    <div className={className}>
      <h4 className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">In the room</h4>
      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[0.95rem]">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2.5">
            <span aria-hidden="true" className="size-1 rotate-45 bg-gold" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Editor-preview marker for rooms whose details are not yet confirmed. */
export function SampleTag() {
  if (!isPreview) return null
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-gold-ink/60 px-2.5 py-0.5 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-gold-ink">
      Sample listing · details to confirm
    </span>
  )
}
