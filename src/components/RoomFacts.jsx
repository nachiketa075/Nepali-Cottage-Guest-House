import { pricing } from '../data/property.js'
import { cn } from '../lib/cn.js'
import { isPreview } from '../lib/preview.js'
import { formatAmount, rateNeedsNote, rateNote } from '../lib/pricing.js'

/** Owner-supplied price, with an honest note until currency and basis are confirmed. */
export function RoomRate({ room, size = 'lg', className, showNote = true }) {
  const amount = formatAmount(room.rate)
  if (!amount) return <p className={cn('text-ink-soft', className)}>Contact for rates</p>
  return (
    <div className={className}>
      <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">Rate</p>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <span className={cn('font-serif leading-none text-ink', size === 'lg' ? 'text-[2.6rem]' : 'text-[2rem]')}>{amount}</span>
        {pricing.basis && <span className="text-sm text-ink-soft">{pricing.basis}</span>}
      </p>
      {showNote && rateNeedsNote && <p className="mt-2 max-w-sm text-sm leading-snug text-ink-soft">{rateNote}</p>}
    </div>
  )
}

/** Guests / beds / size: only what is known (editor preview also shows the gaps). */
export function RoomFacts({ room, className }) {
  const facts = [
    { label: 'Guests', value: room.capacity },
    { label: 'Beds', value: room.beds },
    { label: 'Size', value: room.size },
  ].filter((f) => f.value || isPreview)
  if (!facts.length) return null
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

export function FeatureList({ items, title, className, columns = 1 }) {
  if (!items?.length) return null
  return (
    <div className={className}>
      {title && <h4 className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">{title}</h4>}
      <ul className={cn('mt-3 grid gap-x-6 gap-y-2 text-[0.95rem]', columns === 2 && 'sm:grid-cols-2')}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-[0.6rem] size-1 shrink-0 rotate-45 bg-gold" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
