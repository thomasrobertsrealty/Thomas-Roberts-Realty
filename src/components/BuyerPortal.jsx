import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { SITE } from '../lib/site.js'
import {
  CHECKLIST,
  DEFAULT_PLAN,
  calculateCosts,
  money,
  progressSummary,
} from '../lib/buyerTools.js'

const inputClass =
  'mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-gold-dark focus:outline-none focus:ring-2 focus:ring-gold/40'
const buttonClass =
  'rounded-full bg-gold px-6 py-3 font-semibold text-brand-dark transition-colors hover:bg-gold-dark disabled:opacity-60'

export default function BuyerPortal() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recovering, setRecovering] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession)
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (loading) {
    return <p className="py-16 text-center text-stone-500">Loading...</p>
  }
  if (session && recovering) {
    return <NewPasswordForm onDone={() => setRecovering(false)} />
  }
  if (!session) {
    return <AuthForm />
  }
  return <Dashboard session={session} />
}

function AuthForm() {
  const [mode, setMode] = useState('login') // login | signup | reset
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', consent: false })
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  function update(event) {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function switchMode(next) {
    setMode(next)
    setMessage('')
    setStatus('idle')
  }

  async function submit(event) {
    event.preventDefault()
    setMessage('')
    setStatus('working')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) {
        setStatus('error')
        setMessage('That email and password did not match. Please try again.')
        return
      }
      setStatus('idle')
      return
    }

    if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: window.location.origin + '/my-plan',
      })
      if (error) {
        setStatus('error')
        setMessage('We could not send that email. Please check the address and try again.')
        return
      }
      setStatus('done')
      setMessage('If that email has an account, a reset link is on its way.')
      return
    }

    // signup
    if (form.password.length < 10) {
      setStatus('error')
      setMessage('Please choose a password with at least 10 characters.')
      return
    }
    if (!form.consent) {
      setStatus('error')
      setMessage('Please check the box to agree before creating your account.')
      return
    }
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin + '/my-plan',
        data: {
          full_name: form.name,
          phone: form.phone,
          consent_at: new Date().toISOString(),
        },
      },
    })
    if (error) {
      setStatus('error')
      setMessage('We could not create that account. If you already have one, try logging in.')
      return
    }
    if (data.session) {
      setStatus('idle')
      return
    }
    setStatus('done')
    setMessage('Almost done. Check your email for a confirmation link, then come back here to log in.')
  }

  const titles = { login: 'Log in to your plan', signup: 'Create your free account', reset: 'Reset your password' }

  return (
    <div className="mx-auto max-w-md">
      <h2 className="font-heading text-2xl text-brand">{titles[mode]}</h2>

      {mode === 'signup' && (
        <p className="mt-2 text-sm text-stone-600">
          Save your numbers, track your home-buying checklist, and ask {SITE.agentName} questions. Free, and no
          obligation to buy.
        </p>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === 'signup' && (
          <>
            <label className="block text-sm font-medium text-stone-700">
              Your name
              <input name="name" value={form.name} onChange={update} required autoComplete="name" className={inputClass} />
            </label>
            <label className="block text-sm font-medium text-stone-700">
              Phone (optional)
              <input name="phone" value={form.phone} onChange={update} type="tel" autoComplete="tel" className={inputClass} />
            </label>
          </>
        )}

        <label className="block text-sm font-medium text-stone-700">
          Email
          <input name="email" value={form.email} onChange={update} type="email" required autoComplete="email" className={inputClass} />
        </label>

        {mode !== 'reset' && (
          <label className="block text-sm font-medium text-stone-700">
            Password
            <input
              name="password"
              value={form.password}
              onChange={update}
              type="password"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className={inputClass}
            />
            {mode === 'signup' && <span className="mt-1 block text-xs text-stone-500">At least 10 characters.</span>}
          </label>
        )}

        {mode === 'signup' && (
          <label className="flex items-start gap-3 rounded-md bg-gold/10 p-4 text-sm text-stone-700">
            <input name="consent" type="checkbox" checked={form.consent} onChange={update} className="mt-1 h-4 w-4" />
            <span>
              I understand that {SITE.agentName} can see the plans, checklist progress, and questions I save here, and
              may reach out to me with questions. I can ask him to delete my information at any time. See the{' '}
              <a href="/privacy" className="font-medium text-gold-dark underline">privacy policy</a>.
            </span>
          </label>
        )}

        {message && (
          <p className={status === 'error' ? 'text-sm text-red-700' : 'text-sm text-brand'} role="status">
            {message}
          </p>
        )}

        <button type="submit" disabled={status === 'working'} className={buttonClass + ' w-full'}>
          {mode === 'login' && 'Log in'}
          {mode === 'signup' && 'Create account'}
          {mode === 'reset' && 'Send reset link'}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-sm text-stone-600">
        {mode === 'login' && (
          <>
            <p>
              New here?{' '}
              <button type="button" onClick={() => switchMode('signup')} className="font-medium text-gold-dark underline">
                Create a free account
              </button>
            </p>
            <p>
              <button type="button" onClick={() => switchMode('reset')} className="font-medium text-gold-dark underline">
                Forgot your password?
              </button>
            </p>
          </>
        )}
        {mode !== 'login' && (
          <p>
            <button type="button" onClick={() => switchMode('login')} className="font-medium text-gold-dark underline">
              Back to log in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

function NewPasswordForm({ onDone }) {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function submit(event) {
    event.preventDefault()
    if (password.length < 10) {
      setMessage('Please choose a password with at least 10 characters.')
      return
    }
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setMessage('We could not update your password. Please try the reset link again.')
      return
    }
    onDone()
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md space-y-4">
      <h2 className="font-heading text-2xl text-brand">Choose a new password</h2>
      <label className="block text-sm font-medium text-stone-700">
        New password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          className={inputClass}
        />
      </label>
      {message && <p className="text-sm text-red-700">{message}</p>}
      <button type="submit" className={buttonClass}>Save new password</button>
    </form>
  )
}

function Dashboard({ session }) {
  const user = session.user
  const [tab, setTab] = useState('calculator')
  const [profile, setProfile] = useState(null)
  const [plan, setPlan] = useState({ ...DEFAULT_PLAN })
  const [planId, setPlanId] = useState(null)
  const [done, setDone] = useState(new Set())
  const [questions, setQuestions] = useState([])
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      // Create the profile row on first login from the details given at signup.
      let { data: profileRow } = await supabase
        .from('buyer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (!profileRow) {
        const meta = user.user_metadata || {}
        if (meta.consent_at) {
          const { data: created } = await supabase
            .from('buyer_profiles')
            .insert({
              user_id: user.id,
              full_name: meta.full_name || 'Buyer',
              phone: meta.phone || null,
              consent_at: meta.consent_at,
            })
            .select()
            .maybeSingle()
          profileRow = created
        }
      }

      const [planRes, checklistRes, questionRes] = await Promise.all([
        supabase.from('buyer_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: true }).limit(1),
        supabase.from('checklist_progress').select('item_key, done').eq('user_id', user.id),
        supabase.from('buyer_questions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      if (cancelled) return
      if (planRes.error || checklistRes.error || questionRes.error) {
        setLoadError('We had trouble loading your saved information. Please refresh the page.')
      }
      setProfile(profileRow)
      if (planRes.data && planRes.data.length > 0) {
        const row = planRes.data[0]
        setPlanId(row.id)
        setPlan({
          name: row.name,
          home_price: String(row.home_price),
          down_payment: String(row.down_payment),
          interest_rate: String(row.interest_rate),
          term_years: String(row.term_years),
          property_tax_rate: String(row.property_tax_rate),
          insurance_annual: String(row.insurance_annual),
          hoa_monthly: String(row.hoa_monthly),
        })
      }
      if (checklistRes.data) {
        setDone(new Set(checklistRes.data.filter((r) => r.done).map((r) => r.item_key)))
      }
      if (questionRes.data) setQuestions(questionRes.data)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user.id])

  const displayName = (profile && profile.full_name) || (user.user_metadata && user.user_metadata.full_name) || 'there'
  const summary = progressSummary(done)

  const tabs = [
    { id: 'calculator', label: 'Cost calculator' },
    { id: 'checklist', label: 'My checklist (' + summary.percent + '%)' },
    { id: 'ask', label: 'Ask Thomas' },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl text-brand">Welcome, {displayName}</h2>
          <p className="mt-1 text-sm text-stone-600">
            You are at: <strong className="text-brand">{summary.stage}</strong> ({summary.done} of {summary.total} steps done)
          </p>
        </div>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          className="rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
        >
          Log out
        </button>
      </div>

      <div className="mt-6 rounded-lg bg-gold/10 p-4 text-sm text-stone-700">
        <strong>I am here to help whenever you are ready to buy.</strong> I can see the plans and progress you save
        here, and I may reach out with questions to help you. If you have questions, use the Ask Thomas tab, or call
        me at <a href={'tel:' + SITE.phoneRaw} className="font-medium text-gold-dark">{SITE.phone}</a>.
      </div>

      {loadError && <p className="mt-4 text-sm text-red-700">{loadError}</p>}

      <div className="mt-8 flex flex-wrap gap-2 border-b border-stone-200" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={
              'rounded-t-md px-4 py-2 text-sm font-semibold ' +
              (tab === t.id ? 'bg-brand text-white' : 'text-stone-600 hover:bg-stone-100')
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'calculator' && (
          <Calculator user={user} plan={plan} setPlan={setPlan} planId={planId} setPlanId={setPlanId} />
        )}
        {tab === 'checklist' && <Checklist user={user} done={done} setDone={setDone} summary={summary} />}
        {tab === 'ask' && <AskThomas user={user} questions={questions} setQuestions={setQuestions} />}
      </div>

      <p className="mt-10 text-xs text-stone-500">
        These tools give estimates for planning only. They are not a loan offer, quote, or approval. A mortgage lender
        can give you actual rates and costs.
      </p>
    </div>
  )
}

function Field({ label, name, value, onChange, hint, suffix }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      {label}
      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={onChange}
          type="number"
          inputMode="decimal"
          min="0"
          step="any"
          className={inputClass}
        />
        {suffix && <span className="pointer-events-none absolute right-3 top-3 text-sm text-stone-400">{suffix}</span>}
      </div>
      {hint && <span className="mt-1 block text-xs font-normal text-stone-500">{hint}</span>}
    </label>
  )
}

function Calculator({ user, plan, setPlan, planId, setPlanId }) {
  const [saveStatus, setSaveStatus] = useState('idle')
  const costs = calculateCosts(plan)

  function update(event) {
    const { name, value } = event.target
    setPlan((prev) => ({ ...prev, [name]: value }))
    setSaveStatus('idle')
  }

  async function save() {
    setSaveStatus('saving')
    const row = {
      user_id: user.id,
      name: plan.name || 'My plan',
      home_price: Number(plan.home_price) || 0,
      down_payment: Number(plan.down_payment) || 0,
      interest_rate: Number(plan.interest_rate) || 0,
      term_years: Math.round(Number(plan.term_years)) || 30,
      property_tax_rate: Number(plan.property_tax_rate) || 0,
      insurance_annual: Number(plan.insurance_annual) || 0,
      hoa_monthly: Number(plan.hoa_monthly) || 0,
    }
    let error = null
    if (planId) {
      const res = await supabase.from('buyer_plans').update(row).eq('id', planId)
      error = res.error
    } else {
      const res = await supabase.from('buyer_plans').insert(row).select('id').single()
      error = res.error
      if (!error && res.data) setPlanId(res.data.id)
    }
    setSaveStatus(error ? 'error' : 'saved')
  }

  const rows = [
    ['Principal and interest', costs.principalAndInterest],
    ['Property tax', costs.propertyTax],
    ['Homeowners insurance', costs.insurance],
  ]
  if (costs.mortgageInsurance > 0) rows.push(['Mortgage insurance (estimate)', costs.mortgageInsurance])
  if (costs.hoa > 0) rows.push(['HOA dues', costs.hoa])

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <h3 className="font-heading text-xl text-brand">Your numbers</h3>
        <Field label="Home price" name="home_price" value={plan.home_price} onChange={update} suffix="$" />
        <Field label="Down payment" name="down_payment" value={plan.down_payment} onChange={update} suffix="$"
          hint={costs.price > 0 ? costs.downPercent.toFixed(1) + '% of the price' : ''} />
        <Field label="Interest rate" name="interest_rate" value={plan.interest_rate} onChange={update} suffix="%"
          hint="Use the rate from a lender quote when you have one. The starting value is only an example." />
        <Field label="Loan length" name="term_years" value={plan.term_years} onChange={update} suffix="years" />
        <Field label="Property tax rate" name="property_tax_rate" value={plan.property_tax_rate} onChange={update} suffix="% per year"
          hint="Varies by county and home. Ask Thomas or check the county for a specific home." />
        <Field label="Homeowners insurance" name="insurance_annual" value={plan.insurance_annual} onChange={update} suffix="$ per year"
          hint="An insurance quote will give you the real number." />
        <Field label="HOA dues (if any)" name="hoa_monthly" value={plan.hoa_monthly} onChange={update} suffix="$ per month" />
      </div>

      <div>
        <h3 className="font-heading text-xl text-brand">What it could cost</h3>
        <div className="mt-4 rounded-lg bg-brand p-6 text-white">
          <p className="text-sm uppercase tracking-wide text-gold">Estimated monthly payment</p>
          <p className="mt-1 font-heading text-4xl">{money(costs.monthlyTotal)}</p>
        </div>

        <dl className="mt-4 divide-y divide-stone-200 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between py-2">
              <dt className="text-stone-600">{label}</dt>
              <dd className="font-semibold text-stone-900">{money(value)}</dd>
            </div>
          ))}
        </dl>

        <dl className="mt-6 space-y-2 rounded-lg border border-stone-200 p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-stone-600">Loan amount</dt>
            <dd className="font-semibold">{money(costs.loan)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-600">Total interest over the loan</dt>
            <dd className="font-semibold">{money(costs.totalInterest)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-stone-600">Closing costs (rough 3% estimate)</dt>
            <dd className="font-semibold">{money(costs.closingCosts)}</dd>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-2">
            <dt className="text-stone-600">Cash needed at closing (down payment + closing costs)</dt>
            <dd className="font-semibold">{money(costs.cashNeeded)}</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center gap-4">
          <button type="button" onClick={save} disabled={saveStatus === 'saving'} className={buttonClass}>
            {saveStatus === 'saving' ? 'Saving...' : 'Save my plan'}
          </button>
          {saveStatus === 'saved' && <span className="text-sm text-brand">Saved.</span>}
          {saveStatus === 'error' && <span className="text-sm text-red-700">Could not save. Please try again.</span>}
        </div>
      </div>
    </div>
  )
}

function Checklist({ user, done, setDone, summary }) {
  const [error, setError] = useState('')

  async function toggle(key) {
    const next = new Set(done)
    const nowDone = !next.has(key)
    if (nowDone) next.add(key)
    else next.delete(key)
    setDone(next)
    setError('')

    const { error: saveError } = await supabase
      .from('checklist_progress')
      .upsert({ user_id: user.id, item_key: key, done: nowDone }, { onConflict: 'user_id,item_key' })
    if (saveError) {
      setError('That change did not save. Please check your connection and try again.')
      const revert = new Set(next)
      if (nowDone) revert.delete(key)
      else revert.add(key)
      setDone(revert)
    }
  }

  return (
    <div>
      <div className="rounded-lg border border-stone-200 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-brand">{summary.stage}</span>
          <span className="text-stone-600">{summary.percent}% complete</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-stone-200">
          <div className="h-full bg-gold" style={{ width: summary.percent + '%' }} />
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <div className="mt-6 space-y-8">
        {CHECKLIST.map((group) => (
          <div key={group.group}>
            <h3 className="font-heading text-lg text-brand">{group.group}</h3>
            <ul className="mt-3 space-y-3">
              {group.items.map((item) => (
                <li key={item.key} className="rounded-md border border-stone-200 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={done.has(item.key)}
                      onChange={() => toggle(item.key)}
                      className="mt-1 h-5 w-5"
                    />
                    <span>
                      <span className={'font-semibold ' + (done.has(item.key) ? 'text-stone-400 line-through' : 'text-stone-900')}>
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm text-stone-600">{item.help}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function AskThomas({ user, questions, setQuestions }) {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')

  async function send(event) {
    event.preventDefault()
    if (!text.trim()) return
    setStatus('sending')
    const { data, error } = await supabase
      .from('buyer_questions')
      .insert({ user_id: user.id, question: text.trim() })
      .select()
      .single()
    if (error) {
      setStatus('error')
      return
    }
    setQuestions([data, ...questions])
    setText('')
    setStatus('sent')
  }

  return (
    <div className="max-w-2xl">
      <h3 className="font-heading text-xl text-brand">Ask Thomas a question</h3>
      <p className="mt-1 text-sm text-stone-600">
        Anything about buying a home, your numbers, or the steps. I will answer you here and may also reach out by
        email or phone.
      </p>
      <form onSubmit={send} className="mt-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setStatus('idle')
          }}
          rows={4}
          required
          className={inputClass}
          placeholder="Type your question here"
        />
        <div className="flex items-center gap-4">
          <button type="submit" disabled={status === 'sending'} className={buttonClass}>
            {status === 'sending' ? 'Sending...' : 'Send question'}
          </button>
          {status === 'sent' && <span className="text-sm text-brand">Sent. Thomas will get back to you.</span>}
          {status === 'error' && <span className="text-sm text-red-700">Could not send. Please try again.</span>}
        </div>
      </form>

      {questions.length > 0 && (
        <div className="mt-8 space-y-4">
          <h4 className="font-semibold text-stone-900">Your questions</h4>
          {questions.map((q) => (
            <div key={q.id} className="rounded-md border border-stone-200 p-4 text-sm">
              <p className="text-stone-900">{q.question}</p>
              {q.answer ? (
                <p className="mt-3 rounded bg-gold/10 p-3 text-stone-800">
                  <strong>Thomas:</strong> {q.answer}
                </p>
              ) : (
                <p className="mt-2 text-xs text-stone-500">Waiting for Thomas to reply.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
