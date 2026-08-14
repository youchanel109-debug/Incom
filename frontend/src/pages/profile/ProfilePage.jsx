import { useEffect, useState } from 'react'
import { ArrowLeft, LogOut, Camera, User } from 'lucide-react'

export default function Profile({ currentUser, onUpdateCurrentUser, onNavigate, onLogout }) {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    profilePicture: '',
  })
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    if (currentUser) {
      setFormState({
        username: currentUser.username || '',
        email: currentUser.email || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        profilePicture: currentUser.profilePicture || '',
      })
    }
  }, [currentUser])

  const handleChange = field => event => {
    setFormState(prev => ({ ...prev, [field]: event.target.value }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormState(prev => ({ ...prev, profilePicture: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = event => {
    event.preventDefault()
    if (!formState.username.trim() || !formState.email.trim()) {
      setActionMessage('Username and email are required.')
      return
    }

    onUpdateCurrentUser({
      username: formState.username.trim(),
      email: formState.email.trim(),
      firstName: formState.firstName.trim(),
      lastName: formState.lastName.trim(),
      profilePicture: formState.profilePicture,
    })
    setActionMessage('Profile updated successfully.')
  }

  return (
    <div className="app-shell min-h-screen animate-bgPulse">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Admin Profile</h2>
            <p className="mt-1 text-sm text-slate-500">Update your admin profile details and account information.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => onNavigate('/dashboard')} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-slate-900">Profile Details</h3>
            <p className="mt-1 text-sm text-slate-500">Your admin profile information is only visible to you.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="mb-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 shrink-0 rounded-full border-4 border-slate-50 bg-slate-100 shadow-md">
                {formState.profilePicture ? (
                  <img src={formState.profilePicture} alt="Profile" className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
                    <User size={48} />
                  </div>
                )}
                <label className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-indigo-600 text-white shadow-sm transition hover:bg-indigo-500">
                  <Camera size={16} />
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Profile Picture</h4>
                <p className="mt-1 text-xs text-slate-500">Upload a new avatar.<br/>Recommended size is 256x256px.</p>
              </div>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Username
              <input
                value={formState.username}
                onChange={handleChange('username')}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                value={formState.email}
                onChange={handleChange('email')}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              First Name
              <input
                value={formState.firstName}
                onChange={handleChange('firstName')}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Last Name
              <input
                value={formState.lastName}
                onChange={handleChange('lastName')}
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
              Save Profile
            </button>
          </form>

          {actionMessage && <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">{actionMessage}</div>}
        </section>
      </main>
    </div>
  )
}
