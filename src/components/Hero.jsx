import { motion } from 'motion/react'
import { property } from '../data/property.js'
import { scrollToSection } from '../lib/sections.js'
import { Button } from './ui/Button.jsx'
import { HeroMedia } from './HeroMedia.jsx'

const rise = (delay) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay },
})

export function Hero() {
  const go = (e, id) => {
    e.preventDefault()
    scrollToSection(id)
  }

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="on-dark relative isolate flex min-h-[max(100svh,36rem)] items-end overflow-hidden bg-forest-deep text-ivory md:min-h-[max(100svh,44rem)]"
    >
      <HeroMedia />
      {/* Legibility: a soft shade low and to the left where the copy sits; the rest stays clear */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(12,22,17,0.78)_0%,rgba(12,22,17,0.38)_34%,rgba(12,22,17,0)_62%),linear-gradient(to_bottom,rgba(12,22,17,0.32)_0%,rgba(12,22,17,0)_22%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(12,22,17,0.42)_0%,rgba(12,22,17,0)_55%)] md:block"
      />
      <div className="shell relative w-full pb-14 pt-32 md:pb-40 lg:pb-44">
        <motion.p className="eyebrow text-ivory/90!" {...rise(0.15)}>
          Welcome to
        </motion.p>
        <motion.h1 id="hero-title" className="mt-5 max-w-[15ch] text-display [text-shadow:0_1px_24px_rgba(0,0,0,0.18)]" {...rise(0.25)}>
          {property.name}
        </motion.h1>
        <motion.p className="mt-5 max-w-[34rem] text-lead text-ivory/90" {...rise(0.4)}>
          {property.heroHeadline}
        </motion.p>
        <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" {...rise(0.55)}>
          <Button href="#rooms" variant="light" onClick={(e) => go(e, 'rooms')}>
            Explore Rooms
          </Button>
          <Button href="#contact" variant="ghostLight" onClick={(e) => go(e, 'contact')}>
            Enquire About Your Stay
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
