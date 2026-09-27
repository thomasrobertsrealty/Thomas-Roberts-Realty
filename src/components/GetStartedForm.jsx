import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { SERVICES } from '../lib/site.js'

const NEED_OPTIONS = [...SERVICES.map((s) => s.name), 'Not sure yet']
const TIMELINE_OPTIONS = ['Already listed', 'Planning to list soon', 'Just exploring']

const initialForm = {
  role: 'Selling',
  needs: [],
  location: '',
  timeline: TIMELINE_OPTIONS[0],
  name: '',
  email: '',
  phone: '',
}

export default function GetStartedForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submittedName, setSubmittedName] = useState('')
  const [submittedNeeds, setSubmittedNeeds] = useState([])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function toggleNeed(need) {
    setForm((prev) => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter((n) => n !== need)
        : [...prev.needs, need],
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')

    const notes = [
      `Buying or selling: ${form.role}`,
      `Wants help with: ${form.needs.length ? form.needs.join(', ') : 'Not specified'}`,
      `Timeline: ${form.timeline}`,
    ].join('\n')

    const { error } = await supabase.from('leads').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      address: form.location || null,
      source: 'get_started_form',
      notes,
    })

    if (error) {
      console.error('Get Started submission failed:', error)
      setStatus('error')
      return
    }

    setSubmittedName(form.name)
    setSubmittedNeeds(form.needs)
    setStatus('success')
    setForm(initialForm)
  }

  if (status === 'success') {
    const needsLabel = submittedNeeds.length ? submittedNeeds.join(', ') : 'the services you selected'
    return (
      <p className="rounded-md bg-gold/10 p-4 text-brand" role="status">
        Thanks, {submittedName || 'there'}! Thomas will follow up shortly to go over flat-fee
        options for {needsLabel}. He responds the same business day for messages received during
        business hours.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <fieldset>
        <legend className="text-sm font-medium text-stone-700">Are you selling or buying?</legend>
        <div className="mt-2 flex gap-4">
          {['Selling', 'Buying'].map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="radio"
                name="role"
                value={option}
                checked={form.role === option}
                onChange={handleChange}
                className="text-gold focus:ring-gold"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium text-stone-700">
          What do you need help with?
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {NEED_OPTIONS.map((need) => (
            <label key={need} className="flex items-center gap-2 text-sm text-stone-700">
              <input
                type="checkbox"
                checked={form.needs.includes(need)}
                onChange={() => toggleNeed(need)}
                className="rounded text-gold focus:ring-gold"
              />
              {need}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-stone-700">
          Where is the property? <span className="text-stone-400">(city or area)</span>
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          value={form.location}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-stone-700">
          Timeline
        </label>
        <select
          id="timeline"
          name="timeline"
          value={form.timeline}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        >
          {TIMELINE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-stone-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-stone-700">
          Phone <span className="text-stone-400">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">
          Something went wrong sending your request. Please try again or call directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-md bg-gold px-5 py-2.5 font-medium text-brand-dark hover:bg-gold-dark disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Get started'}
      </button>
    </form>
  )
}
