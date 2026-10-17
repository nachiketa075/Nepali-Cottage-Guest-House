import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../../lib/cn.js'
import { setModalOpen } from '../../lib/videoCoordinator.js'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Accessible modal dialog: focus moves in and is trapped, Escape closes,
 * focus returns to the trigger, the page behind is inert and does not scroll.
 * `variant`: 'panel' (centred card), 'sheet' (full-screen menu), 'dark' (lightbox).
 */
export function Dialog({ open, onClose, labelledBy, label, variant = 'panel', className, onKeyDown, children }) {
  const panelRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const onKeyDownRef = useRef(onKeyDown)
  onCloseRef.current = onClose
  onKeyDownRef.current = onKeyDown

  useEffect(() => {
    if (!open) return
    const trigger = document.activeElement
    const root = document.getElementById('root')
    const html = document.documentElement
    const scrollbar = window.innerWidth - html.clientWidth
    html.style.overflow = 'hidden'
    if (scrollbar) document.body.style.paddingRight = `${scrollbar}px`
    if (root) root.inert = true
    setModalOpen(true)

    const panel = panelRef.current
    const first = panel?.querySelector('[data-autofocus]') ?? panel?.querySelector(FOCUSABLE)
    ;(first ?? panel)?.focus({ preventScroll: true })

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCloseRef.current()
        return
      }
      if (e.key === 'Tab' && panel) {
        const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
        if (!items.length) return e.preventDefault()
        const firstEl = items[0]
        const lastEl = items[items.length - 1]
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
      onKeyDownRef.current?.(e)
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      html.style.overflow = ''
      document.body.style.paddingRight = ''
      if (root) root.inert = false
      setModalOpen(false)
      trigger?.focus?.({ preventScroll: true })
    }
  }, [open])

  const styles = {
    panel: {
      wrap: 'items-end sm:items-center justify-center sm:p-6',
      backdrop: 'bg-forest-deep/60',
      panel:
        'relative max-h-[100dvh] w-full overflow-y-auto bg-paper sm:max-h-[min(92dvh,56rem)] sm:max-w-5xl sm:rounded-lg sm:border sm:border-line',
      motion: { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 16 } },
    },
    sheet: {
      wrap: 'items-stretch',
      backdrop: 'bg-forest-deep/40',
      panel: 'relative h-[100dvh] w-full overflow-y-auto bg-ivory',
      motion: { initial: { opacity: 0, y: -12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } },
    },
    dark: {
      wrap: 'items-stretch',
      backdrop: 'bg-[#0c1611]',
      panel: 'on-dark relative flex h-[100dvh] w-full flex-col text-ivory',
      motion: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    },
  }[variant]

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cn('fixed inset-0 z-50 flex', styles.wrap)}>
          <motion.div
            aria-hidden="true"
            className={cn('absolute inset-0', styles.backdrop)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : label}
            tabIndex={-1}
            className={cn(styles.panel, 'outline-none', className)}
            {...styles.motion}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
