import { MapPin, Navigation } from 'lucide-react'
import { location, property } from '../data/property.js'
import { isPreview } from '../lib/preview.js'
import { directionsUrl } from '../lib/contact.js'
import { Button } from './ui/Button.jsx'
import { Placeholder } from './ui/Placeholder.jsx'
import { Reveal } from './ui/Reveal.jsx'
import { SectionHeading } from './ui/SectionHeading.jsx'

/** Shown once a verified address is supplied (or as a placeholder in preview mode). */
export function Location() {
  const hasAddress = Boolean(location.address?.length)
  if (!hasAddress && !isPreview) return null
  const directions = hasAddress ? directionsUrl() : null

  return (
    <section id="location" aria-labelledby="location-title" className="border-t border-line bg-ivory-deep/60 py-20 md:py-28">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading id="location-title" eyebrow="Location" title="Finding the guest house." />

          {hasAddress ? (
            <Reveal delay={0.1} className="mt-8">
              <address className="flex gap-4 not-italic">
                <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-gold-ink" strokeWidth={1.5} />
                <span className="text-lead">
                  {property.name}
                  {location.address.map((line) => (
                    <span key={line} className="block text-ink-soft">
                      {line}
                    </span>
                  ))}
                </span>
              </address>
              {location.notes && <p className="mt-6 text-ink-soft">{location.notes}</p>}
              {directions && (
                <Button href={directions} target="_blank" rel="noopener noreferrer" className="mt-8">
                  <Navigation aria-hidden="true" className="size-4" strokeWidth={1.75} />
                  Get directions
                  <span className="sr-only">(opens maps in a new tab)</span>
                </Button>
              )}
              {location.nearby.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">Nearby</h3>
                  <dl className="mt-4 divide-y divide-line border-y border-line">
                    {location.nearby.map((n) => (
                      <div key={n.name} className="flex items-baseline justify-between gap-6 py-3.5">
                        <dt>
                          {n.name}
                          {n.note && <span className="block text-sm text-ink-soft">{n.note}</span>}
                        </dt>
                        <dd className="shrink-0 tabular-nums text-ink-soft">{n.distance}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </Reveal>
          ) : (
            <Placeholder title="Address & map" className="mt-8">
              <p>
                No location has been assumed. Add the verified <code>address</code>, an optional Google Maps{' '}
                <code>mapEmbedUrl</code> and <code>coordinates</code> to <code>location</code> in{' '}
                <code>src/data/property.js</code>. The directions button, map and nearby places (with verified distances)
                appear automatically.
              </p>
              <p>While the address is empty and preview mode is off, this section and its menu link are hidden.</p>
            </Placeholder>
          )}
        </div>

        <Reveal delay={0.12} className="lg:col-span-7">
          {location.mapEmbedUrl ? (
            <div className="overflow-hidden rounded-md border border-line">
              <iframe
                src={location.mapEmbedUrl}
                title={`Map showing the location of ${property.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block aspect-[4/3] w-full border-0 lg:aspect-[16/11]"
              />
            </div>
          ) : (
            isPreview && (
              <div className="flex aspect-[4/3] items-center justify-center rounded-md border border-dashed border-gold-ink/50 bg-gold-soft/10 p-6 text-center text-sm text-ink-soft lg:aspect-[16/11]">
                <p>
                  <span className="mb-1 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gold-ink">
                    Placeholder · Map
                  </span>
                  The embedded map appears here once <code>mapEmbedUrl</code> is set.
                </p>
              </div>
            )
          )}
        </Reveal>
      </div>
    </section>
  )
}
