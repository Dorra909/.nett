
import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  LogOut,
  Home,
  MapPin,
  Mail,
  Search,
  Bell,
  Plus,
  Menu,
  X,
  CalendarDays,
  Wallet,
  CircleUserRound
} from 'lucide-react'

import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'

const money = n =>
  new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
    maximumFractionDigits: 0
  }).format(n || 0)

// Badge de statut
function Status({ children }) {
  const styles =
    children === 'Disponible' ||
    children === 'Actif' ||
    children === 'Confirmée'
      ? 'bg-emerald-50 text-emerald-700'
      : children === 'Réservé'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-orange-50 text-orange-700'

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>
      {children || 'En attente'}
    </span>
  )
}

// Carte statistique
function StatCard({ title, value, change, icon: Icon, tone = 'blue', sub }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700',
    violet: 'bg-violet-50 text-violet-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700'
  }

  return (
    <div className="panel p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span className="font-bold text-emerald-600">{change}</span>
        <span className="text-slate-400">{sub || 'vs. mois dernier'}</span>
      </div>
    </div>
  )
}

// Fenêtre modale
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <h3 className="font-display text-lg font-extrabold">{title}</h3>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export default function ClientSpace() {
  const { user, logout } = useAuth()

  const [page, setPage] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  const [properties, setProperties] = useState([])
  const [requests, setRequests] = useState([])
  const [messages, setMessages] = useState([])

  const [loading, setLoading] = useState(true)
  const [apiOnline, setApiOnline] = useState(false)

  const [newRequest, setNewRequest] = useState({
    propertyTitle: '',
    email: '',
    phone: '',
    message: ''
  })

  const [creating, setCreating] = useState(false)
  const [modal, setModal] = useState(null)
  const [toast, setToast] = useState('')

  // Chargement des données depuis le backend
  const loadData = async () => {
    try {
      const [props, reqs, msgs] = await Promise.all([
        api.clientProperties(),
        api.clientRequests(),
        api.clientMessages()
      ])

      setProperties(props || [])
      setRequests(reqs || [])
      setMessages(msgs || [])
      setApiOnline(true)
    } catch (error) {
      console.error('Erreur de chargement :', error)
      setApiOnline(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Notification
  const notify = msg => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Préparer une réservation pour un bien précis
  const handleReserveProperty = property => {
    setNewRequest({
      propertyTitle: property.title || '',
      email: user?.email || '',
      phone: user?.phone || '',
      message: `Bonjour, je souhaite réserver le bien "${property.title}". Merci de me contacter pour confirmer la réservation.`
    })

    setPage('properties')
    setModal('reservation')
  }

  // Envoyer une demande de réservation
  const handleCreateRequest = async e => {
    e.preventDefault()

    if (creating) return

    setCreating(true)

    try {
      await api.clientCreateRequest(newRequest)

      setNewRequest({
        propertyTitle: '',
        email: user?.email || '',
        phone: user?.phone || '',
        message: ''
      })

      setModal(null)
      notify('Votre demande de réservation a été envoyée avec succès !')

      await loadData()
    } catch (error) {
      console.error('Erreur de réservation :', error)
      alert(error.message || "Erreur lors de l'envoi de votre demande.")
    } finally {
      setCreating(false)
    }
  }

  // Modifier les champs du formulaire
  const changeRequest = e => {
    setNewRequest({
      ...newRequest,
      [e.target.name]: e.target.value
    })
  }

  // Navigation
  const nav = [
    {
      label: 'Tableau de bord',
      icon: LayoutDashboard,
      page: 'dashboard'
    },
    {
      label: 'Mes biens',
      icon: Building2,
      page: 'properties'
    },
    {
      label: 'Mes demandes',
      icon: MessageSquare,
      page: 'requests'
    },
    {
      label: 'Mes messages',
      icon: Mail,
      page: 'messages'
    },
    {
      label: 'Mon profil',
      icon: CircleUserRound,
      page: 'profile'
    }
  ]

  const visibleProperties = useMemo(
    () => properties.filter(p => p.status === 'Disponible'),
    [properties]
  )

  const stats = {
    properties: properties.length,
    available: visibleProperties.length,
    requests: requests.length,
    messages: messages.length
  }

  // Sidebar
  const Sidebar = () => (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 flex w-64 flex-col
        border-r border-slate-100 bg-white
        transform transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
        lg:shrink-0
      `}
    >
      <div className="mb-10 flex items-center justify-between px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 text-white">
            <Home size={21} />
          </div>

          <div>
            <p className="font-display text-base font-extrabold tracking-tight text-slate-900">
              estate<span className="text-blue-500">.</span>
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
              Espace Client
            </p>
          </div>
        </div>

        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <p className="mb-3 px-5 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">
        Menu principal
      </p>

      <nav className="space-y-1 px-2">
        {nav.map(n => (
          <button
            key={n.page}
            onClick={() => {
              setPage(n.page)
              setMobileOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition ${
              page === n.page
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <n.icon size={18} />
            {n.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto px-5 py-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  )

  // Barre supérieure
  const Navbar = () => (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur lg:px-9">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={20} />
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          <div
            className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold sm:flex ${
              apiOnline
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                apiOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            {apiOnline ? 'API connectée' : 'Mode démo'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-6">
        <div className="relative hidden sm:flex">
          <Search
            size={17}
            className="absolute left-3 top-3 text-slate-400"
          />
          <input
            type="text"
            className="field pl-10"
            placeholder="Rechercher un bien..."
          />
        </div>

        <button
          onClick={() => {
            setNewRequest({
              propertyTitle: '',
              email: user?.email || '',
              phone: user?.phone || '',
              message: ''
            })
            setModal('request')
          }}
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50 lg:hidden"
        >
          <Plus size={17} />
        </button>

        <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500">
          <Bell size={17} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden flex-col items-end lg:flex">
            <p className="text-xs font-bold text-slate-800">
              {user?.fullName}
            </p>
            <p className="text-[10px] text-slate-400">{user?.role}</p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700">
            {user?.fullName?.split(' ').map(n => n[0]).join('') || 'AB'}
          </div>
        </div>
      </div>
    </header>
  )

  // Formulaire réutilisable
  const RequestForm = () => (
    <form onSubmit={handleCreateRequest} className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-slate-400">
          Bien concerné
        </label>

        <input
          type="text"
          required
          name="propertyTitle"
          value={newRequest.propertyTitle}
          onChange={changeRequest}
          className="field"
          placeholder="Nom du bien immobilier"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-400">
            E-mail
          </label>

          <input
            type="email"
            required
            name="email"
            value={newRequest.email}
            onChange={changeRequest}
            className="field"
            placeholder="Votre e-mail"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-slate-400">
            Téléphone
          </label>

          <input
            type="tel"
            name="phone"
            value={newRequest.phone}
            onChange={changeRequest}
            className="field"
            placeholder="Votre téléphone"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-slate-400">
          Message
        </label>

        <textarea
          required
          name="message"
          value={newRequest.message}
          onChange={changeRequest}
          className="field"
          rows={4}
          placeholder="Décrivez votre demande..."
        />
      </div>

      <button
        type="submit"
        disabled={creating}
        className="btn-primary w-full disabled:cursor-not-allowed"
      >
        {creating ? 'Envoi en cours...' : 'Confirmer ma demande de réservation'}
      </button>
    </form>
  )

  return (
    <div className="min-h-screen bg-[#f6f7fb] lg:flex">

      <Sidebar />

      {/* Fond sombre du menu mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <main className="min-w-0 flex-1">
        <Navbar />

        <div className="mx-auto w-full max-w-[1500px] space-y-8 p-5 lg:p-9">

          {/* TABLEAU DE BORD */}
          {page === 'dashboard' && (
            <div className="space-y-7">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm text-slate-500">
                    Tableau de bord client
                  </p>

                  <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900">
                    Bonjour {user?.fullName?.split(' ')[0] || 'Client'} 👋
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Voici un aperçu de votre activité immobilière.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setNewRequest({
                      propertyTitle: '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      message: ''
                    })
                    setModal('request')
                  }}
                  className="btn-primary"
                >
                  <Plus size={17} />
                  Nouvelle demande
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Biens disponibles"
                  value={stats.available}
                  change="+0"
                  icon={Home}
                  tone="green"
                  sub="À louer ou à vendre"
                />

                <StatCard
                  title="Mes demandes"
                  value={stats.requests}
                  change="+0"
                  icon={CalendarDays}
                  tone="amber"
                  sub="En cours"
                />

                <StatCard
                  title="Mes messages"
                  value={stats.messages}
                  change="+0"
                  icon={Mail}
                  tone="blue"
                  sub="Non lus"
                />

                <StatCard
                  title="Valeur totale"
                  value={money(visibleProperties.reduce((s, p) => s + Number(p.price), 0))}
                  change=""
                  icon={Wallet}
                  tone="blue"
                  sub="Prix des biens disponibles"
                />
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
                <section className="panel p-5 lg:p-6">
                  <h3 className="font-display font-extrabold text-slate-900">
                    Biens disponibles
                  </h3>

                  <p className="mt-1 text-xs text-slate-400">
                    Les dernières propriétés en location ou vente
                  </p>

                  <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-5 py-3">Bien immobilier</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Prix</th>
                          <th className="px-5 py-3">Statut</th>
                        </tr>
                      </thead>

                      <tbody>
                        {visibleProperties.slice(0, 4).map(p => (
                          <tr key={p.id} className="border-t border-slate-50">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.imageUrl}
                                  alt={p.title || 'Bien immobilier'}
                                  className="h-10 w-12 rounded-lg object-cover"
                                  onError={e => {
                                    e.currentTarget.src =
                                      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200'
                                  }}
                                />

                                <div>
                                  <p className="font-bold text-slate-800">
                                    {p.title}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    {p.city}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 text-slate-500">
                              {p.type}
                            </td>

                            <td className="px-4 py-3 font-bold text-slate-800">
                              {money(p.price)}
                            </td>

                            <td className="px-5 py-3">
                              <Status>{p.status}</Status>
                            </td>
                          </tr>
                        ))}

                        {visibleProperties.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-sm text-slate-400">
                              Aucun bien disponible.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {visibleProperties.length > 4 && (
                    <button
                      onClick={() => setPage('properties')}
                      className="mt-4 text-xs font-bold text-brand hover:underline"
                    >
                      Voir tous les biens
                    </button>
                  )}
                </section>

                <section className="panel p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-slate-900">
                        Mes demandes récentes
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Dernières demandes envoyées
                      </p>
                    </div>

                    <button
                      onClick={() => setPage('requests')}
                      className="text-xs font-bold text-brand"
                    >
                      Tout voir
                    </button>
                  </div>

                  <div className="mt-4 space-y-4">
                    {requests.slice(0, 3).map(r => (
                      <div key={r.id} className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                          {r.clientName?.split(' ').map(x => x[0]).slice(0, 2).join('') || '?'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800">
                            {r.propertyTitle || 'Demande'}
                          </p>

                          <p className="truncate text-xs text-slate-400">
                            {r.message || ''}
                          </p>

                          <Status>{r.status}</Status>
                        </div>
                      </div>
                    ))}

                    {requests.length === 0 && (
                      <p className="py-4 text-center text-sm text-slate-500">
                        Aucune demande pour le moment.
                      </p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

          {/* MES BIENS */}
          {page === 'properties' && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h2 className="font-display text-2xl font-extrabold">
                    Biens disponibles
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Consultez les appartements et les biens disponibles à la location ou à la vente.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {visibleProperties.map(p => (
                  <article key={p.id} className="panel group overflow-hidden">

                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img
                        src={p.imageUrl}
                        alt={p.title || 'Bien immobilier'}
                        onError={e => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900'
                        }}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-white">
                        {p.transaction}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-display text-lg font-extrabold text-slate-900">
                          {p.title}
                        </p>

                        <Status>{p.status}</Status>
                      </div>

                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                        <MapPin size={13} />
                        {p.address}, {p.city}
                      </p>

                      <p className="mt-4 font-display text-xl font-extrabold text-brand">
                        {money(p.price)}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-slate-100 py-3 text-xs text-slate-500">
                        <span>🛏️ {p.bedrooms} ch.</span>
                        <span>🚿 {p.bathrooms} sdb</span>
                        <span>📐 {p.area} m²</span>

                        <span className="ml-auto rounded-md bg-slate-50 px-2 py-1">
                          {p.type}
                        </span>
                      </div>

                      {/* BOUTON DE RÉSERVATION */}
                      <div className="mt-4">
                        <button
                          onClick={() => handleReserveProperty(p)}
                          className="btn-primary w-full"
                        >
                          <CalendarDays size={17} />
                          Réserver ce bien
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {visibleProperties.length === 0 && (
                  <div className="panel p-12 text-center text-sm text-slate-400 md:col-span-2 2xl:col-span-3">
                    Aucun bien disponible pour le moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MES DEMANDES */}
          {page === 'requests' && (
            <div className="space-y-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <h2 className="font-display text-2xl font-extrabold">
                    Mes demandes
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Suivez vos demandes de visite et de réservation.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setNewRequest({
                      propertyTitle: '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      message: ''
                    })
                    setModal('request')
                  }}
                  className="btn-primary"
                >
                  <Plus size={17} />
                  Nouvelle demande
                </button>
              </div>

              <div className="space-y-3">
                {requests.map(r => (
                  <div key={r.id} className="panel p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <CalendarDays size={20} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-slate-800">
                            {r.clientName || 'Client'}
                          </p>
                          <Status>{r.status}</Status>
                        </div>

                        <p className="mt-1 text-sm font-semibold text-slate-700">
                          {r.propertyTitle || 'Bien'}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {r.email || ''} · {r.phone || ''}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          {r.message || ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {requests.length === 0 && (
                  <div className="panel p-12 text-center text-sm text-slate-400">
                    Aucune demande pour le moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MES MESSAGES */}
          {page === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold">
                  Mes messages
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Boîte de réception de vos messages.
                </p>
              </div>

              <div className="panel divide-y divide-slate-100">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-start ${
                      !m.isRead ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <Mail size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-slate-800">
                          {m.senderName || 'Expéditeur'}
                        </p>

                        {!m.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-600" />
                        )}

                        <span className="text-xs text-slate-400">
                          {m.email || ''}
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-semibold text-slate-700">
                        {m.subject || 'Sujet'}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {m.content || ''}
                      </p>
                    </div>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="p-12 text-center text-sm text-slate-400">
                    Aucun message pour le moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MON PROFIL */}
          {page === 'profile' && (
            <div className="space-y-6">
              <div className="panel p-5">
                <h3 className="mb-4 font-display font-extrabold text-slate-900">
                  Mon profil
                </h3>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-slate-400">Nom</p>
                    <p className="text-sm text-slate-700">{user?.fullName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-slate-400">E-mail</p>
                    <p className="text-sm text-slate-700">{user?.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-slate-400">Téléphone</p>
                    <p className="text-sm text-slate-700">{user?.phone}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-slate-400">Rôle</p>
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {user?.role}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase text-slate-400">Statut</p>
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                      Actif
                    </span>
                  </div>
                </div>
              </div>

              <div className="panel p-5">
                <h3 className="mb-4 font-display font-extrabold text-slate-900">
                  Nouvelle demande
                </h3>

                <p className="mb-4 text-sm text-slate-500">
                  Demandez une visite ou plus d'informations sur un bien.
                </p>

                <RequestForm />
              </div>
            </div>
          )}

          {/* MODAL DE RÉSERVATION */}
          {(modal === 'reservation' || modal === 'request') && (
            <Modal
              title={
                modal === 'reservation'
                  ? 'Réserver ce bien immobilier'
                  : 'Nouvelle demande'
              }
              onClose={() => setModal(null)}
            >
              {modal === 'reservation' && (
                <div className="mb-5 rounded-xl bg-blue-50 p-4">
                  <p className="text-sm font-semibold text-blue-800">
                    Votre demande concerne :
                  </p>
                  <p className="mt-1 text-sm text-blue-700">
                    {newRequest.propertyTitle}
                  </p>
                  <p className="mt-2 text-xs text-blue-600">
                    Envoyez votre demande afin que l'agence puisse vous contacter.
                  </p>
                </div>
              )}

              <RequestForm />
            </Modal>
          )}

        </div>
      </main>

      {/* Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[70] rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  )
}
