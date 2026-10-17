import { ArrowUpRight } from 'lucide-react'
import { policies, property, social } from '../data/property.js'
import { verifiedContact } from '../lib/contact.js'
import { navSections, scrollToSection } from '../lib/sections.js'
import { Button } from './ui/Button.jsx'
import { Wordmark } from './Wordmark.jsx'

export function Footer() {
  const { phone, email } = verifiedContact()
  const sections = navSections()
  const heading = 'text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-soft'
  const link = 'inline-flex min-h-9 items-center text-ivory/80 transition-colors hover:text-ivory'

  return (
    <footer className="on-dark bg-forest-deep pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-16 text-ivory md:pb-12 md:pt-20">
      <div className="shell">
        <div className="flex flex-col gap-8 border-b border-ivory/15 pb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Plan your stay</p>
            <p className="mt-4 max-w-xl font-serif text-h3">Tell us your dates and who is travelling.</p>
          </div>
          <div className="shrink-0">
            <Button
              href="#contact"
              variant="light"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('contact')
              }}
            >
              Enquire About Your Stay
            </Button>
            <p className="mt-3 text-sm text-ivory/60">An enquiry is not a confirmed reservation.</p>
          </div>
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark size="lg" />
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-ivory/70">{property.summary}</p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className={heading}>Explore</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 md:grid-cols-1">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={link}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(s.id)
                    }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {(phone || email || social.length > 0) && (
            <div className="md:col-span-4">
              <h2 className={heading}>Contact</h2>
              <ul className="mt-4">
                {phone && (
                  <li>
                    <a href={`tel:${phone.tel}`} className={link}>
                      {phone.display}
                    </a>
                  </li>
                )}
                {email && (
                  <li>
                    <a href={`mailto:${email.address}`} className={link}>
                      {email.address}
                    </a>
                  </li>
                )}
                {social.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className={`${link} gap-1`}>
                      {s.label}
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ivory/15 pt-6 text-sm text-ivory/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {property.name}
          </p>
          {policies.length > 0 && (
            <ul className="flex flex-wrap gap-x-6">
              {policies.map((p) => (
                <li key={p.url}>
                  <a href={p.url} className={link}>
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  )
}
