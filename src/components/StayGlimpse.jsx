import { ArrowRight } from 'lucide-react'
import { amenities } from '../data/property.js'
import { videos } from '../data/media.js'
import { scrollToSection } from '../lib/sections.js'
import { Button } from './ui/Button.jsx'
import { Icon } from './ui/Icon.jsx'
import { ManagedVideo } from './ui/ManagedVideo.jsx'
import { Placeholder } from './ui/Placeholder.jsx'
import { Reveal } from './ui/Reveal.jsx'

const feature = videos.roomTwoWalkthrough

/**
 * The site's one forest-green feature band: a silent room walk-through,
 * followed by the property features confirmed from the photos and footage.
 */
export function StayGlimpse() {
  const confirmed = amenities.filter((a) => a.confirmed)
  const pending = amenities.filter((a) => !a.confirmed)

  return (
    <section id="glimpse" aria-labelledby="glimpse-title" className="on-dark relative bg-forest py-20 text-ivory md:py-28 lg:py-32">
      <div className="shell">
        <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-7">
            <figure>
              <ManagedVideo
                video={feature}
                className="aspect-video rounded-md bg-forest-deep ring-1 ring-ivory/10"
              />
              <figcaption className="mt-4 flex items-center gap-3 text-sm text-ivory/70">
                <span aria-hidden="true" className="h-px w-6 bg-gold-soft/70" />
                {feature.caption}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5 lg:pb-12 xl:pl-6">
            <p className="eyebrow">A glimpse of your stay</p>
            <h2 id="glimpse-title" className="mt-4 text-h2">
              Step inside before you arrive.
            </h2>
            <p className="mt-5 text-lead text-ivory/80">
              Short, silent walk-throughs filmed in two of the guest rooms.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button
                href="#rooms"
                variant="light"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('rooms')
                }}
              >
                View the rooms
              </Button>
              <a
                href="#gallery"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('gallery')
                }}
                className="inline-flex min-h-11 items-center gap-2 border-b border-ivory/30 text-[0.8rem] font-semibold uppercase tracking-[0.12em] transition-colors hover:border-ivory"
              >
                More in the gallery
                <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
              </a>
            </div>
          </Reveal>
        </div>

        {confirmed.length > 0 && (
          <div className="mt-20 border-t border-ivory/15 pt-12 md:mt-24">
            <div className="grid gap-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-4">
                <h3 className="font-serif text-[2rem] leading-tight">At the guest house</h3>
                <p className="mt-3 max-w-xs text-[0.95rem] text-ivory/70">As seen in the photographs and footage.</p>
              </Reveal>
              <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-3 lg:col-span-8">
                {confirmed.map((a, i) => (
                  <Reveal as="li" key={a.title} delay={i * 0.06}>
                    <Icon name={a.icon} className="size-7 text-gold-soft" />
                    <h4 className="mt-4 font-serif text-[1.55rem] leading-tight">{a.title}</h4>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ivory/72">{a.text}</p>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        )}

        {pending.length > 0 && (
          <Placeholder title="Amenities awaiting confirmation" tone="dark" className="mt-12">
            <p>
              Hidden from guests until marked <code>confirmed: true</code> in <code>src/data/property.js</code>:
            </p>
            <ul className="grid gap-x-8 gap-y-2 pt-1 sm:grid-cols-2 lg:grid-cols-3">
              {pending.map((a) => (
                <li key={a.title} className="flex gap-3">
                  <Icon name={a.icon} className="mt-0.5 size-4 shrink-0 text-gold-soft" />
                  <span>
                    <strong className="font-semibold text-ivory">{a.title}</strong> — {a.text}
                  </span>
                </li>
              ))}
            </ul>
          </Placeholder>
        )}
      </div>
    </section>
  )
}
