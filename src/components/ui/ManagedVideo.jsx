import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Pause, Play } from 'lucide-react'
import { claimPlayback, isModalOpen, registerVideo, subscribeModal } from '../../lib/videoCoordinator.js'
import { cn } from '../../lib/cn.js'
import { videoSettings } from '../../data/media.js'

/**
 * The one video component used across the site. Every video is silent:
 * it is muted before any play attempt and there is no volume or unmute control.
 *
 * Behaviour:
 *  - Lazy: no file is requested until the video is near the viewport
 *    (`eager` skips that wait, for the hero).
 *  - Autoplays (muted, looped, inline) while at least partly visible; pauses
 *    off-screen, while the tab is hidden, and while a dialog covers the page.
 *  - A visitor's manual pause is respected — it will not auto-resume.
 *  - If the browser blocks autoplay, the poster stays and a Play button shows.
 *  - With reduced motion preferred, autoplay follows `videoSettings` in media.js
 *    (on by default); if disabled, the poster shows until the visitor presses Play.
 *  - Another instance of the same footage pauses when this one starts.
 *
 * `fill`: position absolutely to cover the parent (otherwise in normal flow).
 * `variant`: 'overlay' (centred play button when not playing + corner toggle),
 *            'corner' (corner toggle only, e.g. hero / small tiles).
 */
export function ManagedVideo({
  video,
  sources,
  poster,
  eager = false,
  label,
  decorative = false,
  variant = 'overlay',
  fill = false,
  className,
  videoClassName,
  controlClassName,
  onPlayingChange,
}) {
  const wrapRef = useRef(null)
  const ref = useRef(null)
  // Treat reduced motion as "no autoplay" only if the site settings say so.
  const reduceMotion = useReducedMotion() && !videoSettings.autoplayWithReducedMotion
  const [near, setNear] = useState(eager)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => typeof document === 'undefined' || !document.hidden)
  const [covered, setCovered] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [userStarted, setUserStarted] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [playing, setPlaying] = useState(false)

  const srcList = sources ?? [{ src: video.src, type: video.mime ?? 'video/mp4' }]
  const posterSrc = poster === null ? undefined : (poster ?? video?.poster?.src)
  const name = label ?? video?.alt ?? 'Video'

  // Visibility in the viewport (and a wider margin for lazy loading).
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const nearObs = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '400px 0px' })
    const visObs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 })
    if (!eager) nearObs.observe(el)
    visObs.observe(el)
    return () => {
      nearObs.disconnect()
      visObs.disconnect()
    }
  }, [eager])

  // Tab visibility.
  useEffect(() => {
    const onChange = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  // Pause page videos while a dialog is open — but not videos inside the dialog.
  useEffect(() => {
    const insidePage = () => Boolean(wrapRef.current?.closest('#root'))
    setCovered(isModalOpen() && insidePage())
    return subscribeModal((open) => setCovered(open && insidePage()))
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = true
    el.defaultMuted = true
    return registerVideo(el)
  }, [])

  const autoAllowed = !reduceMotion || userStarted
  const shouldPlay = near && visible && pageVisible && !covered && !userPaused && autoAllowed
  const shouldPlayRef = useRef(shouldPlay)
  shouldPlayRef.current = shouldPlay

  useEffect(() => {
    const el = ref.current
    if (!el || !near) return
    if (shouldPlay) {
      el.muted = true
      const attempt = el.play()
      attempt?.catch?.((err) => {
        // NotAllowedError = autoplay blocked. AbortError = interrupted by pause/src change.
        if (err?.name === 'NotAllowedError') setBlocked(true)
      })
    } else if (!el.paused) {
      el.pause()
    }
  }, [shouldPlay, near])

  useEffect(() => {
    onPlayingChange?.(playing)
  }, [playing, onPlayingChange])

  const toggle = () => {
    const el = ref.current
    if (!el) return
    if (!el.paused) {
      setUserPaused(true)
      el.pause()
      return
    }
    setUserPaused(false)
    setUserStarted(true)
    setBlocked(false)
    setNear(true)
    shouldPlayRef.current = true
    el.muted = true
    // Called inside the click, so browsers that blocked autoplay will allow it.
    el.play().catch(() => setBlocked(true))
  }

  const showOverlayPlay = variant === 'overlay' && !playing && (blocked || userPaused || (reduceMotion && !userStarted))
  const actionLabel = playing ? `Pause video: ${name}` : `Play video: ${name}`

  return (
    <div ref={wrapRef} className={cn(fill ? 'absolute inset-0' : 'relative', 'overflow-hidden', className)}>
      <video
        ref={ref}
        muted
        loop
        playsInline
        autoPlay={!reduceMotion}
        preload={near ? (eager ? 'auto' : 'metadata') : 'none'}
        poster={posterSrc}
        width={video?.width}
        height={video?.height}
        aria-hidden={decorative ? 'true' : undefined}
        aria-label={decorative ? undefined : name}
        tabIndex={-1}
        disablePictureInPicture
        disableRemotePlayback
        className={cn('block h-full w-full object-cover', videoClassName)}
        onPlay={(e) => {
          // The autoPlay attribute can start a clip that is not (or no longer) eligible.
          if (!shouldPlayRef.current) return e.currentTarget.pause()
          claimPlayback(e.currentTarget)
        }}
        onPlaying={() => {
          setPlaying(true)
          setBlocked(false)
        }}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => {
          // Belt and braces: never allow sound.
          if (!e.currentTarget.muted) e.currentTarget.muted = true
        }}
      >
        {near && srcList.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
      </video>

      {showOverlayPlay && (
        <button
          type="button"
          onClick={toggle}
          className="group/play absolute inset-0 flex items-center justify-center bg-black/15 transition-colors hover:bg-black/25"
        >
          <span className="inline-flex size-16 items-center justify-center rounded-full bg-ivory/95 text-forest-deep shadow-sm transition-transform duration-300 group-hover/play:scale-105">
            <Play aria-hidden="true" className="ml-1 size-6" fill="currentColor" strokeWidth={0} />
          </span>
          <span className="sr-only">{actionLabel}</span>
        </button>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label={actionLabel}
        className={cn(
          'on-dark absolute bottom-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-full border border-ivory/50 bg-black/35 text-ivory transition-colors hover:bg-black/55',
          controlClassName,
        )}
      >
        {playing ? (
          <Pause aria-hidden="true" className="size-3.5" fill="currentColor" strokeWidth={0} />
        ) : (
          <Play aria-hidden="true" className="ml-0.5 size-3.5" fill="currentColor" strokeWidth={0} />
        )}
      </button>
    </div>
  )
}
