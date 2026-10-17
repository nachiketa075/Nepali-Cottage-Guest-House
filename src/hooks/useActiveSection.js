import { useEffect, useState } from 'react'

// Tracks which section is in the middle band of the viewport.
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join(',')
  useEffect(() => {
    const els = key.split(',').map((id) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [key])
  return active
}
