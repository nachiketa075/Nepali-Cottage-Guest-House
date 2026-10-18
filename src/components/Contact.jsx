import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, Info } from 'lucide-react'
import { enquiry, rooms, contact } from '../data/property.js'
import { rateLabel, rateNeedsNote, rateNote } from '../lib/pricing.js'
import { addDaysISO, nightsBetween, todayISO } from '../lib/dates.js'
import { useEnquiry } from '../lib/EnquiryContext.jsx'
import { enquiryText, submitEnquiry, validateEnquiry } from '../lib/enquiry.js'
import { verifiedContact } from '../lib/contact.js'
import { cn } from '../lib/cn.js'
import { Button } from './ui/Button.jsx'
import { Placeholder } from './ui/Placeholder.jsx'
import { Reveal } from './ui/Reveal.jsx'
import { SectionHeading } from './ui/SectionHeading.jsx'
import { ContactActions } from './ContactActions.jsx'

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i))

const FIELD_ORDER = ['name', 'contact', 'checkIn', 'checkOut', 'adults', 'children', 'roomId', 'message']
const LABELS = {
  name: 'Name',
  contact: 'Email or phone',
  checkIn: 'Check-in',
  checkOut: 'Check-out',
  adults: 'Adults',
  message: 'Message',
}

export function Contact() {
  const { values, setValues } = useEnquiry()
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState({ state: 'idle' })
  const summaryRef = useRef(null)
  const resultRef = useRef(null)
  const today = todayISO()
  const connected = Boolean(enquiry.endpoint)
  const hasDirect = Object.values(verifiedContact()).some(Boolean)

  const update = (field) => (e) => {
    const value = e.target.value
    const next = { ...values, [field]: value }
    if (field === 'checkIn' && next.checkOut && next.checkOut <= value) next.checkOut = addDaysISO(value, 1)
    setValues(next)
    if (submitted) setErrors(validateEnquiry(next)) // live feedback once they've tried to submit
    if (status.state !== 'idle' && status.state !== 'sending') setStatus({ state: 'idle' })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitted(true)
    const found = validateEnquiry(values)
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus({ state: 'idle' })
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    setStatus({ state: 'sending' })
    const result = await submitEnquiry(values)
    setStatus({ state: result.status, message: result.message, text: enquiryText(values) })
    requestAnimationFrame(() => resultRef.current?.focus())
  }

  const errorKeys = FIELD_ORDER.filter((k) => errors[k])
  const selectedRoom = rooms.find((r) => r.id === values.roomId)
  const nights = nightsBetween(values.checkIn, values.checkOut)

  const fieldProps = (field) => ({
    id: `enquiry-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby':
      cn(
        errors[field] && `enquiry-${field}-error`,
        field === 'contact' && 'enquiry-contact-hint',
        field === 'roomId' && selectedRoom?.rate && 'enquiry-roomId-hint',
      ) || undefined,
  })
  const err = (field) =>
    errors[field] && (
      <p id={`enquiry-${field}-error`} className="field-error">
        {errors[field]}
      </p>
    )

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line bg-paper py-20 md:py-28 lg:py-36">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading id="contact-title" eyebrow="Enquiries" title="Enquire about your stay.">
            Share your dates and who is travelling, and the guest house can come back to you with availability and rates.
          </SectionHeading>
          <Reveal delay={0.1} className="mt-8 space-y-6">
            <div className="flex gap-4 rounded-md border border-line bg-ivory p-5">
              <Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-gold-ink" strokeWidth={1.5} />
              <p className="text-[0.95rem] leading-relaxed text-ink-soft">
                <strong className="font-semibold text-ink">This is an enquiry, not a reservation.</strong> Nothing is
                booked, held or charged by sending it.
              </p>
            </div>
            {hasDirect ? (
              <div>
                <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-soft">Or contact us directly</h3>
                <ContactActions className="mt-4" />
                {!contact.whatsapp.verified && (
                  <Placeholder title="WhatsApp" className="mt-5">
                    <p>
                      Hidden until the owner confirms {contact.phone.display} takes WhatsApp (set{' '}
                      <code>whatsapp.verified: true</code> in <code>src/data/property.js</code>).
                    </p>
                  </Placeholder>
                )}
              </div>
            ) : (
              <Placeholder title="Call & WhatsApp">
                <p>
                  Call and WhatsApp buttons appear once a contact number is verified in{' '}
                  <code>src/data/property.js</code>.
                </p>
              </Placeholder>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.08} className="lg:col-span-7">
          <form noValidate onSubmit={onSubmit} aria-labelledby="contact-title" className="rounded-lg border border-line bg-ivory/60 p-5 sm:p-8 lg:p-10">
            {errorKeys.length > 0 && (
              <div
                ref={summaryRef}
                tabIndex={-1}
                role="alert"
                className="mb-8 rounded-md border border-danger/40 bg-danger/5 p-5 outline-none focus-visible:ring-2 focus-visible:ring-danger/50"
              >
                <h3 className="font-semibold text-danger">
                  Please check {errorKeys.length === 1 ? 'one detail' : `${errorKeys.length} details`}
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {errorKeys.map((k) => (
                    <li key={k}>
                      <a href={`#enquiry-${k}`} className="underline underline-offset-2" onClick={(e) => (e.preventDefault(), document.getElementById(`enquiry-${k}`)?.focus())}>
                        {LABELS[k]}: {errors[k]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mb-6 text-sm text-ink-soft">
              Fields marked <span aria-hidden="true">*</span>
              <span className="sr-only">with an asterisk</span> are required.
            </p>

            <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <label htmlFor="enquiry-name" className="field-label">
                  Name <span aria-hidden="true">*</span>
                </label>
                <input type="text" autoComplete="name" required className="field" {...fieldProps('name')} />
                {err('name')}
              </div>
              <div>
                <label htmlFor="enquiry-contact" className="field-label">
                  Email or phone <span aria-hidden="true">*</span>
                </label>
                <input type="text" autoComplete="email" inputMode="email" required className="field" {...fieldProps('contact')} />
                <p id="enquiry-contact-hint" className="mt-1.5 text-xs text-ink-soft">
                  For phone numbers, include the country code.
                </p>
                {err('contact')}
              </div>
              <div>
                <label htmlFor="enquiry-checkIn" className="field-label">
                  Check-in <span aria-hidden="true">*</span>
                </label>
                <input type="date" min={today} required className="field" {...fieldProps('checkIn')} />
                {err('checkIn')}
              </div>
              <div>
                <label htmlFor="enquiry-checkOut" className="field-label">
                  Check-out <span aria-hidden="true">*</span>
                </label>
                <input
                  type="date"
                  min={values.checkIn ? addDaysISO(values.checkIn, 1) : addDaysISO(today, 1)}
                  required
                  className="field"
                  {...fieldProps('checkOut')}
                />
                {err('checkOut')}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="enquiry-adults" className="field-label">
                    Adults <span aria-hidden="true">*</span>
                  </label>
                  <select className="field" {...fieldProps('adults')}>
                    {range(1, enquiry.maxGuests).map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="enquiry-children" className="field-label">
                    Children
                  </label>
                  <select className="field" {...fieldProps('children')}>
                    {range(0, enquiry.maxGuests - 1).map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>
                {errors.adults && <div className="col-span-2 -mt-2">{err('adults')}</div>}
              </div>
              <div>
                <label htmlFor="enquiry-roomId" className="field-label">
                  Room of interest
                </label>
                <select className="field" {...fieldProps('roomId')}>
                  <option value="">No preference</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                      {r.rate ? ` — ${rateLabel(r)}` : ''}
                    </option>
                  ))}
                </select>
                {selectedRoom?.rate && (
                  <p id="enquiry-roomId-hint" className="mt-1.5 text-xs leading-snug text-ink-soft">
                    Listed rate {rateLabel(selectedRoom)}.{rateNeedsNote ? ` ${rateNote}` : ''}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="enquiry-message" className="field-label">
                  Message <span className="font-normal normal-case tracking-normal">(optional)</span>
                </label>
                <textarea rows={4} maxLength={1000} className="field resize-y" {...fieldProps('message')} />
                {err('message')}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-soft" aria-live="polite">
                {nights > 0 ? `${nights} night${nights === 1 ? '' : 's'} · ` : ''}
                {connected ? 'Sends your enquiry to the guest house.' : 'Online sending is not connected yet.'}
              </p>
              <Button type="submit" disabled={status.state === 'sending'} className="shrink-0">
                {status.state === 'sending' ? 'Sending…' : connected ? 'Send enquiry' : 'Check & prepare enquiry'}
              </Button>
            </div>

            <AnimatePresence>
              {status.state !== 'idle' && status.state !== 'sending' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div ref={resultRef} tabIndex={-1} role="status" className="mt-8 outline-none">
                    <EnquiryResult status={status} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

function EnquiryResult({ status }) {
  if (status.state === 'sent') {
    return (
      <div className="rounded-md border border-forest/30 bg-forest/5 p-5">
        <h3 className="font-serif text-2xl">Thank you — your enquiry has been sent.</h3>
        <p className="mt-2 text-ink-soft">This is not a confirmed reservation. The guest house will need to reply to confirm availability.</p>
      </div>
    )
  }
  if (status.state === 'error') {
    return (
      <div className="rounded-md border border-danger/40 bg-danger/5 p-5">
        <h3 className="font-semibold text-danger">Your enquiry could not be sent.</h3>
        <p className="mt-2 text-sm text-ink-soft">Please try again in a moment. ({status.message})</p>
        <ContactActions className="mt-4" text={status.text} />
      </div>
    )
  }
  // not-configured
  return (
    <div className="rounded-md border border-gold-ink/40 bg-gold-soft/15 p-5 sm:p-6">
      <h3 className="font-serif text-2xl">Your details look complete — but nothing has been sent.</h3>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
        Sending enquiries from this website requires connection to the guest house’s booking or contact service, which
        has not been set up yet. You can copy your enquiry below and send it directly.
      </p>
      <pre className="mt-5 max-h-60 overflow-auto whitespace-pre-wrap rounded-md border border-line bg-paper p-4 font-sans text-sm leading-relaxed">
        {status.text}
      </pre>
      <div className="mt-5 flex flex-wrap gap-3">
        <CopyButton text={status.text} />
        <ContactActions text={status.text} />
      </div>
      <Placeholder title="Enquiry service" className="mt-5">
        <p>
          Set <code>enquiry.endpoint</code> in <code>src/data/property.js</code> to a form or booking service that
          accepts a JSON POST to enable real sending.
        </p>
      </Placeholder>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for browsers without the async clipboard API
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }
  return (
    <Button variant="outline" onClick={copy}>
      {copied ? <Check aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" strokeWidth={1.75} />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy enquiry'}</span>
    </Button>
  )
}
