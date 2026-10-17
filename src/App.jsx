import { MotionConfig } from 'motion/react'
import { EnquiryProvider } from './lib/EnquiryContext.jsx'
import { Header } from './components/Header.jsx'
import { Hero } from './components/Hero.jsx'
import { EnquiryBar } from './components/EnquiryBar.jsx'
import { Intro } from './components/Intro.jsx'
import { Rooms } from './components/Rooms.jsx'
import { StayGlimpse } from './components/StayGlimpse.jsx'
import { Gallery } from './components/Gallery.jsx'
import { Reviews } from './components/Reviews.jsx'
import { Location } from './components/Location.jsx'
import { Contact } from './components/Contact.jsx'
import { Footer } from './components/Footer.jsx'
import { MobileEnquiryBar } from './components/MobileEnquiryBar.jsx'
import { isPreview } from './lib/preview.js'

export default function App() {
  return (
    // "user": transforms are skipped for visitors who prefer reduced motion
    <MotionConfig reducedMotion="user">
      <EnquiryProvider>
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          <Hero />
          <EnquiryBar />
          <Intro />
          <Rooms />
          <StayGlimpse />
          <Gallery />
          <Reviews />
          <Location />
          <Contact />
        </main>
        <Footer />
        <MobileEnquiryBar />
        {isPreview && (
          <p className="pointer-events-none fixed left-3 top-[4.5rem] z-30 rounded-full border border-dashed border-gold-ink/60 bg-ivory/95 px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-gold-ink md:top-24">
            Editor preview · placeholders visible
          </p>
        )}
      </EnquiryProvider>
    </MotionConfig>
  )
}
