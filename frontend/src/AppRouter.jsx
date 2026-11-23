import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ClientSpace from './pages/ClientSpace'
import App from './App'

export default function AppRouter() {
  const { user, login, logout, loading, isAuthenticated } = useAuth()
  const [initialLoad, setInitialLoad] = useState(true)
  const [showSignup, setShowSignup] = useState(false)

  useEffect(() => {
    setInitialLoad(false)
  }, [])

  if (initialLoad || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (showSignup) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
          <div className="w-full max-w-md">
            <Signup onLoginSuccess={() => setShowSignup(false)} />
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md">
          <Login onLoginSuccess={() => {}} onSignup={() => setShowSignup(true)} />
        </div>
      </div>
    )
  }

  if (user?.role === 'Client') {
    return <ClientSpace />
  }

  return <App />
}