import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Login({ onLoginSuccess, onSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      onLoginSuccess()
    } catch (err) {
      setError(err.message || 'Connexion échouée')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-100 bg-white shadow-soft p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 mx-auto mb-4">
              <HomeIcon size={20} className="text-white" />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900">Connexion</h2>
            <p className="text-sm text-slate-500">Bienvenue sur votre espace d'administration</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Adresse e-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field pl-10"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Mot de passe</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-blue-600"
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 px-4 py-3 text-xs text-rose-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Identifiants de démo : <strong>amira@example.com</strong> / <strong>123456</strong>
          </p>
          <p className="mt-4 text-center text-xs text-slate-500">
            Pas de compte ?{' '}
            <span className="text-blue-600 font-semibold underline cursor-pointer" onClick={onSignup}>
              Créer un compte
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

function HomeIcon({ size, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12l2-2m0 0l7-7 7 7M5 19v14a2 2 0 002 2h14a2 2 0 002-2v-14" />
      <polyline points="2 2 12 12 22 2" />
      <polyline points="2 12 12 12 22 12" />
    </svg>
  )
}