import { useState } from 'react'
import { Mail, Lock, User, Phone } from 'lucide-react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Signup({ onLoginSuccess }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'Client'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      onLoginSuccess()
    } catch (err) {
      setError(err.message || 'Inscription échouée')
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
              <UserPlusIcon size={20} className="text-white" />
            </div>
            <h2 className="font-display text-2xl font-extrabold text-slate-900">Créer un compte</h2>
            <p className="text-sm text-slate-500">Rejoignez votre espace client</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Nom complet</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  name="fullName"
                  value={form.fullName}
                  onChange={change}
                  className="field pl-10"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Adresse e-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  name="email"
                  value={form.email}
                  onChange={change}
                  className="field pl-10"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Téléphone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={change}
                  className="field pl-10"
                  placeholder="+216 XX XXX XXX"
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
                  name="password"
                  value={form.password}
                  onChange={change}
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

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600">Rôle</label>
              <select
                name="role"
                value={form.role}
                onChange={change}
                className="field"
              >
                <option>Client</option>
                <option>Agent</option>
              </select>
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 px-4 py-3 text-xs text-rose-600">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Déjà un compte ? <span className="text-blue-600 font-semibold underline cursor-pointer" onClick={() => onLoginSuccess()}>Se connecter</span>
          </p>
        </div>
      </div>
    </div>
  )
}

function UserPlusIcon({ size, className }) {
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
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" x2="20" y1="8" y2="14" />
      <line x1="16" x2="8" y1="14" y2="8" />
    </svg>
  )
}