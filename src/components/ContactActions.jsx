import { Mail, MessageCircle, Phone } from 'lucide-react'
import { verifiedContact, whatsappLink, mailtoLink } from '../lib/contact.js'
import { property } from '../data/property.js'
import { cn } from '../lib/cn.js'
import { Button } from './ui/Button.jsx'

/** Call / WhatsApp / email buttons — rendered only for verified channels. */
export function ContactActions({ text, className, variant = 'outline' }) {
  const { phone, whatsapp, email } = verifiedContact()
  if (!phone && !whatsapp && !email) return null
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {phone && (
        <Button href={`tel:${phone.tel}`} variant={variant}>
          <Phone aria-hidden="true" className="size-4" strokeWidth={1.75} />
          Call {phone.display}
        </Button>
      )}
      {whatsapp && (
        <Button href={whatsappLink(whatsapp.number, text)} target="_blank" rel="noopener noreferrer" variant={variant}>
          <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.75} />
          WhatsApp
          <span className="sr-only">(opens in a new tab)</span>
        </Button>
      )}
      {email && (
        <Button href={mailtoLink(email.address, `Stay enquiry — ${property.name}`, text)} variant={variant}>
          <Mail aria-hidden="true" className="size-4" strokeWidth={1.75} />
          Email
        </Button>
      )}
    </div>
  )
}
