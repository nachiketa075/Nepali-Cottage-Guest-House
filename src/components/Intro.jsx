import { property } from '../data/property.js'
import { photos } from '../data/media.js'
import { Reveal } from './ui/Reveal.jsx'
import { ResponsiveImage } from './ui/ResponsiveImage.jsx'

export function Intro() {
  const { intro, highlights } = property
  return (
    <section id="about" aria-labelledby="about-title" className="py-20 md:py-28 lg:py-36">
      <div className="shell grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="relative lg:col-span-6 xl:col-span-6">
          <div className="group overflow-hidden rounded-md">
            <ResponsiveImage
              image={intro.image}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]"
              imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          {/* Small inset photo — larger screens only, to keep phones uncluttered */}
          <div className="absolute -bottom-10 -right-6 hidden w-[38%] overflow-hidden rounded-md border-[6px] border-ivory xl:block">
            <ResponsiveImage image={photos.gardenPath} sizes="20vw" className="aspect-[4/3]" />
          </div>
        </Reveal>

        <div className="lg:col-span-5 lg:col-start-8">
          <Reveal>
            <p className="eyebrow">{intro.eyebrow}</p>
            <h2 id="about-title" className="mt-4 text-h2">
              {intro.title}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-6 space-y-4 text-lead text-ink-soft">
            {intro.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          {highlights.length > 0 && (
            <Reveal delay={0.18} className="mt-10">
              <h3 className="sr-only">Highlights</h3>
              <ul className="divide-y divide-line border-y border-line">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-4 py-3.5 text-[0.98rem]">
                    <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-gold" />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  )
}
