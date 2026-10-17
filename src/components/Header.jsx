import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { motion } from 'motion/react'
import { property } from '../data/property.js'
import { useScrolled } from '../hooks/useScrolled.js'
import { useActiveSection } from '../hooks/useActiveSection.js'
import { navSections, scrollToSection } from '../lib/sections.js'
import { cn } from '../lib/cn.js'
import { Button } from './ui/Button.jsx'
import { Dialog } from './ui/Dialog.jsx'
import { Wordmark } from './Wordmark.jsx'

export function Header() {
  const sections = navSections()
  const scrolled = useScrolled(32)
  const active = useActiveSection(sections.map((s) => s.id))
  const [menuOpen, setMenuOpen] = useState(false)
  const solid = scrolled

  const go = (e, id) => {
    e.preventDefault()
    scrollToSection(id)
  }

  const goFromMenu = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    // Let the dialog release the page (scroll lock) before scrolling.
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToSection(id)))
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-forest px-5 py-3 text-sm font-semibold text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-[background-color,color,border-color] duration-500',
          solid ? 'border-b border-line bg-ivory text-ink' : 'on-dark border-b border-transparent bg-transparent text-ivory',
        )}
      >
        {/* Soft scrim so the transparent header stays readable over bright footage */}
        <div
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/35 to-transparent transition-opacity duration-500',
            solid ? 'opacity-0' : 'opacity-100',
          )}
        />
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          <a href="#home" onClick={(e) => go(e, 'home')} aria-label={`${property.name} — back to top`}>
            <Wordmark />
          </a>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-3">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => go(e, s.id)}
                    aria-current={active === s.id ? 'location' : undefined}
                    className="group relative inline-flex min-h-11 items-center px-3 text-[0.76rem] font-semibold uppercase tracking-[0.16em]"
                  >
                    {s.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-3 bottom-2 h-px origin-left bg-gold transition-transform duration-300 ease-[var(--ease-soft)]',
                        active === s.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <Button href="#contact" onClick={(e) => go(e, 'contact')} variant={solid ? 'primary' : 'light'}>
                Enquire About Your Stay
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full lg:hidden"
            >
              <Menu aria-hidden="true" strokeWidth={1.5} className="size-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </div>
        </div>
      </header>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} label="Site menu" variant="sheet">
        <div id="mobile-menu" className="shell flex min-h-full flex-col pb-10">
          <div className="flex h-16 items-center justify-between md:h-20">
            <Wordmark />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-full"
            >
              <X aria-hidden="true" strokeWidth={1.5} className="size-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Main" className="mt-6 flex-1">
            <ul className="divide-y divide-line border-y border-line">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => goFromMenu(e, s.id)}
                    aria-current={active === s.id ? 'location' : undefined}
                    className="flex min-h-14 items-center justify-between py-3 font-serif text-[2rem] leading-tight aria-[current]:text-forest"
                  >
                    {s.label}
                    {active === s.id && <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />}
                  </a>
                </motion.li>
              ))}
            </ul>
          </nav>
          <Button href="#contact" onClick={(e) => goFromMenu(e, 'contact')} className="mt-10 w-full">
            Enquire About Your Stay
          </Button>
          <p className="mt-4 text-center text-sm text-ink-soft">Enquiries only — not a confirmed booking.</p>
        </div>
      </Dialog>
    </>
  )
}
