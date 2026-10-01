import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { SERVICES } from '../lib/site.js'

const initialContact = { name: '', email: '', phone: '' }

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
})

function totalFor(chosen) {
  const hasHourly = chosen.some((s) => s.pricingModel === 'hourly')
  const total = chosen.reduce(
    (sum, s) => sum + (s.pricingModel === 'hourly' ? s.minimumBooking : s.priceValue),
    0
  )
  return { total, hasHourly }
}

export default function ServiceSelector() {
  const [selected, setSelected] = useState(() => new Set())
  const [contact, setContact] = useState(initialContact)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submittedName, setSubmittedName] = useState('')

  function toggleService(slug) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  function handleContactChange(event) {
    const { name, value } = event.target
    setContact((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')

    const chosen = SERVICES.filter((s) => selected.has(s.slug))
    const { total, hasHourly } = totalFor(chosen)
    const notes = [
      'Selected via What I Offer selector.',
      `Services requested: ${chosen.length ? chosen.map((s) => `${s.name} (${s.priceLabel})`).join(', ') : 'None selected'}`,
      `Total: ${hasHourly ? `${currency.format(total)} minimum (Open Houses billed hourly beyond the minimum)` : currency.format(total)}`,
    ].join('\n')

    const { error } = await supabase.from('leads').insert({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: 'Not provided (submitted via What I Offer selector)',
      source: 'what_i_offer_selector',
      notes,
    })

    if (error) {
      console.error('Service selection submission failed:', error)
      setStatus('error')
      return
    }

    setSubmittedName(contact.name)
    setStatus('success')
    setSelected(new Set())
    setContact(initialContact)
  }

  if (status === 'success') {
    return (
      <p className="rounded-md bg-gold/10 p-4 text-brand" role="status">
        Thanks, {submittedName || 'there'}! Thomas has your request and will follow up the same
        business day to go over flat-fee pricing for the services you selected.
      </p>
    )
  }

  const chosen = SERVICES.filter((s) => selected.has(s.slug))
  const { total, hasHourly } = totalFor(chosen)

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((service) => {
          const isSelected = selected.has(service.slug)
          return (
            <button
              key={service.slug}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleService(service.slug)}
              className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                isSelected
                  ? 'border-gold bg-gold/10 text-brand-dark'
                  : 'border-stone-300 text-stone-700 hover:border-gold'
              }`}
            >
              <span className="font-semibold">
                {service.name} — {service.priceLabel}
              </span>
              {service.fullScopeOnly && (
                <span className="mt-1 block text-xs text-stone-500">
                  Covers the full transaction — not available as a partial service.
                </span>
              )}
            </button>
          )
        })}
      </div>

      <p className="mt-4 text-sm text-stone-600">
        {chosen.length === 0 ? (
          'No services selected yet — click any service above to add it to your request.'
        ) : (
          <>
            Selected: {chosen.map((s) => s.name).join(', ')}.{' '}
            {hasHourly ? (
              <>
                Estimated total: <strong>{currency.format(total)} minimum</strong> — Open
                Houses is billed at $65/hour beyond the 2-hour minimum.
              </>
            ) : (
              <>
                Total: <strong>{currency.format(total)}</strong>.
              </>
            )}
          </>
        )}
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 border-t border-stone-200 pt-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="selector-name" className="block text-sm font-medium text-stone-700">
              Name
            </label>
            <input
              id="selector-name"
              name="name"
              type="text"
              required
              value={contact.name}
              onChange={handleContactChange}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div>
            <label htmlFor="selector-email" className="block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="selector-email"
              name="email"
              type="email"
              required
              value={contact.email}
              onChange={handleContactChange}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
          <div>
            <label htmlFor="selector-phone" className="block text-sm font-medium text-stone-700">
              Phone
            </label>
            <input
              id="selector-phone"
              name="phone"
              type="tel"
              required
              value={contact.phone}
              onChange={handleContactChange}
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-600" role="alert">
            Something went wrong sending your request. Please try again or call directly.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting' || chosen.length === 0}
          className="rounded-md bg-gold px-5 py-2.5 font-medium text-brand-dark hover:bg-gold-dark disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : "I'm done — send my request"}
        </button>
      </form>
    </div>
  )
}
