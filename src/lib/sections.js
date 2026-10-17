import { location } from '../data/property.js'
import { isPreview } from './preview.js'

// Navigation is derived from the data so a hidden section never leaves a broken link.
export function navSections() {
  const showLocation = Boolean(location.address) || isPreview
  return [
    { id: 'home', label: 'Home' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Gallery' },
    showLocation && { id: 'location', label: 'Location' },
    { id: 'contact', label: 'Contact' },
  ].filter(Boolean)
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  const { pathname, search } = window.location
  history.pushState(null, '', id === 'home' ? pathname + search : `#${id}`)
}
