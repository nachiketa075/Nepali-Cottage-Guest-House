import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { scrollToSection } from '../lib/sections.js'
import { Button } from './ui/Button.jsx'

/**
 * Compact sticky enquiry action for phones. Appears once the hero has scrolled
 * away and hides while the enquiry form is on screen. The footer carries extra
 * bottom padding so the bar never permanently covers content.
 */
export function MobileEnquiryBar() {
  const [pastHero, setPastHero] = useState(false)
  const [formVisible, setFormVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('home')
    const contact = document.getElementById('contact')
    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setPastHero(!e.isIntersecting)
        if (e.target === contact) setFormVisible(e.isIntersecting)
      }
    })
    hero && observer.observe(hero)
    contact && observer.observe(contact)
    return () => observer.disconnect()
  }, [])

  const show = pastHero && !formVisible

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-ivory px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 md:hidden"
        >
          <Button
            href="#contact"
            className="w-full"
            onClick={(e) => {
              e.preventDefault()
              scrollToSection('contact')
            }}
          >
            Enquire About Your Stay
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
