import { ArrowUpRight } from 'lucide-react'
import { ratings, reviews } from '../data/property.js'
import { Placeholder } from './ui/Placeholder.jsx'
import { Reveal } from './ui/Reveal.jsx'
import { SectionHeading } from './ui/SectionHeading.jsx'

/**
 * Platform ratings (each shown on its own scale, with review count, link and date
 * checked — never combined) and, if supplied, genuine guest reviews.
 * The section is hidden when neither exists.
 */
export function Reviews() {
  if (!ratings.length && !reviews.length) {
    return (
      <div className="shell pb-6">
        <Placeholder title="Guest reviews">
          <p>
            Hidden until platform ratings or genuine reviews (with permission and source) are added in{' '}
            <code>src/data/property.js</code>.
          </p>
        </Placeholder>
      </div>
    )
  }

  return (
    <section aria-labelledby="reviews-title" className="border-t border-line bg-paper py-20 md:py-28">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeading id="reviews-title" eyebrow="Guest ratings" title="What guests say, in numbers." className="lg:col-span-6" />
          {ratings.length > 0 && (
            <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-6">
              {ratings.map((r, i) => (
                <Reveal as="li" key={r.platform} delay={i * 0.08}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full flex-col rounded-lg border border-line bg-ivory p-6 transition-colors hover:border-forest/40"
                  >
                    <span className="flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink-soft">
                      {r.platform}
                      <ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                    <span className="mt-4 flex items-baseline gap-1.5">
                      <span className="font-serif text-[3rem] leading-none text-ink">{r.score}</span>
                      <span className="text-ink-soft">/ {r.scale}</span>
                    </span>
                    <span className="mt-2 text-sm text-ink-soft">
                      From {r.count.toLocaleString('en-US')} reviews · checked {r.checked}
                    </span>
                    <span className="sr-only">(opens {r.platform} in a new tab)</span>
                  </a>
                </Reveal>
              ))}
            </ul>
          )}
        </div>

        {reviews.length > 0 && (
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
                        <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                          via {r.source}
                          <span className="sr-only"> (opens in a new tab)</span>
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
        )}
      </div>
    </section>
  )
}
