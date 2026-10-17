import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { emptyEnquiry } from './enquiry.js'
import { scrollToSection } from './sections.js'

const EnquiryContext = createContext(null)

/**
 * Holds the enquiry form values so the hero enquiry bar and room dialogs can
 * pre-fill the contact form, then bring the visitor to it.
 */
export function EnquiryProvider({ children }) {
  const [values, setValues] = useState(emptyEnquiry)

  const startEnquiry = useCallback((partial = {}) => {
    setValues((v) => ({ ...v, ...partial }))
    // Wait a frame so any closing dialog has released the page before scrolling.
    requestAnimationFrame(() => {
      scrollToSection('contact')
      document.getElementById('enquiry-name')?.focus({ preventScroll: true })
    })
  }, [])

  const value = useMemo(() => ({ values, setValues, startEnquiry }), [values, startEnquiry])
  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext)
  if (!ctx) throw new Error('useEnquiry must be used inside <EnquiryProvider>')
  return ctx
}
