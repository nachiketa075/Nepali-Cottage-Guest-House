import { cn } from '../../lib/cn.js'
import { Reveal } from './Reveal.jsx'

export function SectionHeading({ id, eyebrow, title, children, align = 'left', className }) {
  return (
    <Reveal className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="mt-4 text-h2">
        {title}
      </h2>
      {children && <div className="mt-5 text-lead text-ink-soft [.on-dark_&]:text-ivory/80">{children}</div>}
    </Reveal>
  )
}
