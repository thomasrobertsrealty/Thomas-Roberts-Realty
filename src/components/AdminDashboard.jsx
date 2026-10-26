import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { ALL_ITEMS, calculateCosts, money, progressSummary } from '../lib/buyerTools.js'

const inputClass =
  'mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 focus:border-gold-dark focus:outline-none focus:ring-2 focus:ring-gold/40'

export default function AdminDashboard() {
  const [state, setState] = useState('loading') // loading | signedout | denied | ready
  const [data, setData] = useState({ profiles: [], plans: [], progress: [], questions: [], subscribers: [] })
  const [login, setLogin] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')

  async function loadAll() {
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      setState('signedout')
      return
    }
    const { data: isAdmin } = await supabase.rpc('is_admin')
    if (!isAdmin) {
      setState('denied')
      return
    }
    const [profiles, plans, progress, questions, subscribers] = await Promise.all([
      supabase.from('buyer_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('buyer_plans').select('*'),
      supabase.from('checklist_progress').select('user_id, item_key, done'),
      supabase.from('buyer_questions').select('*').order('created_at', { ascending: false }),
      supabase.from('email_subscribers').select('email, consent_at, source, unsubscribed_at').order('consent_at', { ascending: false }),
    ])
    setData({
      profiles: profiles.data || [],
      plans: plans.data || [],
      progress: progress.data || [],
      questions: questions.data || [],
      subscribers: subscribers.data || [],
    })
    setState('ready')
  }

  useEffect(() => {
    loadAll()
  }, [])

  async function signIn(event) {
    event.preventDefault()
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword(login)
    if (error) {
      setLoginError('That email and password did not match.')
      return
    }
    loadAll()
  }

  if (state === 'loading') return <p className="mt-6 text-stone-500">Loading...</p>

  if (state === 'signedout') {
    return (
      <form onSubmit={signIn} className="mt-6 max-w-sm space-y-4">
        <label className="block text-sm font-medium text-stone-700">
          Email
          <input type="email" required value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-stone-700">
          Password
          <input type="password" required value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} className={inputClass} />
        </label>
        {loginError && <p className="text-sm text-red-700">{loginError}</p>}
        <button type="submit" className="rounded-full bg-gold px-6 py-3 font-semibold text-brand-dark hover:bg-gold-dark">Log in</button>
      </form>
    )
  }

  if (state === 'denied') {
    return (
      <div className="mt-6">
        <p className="text-stone-700">This page is private. This account does not have access.</p>
        <button type="button" onClick={() => supabase.auth.signOut().then(loadAll)} className="mt-4 rounded-full border border-stone-300 px-4 py-2 text-sm">
          Log out
        </button>
      </div>
    )
  }

  return <Ready data={data} reload={loadAll} />
}

function Ready({ data, reload }) {
  const openQuestions = data.questions.filter((q) => q.status === 'open')
  const nameFor = (id) => {
    const p = data.profiles.find((x) => x.user_id === id)
    return p ? p.full_name : 'Unknown buyer'
  }

  return (
    <div className="mt-6 space-y-12">
      <div className="flex justify-between">
        <p className="text-sm text-stone-600">
          {data.profiles.length} buyers, {openQuestions.length} open questions, {data.subscribers.filter((s) => !s.unsubscribed_at).length} email subscribers
        </p>
        <button type="button" onClick={() => supabase.auth.signOut().then(reload)} className="rounded-full border border-stone-300 px-4 py-2 text-sm">
          Log out
        </button>
      </div>

      <section>
        <h2 className="font-heading text-xl text-brand">Questions from buyers</h2>
        {data.questions.length === 0 && <p className="mt-3 text-sm text-stone-500">No questions yet.</p>}
        <div className="mt-4 space-y-4">
          {data.questions.map((q) => (
            <QuestionCard key={q.id} q={q} buyer={nameFor(q.user_id)} reload={reload} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-xl text-brand">Buyers</h2>
        {data.profiles.length === 0 && <p className="mt-3 text-sm text-stone-500">No buyers yet.</p>}
        <div className="mt-4 space-y-4">
          {data.profiles.map((p) => {
            const doneKeys = new Set(data.progress.filter((r) => r.user_id === p.user_id && r.done).map((r) => r.item_key))
            const summary = progressSummary(doneKeys)
            const plan = data.plans.find((x) => x.user_id === p.user_id)
            const costs = plan ? calculateCosts(plan) : null
            const nextSteps = ALL_ITEMS.filter((i) => !doneKeys.has(i.key)).slice(0, 3)
            return (
              <div key={p.user_id} className="rounded-md border border-stone-200 p-4 text-sm">
                <p className="font-semibold text-stone-900">{p.full_name}</p>
                <p className="text-stone-600">{p.phone || 'No phone given'}</p>
                <p className="mt-2 text-stone-800">
                  {summary.stage} ({summary.percent}% of checklist)
                </p>
                {costs && costs.price > 0 ? (
                  <p className="text-stone-800">
                    Plan: {money(costs.price)} home, {money(costs.down)} down, about {money(costs.monthlyTotal)} per month
                  </p>
                ) : (
                  <p className="text-stone-500">No saved plan yet.</p>
                )}
                {nextSteps.length > 0 && (
                  <p className="mt-1 text-stone-500">Next steps: {nextSteps.map((i) => i.title).join('; ')}</p>
                )}
                <p className="mt-1 text-xs text-stone-400">Agreed to be contacted: {new Date(p.consent_at).toLocaleDateString()}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="font-heading text-xl text-brand">Email subscribers</h2>
        {data.subscribers.length === 0 && <p className="mt-3 text-sm text-stone-500">No subscribers yet.</p>}
        <ul className="mt-4 divide-y divide-stone-200 text-sm">
          {data.subscribers.map((s) => (
            <li key={s.email} className="flex justify-between py-2">
              <span className={s.unsubscribed_at ? 'text-stone-400 line-through' : 'text-stone-800'}>{s.email}</span>
              <span className="text-stone-500">{new Date(s.consent_at).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function QuestionCard({ q, buyer, reload }) {
  const [answer, setAnswer] = useState(q.answer || '')
  const [status, setStatus] = useState('idle')

  async function send(event) {
    event.preventDefault()
    setStatus('saving')
    const { error } = await supabase
      .from('buyer_questions')
      .update({ answer: answer.trim(), status: 'answered', answered_at: new Date().toISOString() })
      .eq('id', q.id)
    if (error) {
      setStatus('error')
      return
    }
    setStatus('idle')
    reload()
  }

  return (
    <form onSubmit={send} className="rounded-md border border-stone-200 p-4 text-sm">
      <p className="text-xs text-stone-500">
        {buyer} &middot; {new Date(q.created_at).toLocaleString()} &middot; {q.status}
      </p>
      <p className="mt-1 text-stone-900">{q.question}</p>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={3}
        required
        placeholder="Type your reply"
        className={inputClass}
      />
      <div className="mt-2 flex items-center gap-3">
        <button type="submit" disabled={status === 'saving'} className="rounded-full bg-gold px-4 py-2 font-semibold text-brand-dark hover:bg-gold-dark">
          {q.status === 'answered' ? 'Update reply' : 'Send reply'}
        </button>
        {status === 'error' && <span className="text-red-700">Could not save.</span>}
      </div>
    </form>
  )
}
