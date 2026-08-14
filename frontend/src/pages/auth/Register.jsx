import { useState } from 'react'
import { Lock, UserCircle, Mail } from 'lucide-react'

export default function Register({ onRegister, error, onNavigate }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', firstName: '', lastName: '' })

  const handleChange = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }))
  const handleSubmit = e => {
    e.preventDefault()
    onRegister(form)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="login-bg absolute inset-0 -z-10" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="login-card w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/90 p-8 shadow-[0_32px_90px_-40px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-200 ring-2 ring-indigo-400/30 shadow-lg shadow-indigo-500/10 animate-pulse-slow">
              <UserCircle size={28} />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Create an account</h1>
            <p className="mt-2 text-sm text-slate-400">Register as a new user for your budget app.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block space-y-2 text-sm font-medium text-slate-300">
              <span className="text-slate-200">Username</span>
              <input value={form.username} onChange={handleChange('username')} placeholder="Username" className="w-full rounded-3xl border border-slate-700 bg-slate-950/75 px-4 py-3 text-sm text-white transition duration-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10" />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-300">
              <span className="text-slate-200">Email</span>
              <input type="email" value={form.email} onChange={handleChange('email')} placeholder="Email" className="w-full rounded-3xl border border-slate-700 bg-slate-950/75 px-4 py-3 text-sm text-white transition duration-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10" />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-300">
              <span className="text-slate-200">Password</span>
              <input type="password" value={form.password} onChange={handleChange('password')} placeholder="Password" className="w-full rounded-3xl border border-slate-700 bg-slate-950/75 px-4 py-3 text-sm text-white transition duration-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10" />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-300">
              <span className="text-slate-200">First Name</span>
              <input value={form.firstName} onChange={handleChange('firstName')} placeholder="First name" className="w-full rounded-3xl border border-slate-700 bg-slate-950/75 px-4 py-3 text-sm text-white transition duration-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10" />
            </label>
            <label className="block space-y-2 text-sm font-medium text-slate-300">
              <span className="text-slate-200">Last Name</span>
              <input value={form.lastName} onChange={handleChange('lastName')} placeholder="Last name" className="w-full rounded-3xl border border-slate-700 bg-slate-950/75 px-4 py-3 text-sm text-white transition duration-200 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10" />
            </label>
            <button type="submit" className="group inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/30">Register</button>
          </form>

          {error && <div className="mt-5 rounded-3xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 shadow-sm">{error}</div>}

          <div className="mt-5 text-center text-sm text-slate-400">
            Already have an account? <button type="button" onClick={() => onNavigate('/login')} className="font-semibold text-white underline">Sign in</button>
          </div>
        </div>
      </div>
    </div>
  )
}
