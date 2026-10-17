import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { heroVideo } from '../data/media.js'
import { ResponsiveImage } from './ui/ResponsiveImage.jsx'
import { ManagedVideo } from './ui/ManagedVideo.jsx'
import { cn } from '../lib/cn.js'

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => !query || window.matchMedia(query).matches)
  useEffect(() => {
    if (!query) return
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return matches
}

/**
 * Hero background. The entrance photo is always rendered first; the muted
 * looping video fades in over it once frames are actually playing. If the
 * video is slow, fails, is blocked, or the visitor prefers reduced motion,
 * the photo simply stays. On portrait-shaped screens the landscape footage
 * is not used at all (see `heroVideo.media`).
 */
export function HeroMedia() {
  const fits = useMediaQuery(heroVideo.media)
  const useVideo = heroVideo.sources.length > 0 && fits
  const [playing, setPlaying] = useState(false)

  return (
    // No z-index here: the overlays and copy paint above the media by source order,
    // while the video control (z-10) stays above them and clickable.
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <ResponsiveImage image={heroVideo.poster} priority sizes="100vw" className="h-full w-full" />
      </motion.div>

      {useVideo && (
        <ManagedVideo
          sources={heroVideo.sources}
          poster={null}
          eager
          decorative
          variant="corner"
          label={heroVideo.label}
          // Once frames have shown, keep the video layer (paused frame) rather than flicking back to the photo.
          onPlayingChange={(p) => p && setPlaying(true)}
          fill
          videoClassName={cn('transition-opacity duration-[1.2s] ease-out', playing ? 'opacity-100' : 'opacity-0')}
          controlClassName="bottom-28 right-6 lg:bottom-32 lg:right-10"
        />
      )}
    </div>
  )
}
