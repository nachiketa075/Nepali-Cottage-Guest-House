/**
 * Small shared state for site videos:
 *  - Only one instance of the same footage plays at a time.
 *  - Videos on the page pause while a modal dialog is open over them.
 */

const instances = new Set()

export function registerVideo(el) {
  instances.add(el)
  return () => instances.delete(el)
}

// Pause every other element showing the same file.
export function claimPlayback(el) {
  const src = el.currentSrc || el.getAttribute('src')
  for (const other of instances) {
    if (other !== el && !other.paused && (other.currentSrc || other.getAttribute('src')) === src) other.pause()
  }
}

let modalCount = 0
const modalListeners = new Set()

export function setModalOpen(open) {
  modalCount = Math.max(0, modalCount + (open ? 1 : -1))
  modalListeners.forEach((fn) => fn(modalCount > 0))
}

export function subscribeModal(fn) {
  modalListeners.add(fn)
  return () => modalListeners.delete(fn)
}

export const isModalOpen = () => modalCount > 0
