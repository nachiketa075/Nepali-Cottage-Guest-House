import { isPreview } from '../../lib/preview.js'
import { cn } from '../../lib/cn.js'

/**
 * A clearly marked note about missing property information.
 * Rendered only in editor preview (see src/lib/preview.js) — never shown to guests.
 */
export function Placeholder({ title, children, tone = 'light', className }) {
  if (!isPreview) return null
  return (
    <div
      role="note"
      className={cn(
        'rounded-md border border-dashed p-4 text-sm leading-relaxed sm:p-5',
        tone === 'dark' ? 'border-gold-soft/60 bg-ivory/5 text-ivory/85' : 'border-gold-ink/50 bg-gold-soft/15 text-ink-soft',
        className,
      )}
    >
      <p
        className={cn(
          'mb-1.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em]',
          tone === 'dark' ? 'text-gold-soft' : 'text-gold-ink',
        )}
      >
        Placeholder · {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
