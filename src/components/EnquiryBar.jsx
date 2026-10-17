import { useId, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { enquiry } from '../data/property.js'
import { addDaysISO, todayISO } from '../lib/dates.js'
import { useEnquiry } from '../lib/EnquiryContext.jsx'
import { validateDates } from '../lib/enquiry.js'
import { Button } from './ui/Button.jsx'

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => String(from + i))

/**
 * Compact stay planner beneath the hero. It does not check availability —
 * it carries the dates and party size into the enquiry form.
 */
export function EnquiryBar() {
  const { values, startEnquiry } = useEnquiry()
  const uid = useId()
  const [draft, setDraft] = useState({
    checkIn: values.checkIn,
    checkOut: values.checkOut,
    adults: values.adults,
    children: values.children,
  })
  const [errors, setErrors] = useState({})
  const today = todayISO()

  const update = (field) => (e) => {
    const value = e.target.value
    setDraft((d) => {
      const next = { ...d, [field]: value }
      // Keep check-out after check-in when the check-in date moves past it.
      if (field === 'checkIn' && next.checkOut && next.checkOut <= value) next.checkOut = addDaysISO(value, 1)
      return next
    })
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    // Dates are optional here (they are required in the full form), but must make sense if given.
    const all = validateDates(draft)
    const found = {}
    if (draft.checkIn && all.checkIn) found.checkIn = all.checkIn
    if (draft.checkOut && all.checkOut) found.checkOut = all.checkOut
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`${uid}-${Object.keys(found)[0]}`)?.focus()
      return
    }
    startEnquiry(draft)
  }

  const err = (field) =>
    errors[field] && (
      <p id={`${uid}-${field}-error`} className="field-error">
        {errors[field]}
      </p>
    )

  const fieldProps = (field) => ({
    id: `${uid}-${field}`,
    value: draft[field],
    onChange: update(field),
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${uid}-${field}-error` : undefined,
  })

  return (
    <div className="shell relative z-10 -mt-8 md:-mt-20">
      <form
        noValidate
        onSubmit={onSubmit}
        aria-labelledby={`${uid}-title`}
        className="rounded-lg border border-line bg-paper p-5 shadow-[0_30px_60px_-40px_rgba(20,42,32,0.45)] sm:p-6 lg:p-7"
      >
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 id={`${uid}-title`} className="font-serif text-2xl">
            Plan your stay
          </h2>
          <p className="text-sm text-ink-soft">Enquiry only — no live availability or instant booking.</p>
        </div>
        <div className="grid grid-cols-2 items-start gap-x-3 gap-y-4 sm:gap-x-4 lg:grid-cols-[1fr_1fr_0.62fr_0.62fr_auto]">
          <div className="min-w-0">
            <label htmlFor={`${uid}-checkIn`} className="field-label">
              Check-in
            </label>
            <input type="date" min={today} className="field" {...fieldProps('checkIn')} />
            {err('checkIn')}
          </div>
          <div className="min-w-0">
            <label htmlFor={`${uid}-checkOut`} className="field-label">
              Check-out
            </label>
            <input
              type="date"
              min={draft.checkIn ? addDaysISO(draft.checkIn, 1) : addDaysISO(today, 1)}
              className="field"
              {...fieldProps('checkOut')}
            />
            {err('checkOut')}
          </div>
          <div className="min-w-0">
            <label htmlFor={`${uid}-adults`} className="field-label">
              Adults
            </label>
            <select className="field" {...fieldProps('adults')}>
              {range(1, enquiry.maxGuests).map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="min-w-0">
            <label htmlFor={`${uid}-children`} className="field-label">
              Children
            </label>
            <select className="field" {...fieldProps('children')}>
              {range(0, enquiry.maxGuests - 1).map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2 lg:col-span-1 lg:pt-[1.45rem]">
            <Button type="submit" className="w-full whitespace-nowrap lg:min-h-12">
              Continue enquiry
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
