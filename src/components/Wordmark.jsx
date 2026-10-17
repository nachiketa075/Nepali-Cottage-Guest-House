import { property } from '../data/property.js'
import { cn } from '../lib/cn.js'

export function Wordmark({ className, size = 'md' }) {
  return (
    <span className={cn('flex flex-col leading-none', className)}>
      <span className={cn('font-serif font-medium tracking-[-0.01em]', size === 'lg' ? 'text-4xl' : 'text-[1.6rem] md:text-[1.85rem]')}>
        {property.shortName}
      </span>
      <span className="mt-1 pl-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.36em] opacity-80">
        {property.descriptor}
      </span>
    </span>
  )
}
