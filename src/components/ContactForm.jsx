import { useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'

const initialForm = { name: '', email: '', phone: '', message: '' }

export default function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [submittedName, setSubmittedName] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('submitting')

    const { error } = await supabase.from('contact_submissions').insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      message: form.message || null,
      source: 'website_contact_form',
    })

    if (error) {
      console.error('Contact form submission failed:', error)
      setStatus('error')
      return
    }

    setSubmittedName(form.name)
    setStatus('success')
    setForm(initialForm)
  }

  if (status === 'success') {
    return (
      <p className="rounded-md bg-gold/10 p-4 text-brand" role="status">
        Thanks, {submittedName || 'there'}! Your message has been sent — Thomas will be in touch
        soon.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-stone-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600" role="alert">
          Something went wrong sending your message. Please try again or call directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-md bg-gold px-5 py-2.5 font-medium text-brand-dark hover:bg-gold-dark disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}
