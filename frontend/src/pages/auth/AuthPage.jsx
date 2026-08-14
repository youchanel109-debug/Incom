import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'

export default function AuthPage({ onLogin, error }) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false })

  const validateLogin = () => {
    if (!loginData.email || !loginData.password) {
      setFormError('Both email and password are required.')
      return false
    }
    return true
  }

  const handleLoginSubmit = async e => {
    e.preventDefault()
    if (!validateLogin()) return
    setFormError('')
    setIsLoading(true)
    try {
      await Promise.resolve(onLogin({ email: loginData.email.trim(), password: loginData.password.trim(), remember: loginData.remember }))
    } catch (err) {
      setFormError(err?.message || 'Unable to login. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_36%),radial-gradient(circle_at_bottom,_rgba(168,85,247,0.16),_transparent_28%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/95 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <div className="grid gap-0 xl:grid-cols-[1.1fr_1fr]">
            <div className="hidden rounded-l-[32px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-12 lg:block">
              <div className="flex h-full flex-col justify-between text-slate-300">
                <div>
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-200 shadow-lg shadow-slate-950/20">
                    <User size={16} /> Budget Management System
                  </div>
                  <h2 className="mt-10 text-4xl font-semibold text-white">Manage your budget with confidence.</h2>
                  <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">Track income, expenses, savings, budgets, and reports in a modern dashboard designed for clarity and control.</p>
                </div>
                <div className="space-y-4 text-sm text-slate-500">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold text-slate-100">Financial clarity</p>
                    <p className="mt-2">Create budgets, review expenses, and plan savings easily.</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold text-slate-100">Secure accounts</p>
                    <p className="mt-2">Admin-only access for secure budget management.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-10 lg:px-12">
              <div className="mb-8 flex flex-col gap-2 text-center">
                <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-900 text-sky-400 shadow-lg shadow-sky-500/20">
                  <User size={28} />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-400">Budget Management</p>
                  <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Admin Login</h1>
                  <p className="mt-2 text-sm text-slate-400">Log in to access your dashboard.</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-700 bg-slate-950/95 p-6 shadow-[0_20px_90px_-50px_rgba(15,23,42,0.8)]">
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <label className="block text-sm font-medium text-slate-200">
                    <span className="mb-2 flex items-center gap-2 text-slate-300"><Mail size={16} /> Email Address</span>
                    <input
                      value={loginData.email}
                      onChange={e => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      type="email"
                      autoComplete="email"
                      autoCapitalize="none"
                      placeholder="admin@example.com"
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
                    />
                  </label>

                  <label className="block text-sm font-medium text-slate-200">
                    <span className="mb-2 flex items-center gap-2 text-slate-300"><Lock size={16} /> Password</span>
                    <div className="relative mt-2">
                      <input
                        value={loginData.password}
                        onChange={e => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="w-full rounded-3xl border border-slate-700 bg-slate-950/90 px-4 py-3 pr-12 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
                      />
                      <button type="button" onClick={() => setShowPassword(prev => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <label className="inline-flex items-center gap-2 text-sm text-slate-400">
                      <input type="checkbox" checked={loginData.remember} onChange={e => setLoginData(prev => ({ ...prev, remember: e.target.checked }))} className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-400 focus:ring-sky-400" />
                      Remember Me
                    </label>
                  </div>

                  {formError || error ? (
                    <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{formError || error}</div>
                  ) : null}

                  <button type="submit" disabled={isLoading} className="inline-flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-sky-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-sky-500/30 disabled:cursor-not-allowed disabled:opacity-70">
                    {isLoading ? 'Processing...' : 'Login'}
                  </button>
                </form>
              </div>

              <p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-slate-600">© 2026 Budget Management System</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
