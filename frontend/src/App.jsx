import { useEffect, useState } from 'react'
import Dashboard from './pages/dashboard/UserDashboard'
import Profile from './pages/profile/ProfilePage'
import AuthPage from './pages/auth/AuthPage'

import { authApi } from './services/api'

const normalizeRoute = route => {
  const clean = route.replace(/\/$/, '')
  if (clean === '' || clean === '/') return '/dashboard'
  return clean
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('currentUser'))
    } catch {
      return null
    }
  })
  const [route, setRoute] = useState(() => normalizeRoute(window.location.pathname))
  const [loginError, setLoginError] = useState('')
  const loggedIn = Boolean(currentUser)
  const isAdmin = true // In single-user system, the logged in user is always the admin

  const saveCurrentUser = user => {
    setCurrentUser(user)
    if (user) localStorage.setItem('currentUser', JSON.stringify(user))
    else localStorage.removeItem('currentUser')
  }

  const navigate = path => {
    const nextPath = normalizeRoute(path.startsWith('/') ? path : `/${path}`)
    window.history.pushState({}, '', nextPath)
    setRoute(nextPath)
  }

  useEffect(() => {
    const onPopState = () => setRoute(normalizeRoute(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const handleLogin = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password.trim()) {
      setLoginError('Please enter both email and password.')
      return
    }

    try {
      await authApi.login(normalizedEmail, password)
      setLoginError('')
      saveCurrentUser({ id: 0, username: 'admin', email: normalizedEmail, role: 'admin', isActive: true, lastLogin: new Date().toISOString() })
      navigate('/dashboard')
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials')
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (e) {
      console.error('Logout failed:', e)
    }
    saveCurrentUser(null)
    navigate('/login')
  }

  const handleUpdateCurrentUser = updatedFields => {
    if (!currentUser) return
    const updatedUser = { ...currentUser, ...updatedFields }
    saveCurrentUser(updatedUser)
  }

  const routeToPage = page => {
    switch (page) {
      case '/login':
        return 'login'
      case '/profile':
        return 'profile'
      default:
        return 'dashboard'
    }
  }

  const page = routeToPage(route)

  useEffect(() => {
    if (!loggedIn && page !== 'login') {
      navigate('/login')
      return
    }

    if (!loggedIn) return

    if (page === 'login') {
      navigate('/dashboard')
      return
    }
  }, [loggedIn, page])

  if (!loggedIn) {
    return (
      <AuthPage
        onLogin={handleLogin}
        error={loginError}
      />
    )
  }

  return (
    <div className="app-shell min-h-screen animate-bgPulse">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {page === 'dashboard' && <Dashboard isAdmin={isAdmin} onNavigate={navigate} onLogout={handleLogout} />}
        {page === 'profile' && <Profile onNavigate={navigate} onLogout={handleLogout} currentUser={currentUser} onUpdateCurrentUser={handleUpdateCurrentUser} />}
      </main>
    </div>
  )
}
