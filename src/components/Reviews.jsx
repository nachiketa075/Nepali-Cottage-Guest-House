import { ArrowUpRight } from 'lucide-react'
import { reviews } from '../data/property.js'
import { Placeholder } from './ui/Placeholder.jsx'
import { Reveal } from './ui/Reveal.jsx'
import { SectionHeading } from './ui/SectionHeading.jsx'

/**
 * Renders only genuine reviews supplied in src/data/property.js.
 * With none supplied, nothing is shown to visitors (a note appears in preview mode).
 */
export function Reviews() {
  if (!reviews.length) {
    return (
      <div className="shell pb-6">
        <Placeholder title="Guest reviews">
          <p>
            The reviews section is hidden until genuine reviews are added to <code>reviews</code> in{' '}
            <code>src/data/property.js</code> — quote text verbatim and name the source (for example, the booking
            platform) with a link.
          </p>
        </Placeholder>
      </div>
    )
  }

  return (
    <section aria-labelledby="reviews-title" className="border-t border-line bg-paper py-20 md:py-28">
      <div className="shell">
        <SectionHeading id="reviews-title" eyebrow="Guest reviews" title="In our guests’ words." />
        <ul className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal as="li" key={`${r.author}-${i}`} delay={i * 0.06}>
              <figure className="flex h-full flex-col border-t border-line-strong pt-8">
                <span aria-hidden="true" className="font-serif text-6xl leading-none text-gold">
                  “
                </span>
                <blockquote className="mt-2 flex-1 font-serif text-[1.45rem] leading-snug">
                  <p>{r.quote}</p>
                </blockquote>
                <figcaption className="mt-6 text-sm text-ink-soft">
                  <span className="font-semibold text-ink">{r.author}</span>
                  {r.date && <span> · {r.date}</span>}
                  <span className="block">
                    {r.sourceUrl ? (
                      <a
                        href={r.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 underline decoration-line-strong underline-offset-4 hover:decoration-forest"
                      >
                        via {r.source}
                        <ArrowUpRight aria-hidden="true" className="size-3.5" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ) : (
                      <>via {r.source}</>
                    )}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
