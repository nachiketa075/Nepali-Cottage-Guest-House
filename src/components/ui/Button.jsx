import { cn } from '../../lib/cn.js'

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[0.82rem] font-semibold uppercase tracking-[0.12em] transition-[background-color,color,border-color,transform] duration-300 ease-[var(--ease-soft)] active:translate-y-px disabled:pointer-events-none disabled:opacity-60'

const variants = {
  primary: 'bg-forest text-ivory hover:bg-forest-soft',
  outline: 'border border-ink/25 text-ink hover:border-forest hover:bg-forest hover:text-ivory',
  light: 'bg-ivory text-forest-deep hover:bg-gold-soft',
  ghostLight: 'border border-ivory/55 text-ivory hover:border-ivory hover:bg-ivory hover:text-forest-deep',
  quiet: 'px-0 py-1 min-h-0 rounded-none text-forest border-b border-forest/30 hover:border-forest',
}

/** Renders an <a> when `href` is given, otherwise a <button>. */
export function Button({ href, variant = 'primary', className, children, ...props }) {
  const classes = cn(base, variants[variant], className)
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
