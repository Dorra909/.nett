import { useEffect, useMemo, useState } from 'react'
import {
  LayoutDashboard, Building2, Users, ClipboardList, MessageSquare, Settings,
  Search, Bell, Plus, MoreHorizontal, ArrowUpRight, ArrowDownRight, Menu,
  X, MapPin, BedDouble, Bath, Maximize2, Pencil, Trash2, Eye, CheckCircle2,
  Clock3, Mail, Phone, ChevronDown, Filter, TrendingUp, Home, Wallet,
  CalendarDays, CircleUserRound, LogOut, RefreshCw
} from 'lucide-react'
import { useAuth } from './context/AuthContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { api } from './services/api'

const money = n => new Intl.NumberFormat('fr-TN', { style: 'currency', currency: 'TND', maximumFractionDigits: 0 }).format(n || 0)
const initialProperties = [
  { id: 1, title: 'Villa contemporaine avec piscine', city: 'Tunis', address: 'Les Jardins de Carthage', type: 'Villa', transaction: 'Vente', price: 780000, area: 320, bedrooms: 4, bathrooms: 3, status: 'Disponible', imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900' },
  { id: 2, title: 'Appartement lumineux au centre', city: 'Tunis', address: 'Centre urbain nord', type: 'Appartement', transaction: 'Location', price: 1800, area: 115, bedrooms: 3, bathrooms: 2, status: 'Disponible', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900' },
  { id: 3, title: 'Maison familiale avec terrasse', city: 'Nabeul', address: 'Hammamet Nord', type: 'Maison', transaction: 'Vente', price: 420000, area: 210, bedrooms: 3, bathrooms: 2, status: 'Réservé', imageUrl: 'https://images.unsplash.com/photo-160004-ben-placeholder?w=900' },
]
const demoUsers = [
  { id: 1, fullName: 'Amira Ben Salem', email: 'amira@example.com', phone: '+216 22 345 678', role: 'Administrateur', status: 'Actif' },
  { id: 2, fullName: 'Yassine Trabelsi', email: 'yassine@example.com', phone: '+216 55 123 456', role: 'Agent', status: 'Actif' },
  { id: 3, fullName: 'Sarra Khelifi', email: 'sarra@example.com', phone: '+216 98 765 432', role: 'Client', status: 'Actif' },
]
const nav = [
  { label: 'Vue générale', icon: LayoutDashboard, page: 'dashboard' },
  { label: 'Biens immobiliers', icon: Building2, page: 'properties' },
  { label: 'Utilisateurs', icon: Users, page: 'users' },
  { label: 'Demandes', icon: ClipboardList, page: 'requests' },
  { label: 'Messages', icon: MessageSquare, page: 'messages' },
]
const chartData = [{ month: 'Jan', value: 18 }, { month: 'Fév', value: 25 }, { month: 'Mar', value: 21 }, { month: 'Avr', value: 34 }, { month: 'Mai', value: 29 }, { month: 'Juin', value: 42 }, { month: 'Juil', value: 38 }, { month: 'Août', value: 53 }, { month: 'Sep', value: 47 }, { month: 'Oct', value: 64 }, { month: 'Nov', value: 58 }, { month: 'Déc', value: 72 }]
const sampleRequests = [
  { id: 1, clientName: 'Nour Ben Ali', email: 'nour@example.com', phone: '+216 20 111 222', propertyTitle: 'Villa contemporaine avec piscine', requestedAt: new Date().toISOString(), status: 'En attente', message: 'Je souhaite visiter le bien samedi.' },
  { id: 2, clientName: 'Karim Mansour', email: 'karim@example.com', phone: '+216 21 333 444', propertyTitle: 'Appartement lumineux au centre', requestedAt: new Date().toISOString(), status: 'Confirmée', message: 'Disponible après 16h.' },
  { id: 3, clientName: 'Meriem Gharbi', email: 'meriem@example.com', phone: '+216 27 555 666', propertyTitle: 'Studio meublé moderne', requestedAt: new Date().toISOString(), status: 'En attente', message: 'Merci de me contacter.' },
]
const sampleMessages = [
  { id: 1, senderName: 'Ali Mabrouk', email: 'ali@example.com', subject: 'Question sur une villa', content: 'Bonjour, le prix est-il négociable ?', sentAt: new Date().toISOString(), isRead: false },
  { id: 2, senderName: 'Rim Saidi', email: 'rim@example.com', subject: 'Demande de partenariat', content: 'Nous souhaitons discuter d’un partenariat.', sentAt: new Date().toISOString(), isRead: true },
]
function Status({ children }) {
  const styles = children === 'Disponible' || children === 'Actif' || children === 'Confirmée' ? 'bg-emerald-50 text-emerald-700' : children === 'Réservé' ? 'bg-amber-50 text-amber-700' : 'bg-orange-50 text-orange-700'
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>{children}</span>
}
function StatCard({ title, value, change, icon: Icon, tone = 'blue', sub }) {
  const tones = { blue: 'bg-blue-50 text-blue-700', violet: 'bg-violet-50 text-violet-700', amber: 'bg-amber-50 text-amber-700', green: 'bg-emerald-50 text-emerald-700' }
  return <div className="panel p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900">{value}</p></div><div className={`rounded-xl p-3 ${tones[tone]}`}><Icon size={21}/></div></div><div className="mt-4 flex items-center gap-2 text-xs"><span className="flex items-center gap-1 font-bold text-emerald-600"><ArrowUpRight size={14}/>{change}</span><span className="text-slate-400">{sub || 'vs. mois dernier'}</span></div></div>
}
function Modal({ title, onClose, children }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"><div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4"><h3 className="font-display text-lg font-extrabold">{title}</h3><button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"><X size={19}/></button></div><div className="p-6">{children}</div></div></div>
}
function PropertyForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(item || { title:'', address:'', city:'Tunis', type:'Appartement', transaction:'Vente', price:'', area:'', bedrooms:2, bathrooms:1, status:'Disponible', imageUrl:'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900', description:'' })
  const change = e => setForm({ ...form, [e.target.name]: e.target.value })
  return <form onSubmit={e => { e.preventDefault(); onSave({ ...form, price:Number(form.price), area:Number(form.area), bedrooms:Number(form.bedrooms), bathrooms:Number(form.bathrooms) }) }} className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2 text-sm font-semibold text-slate-600">Titre du bien<input required name="title" value={form.title} onChange={change} className="field mt-1.5" placeholder="Ex. Appartement avec terrasse"/></label>
    <label className="text-sm font-semibold text-slate-600">Adresse<input name="address" value={form.address} onChange={change} className="field mt-1.5"/></label><label className="text-sm font-semibold text-slate-600">Ville<input required name="city" value={form.city} onChange={change} className="field mt-1.5"/></label>
    <label className="text-sm font-semibold text-slate-600">Type<select name="type" value={form.type} onChange={change} className="field mt-1.5">{['Appartement','Villa','Maison','Studio','Terrain','Bureau'].map(x=><option>{x}</option>)}</select></label>
    <label className="text-sm font-semibold text-slate-600">Transaction<select name="transaction" value={form.transaction} onChange={change} className="field mt-1.5"><option>Vente</option><option>Location</option></select></label>
    <label className="text-sm font-semibold text-slate-600">Prix (TND)<input required type="number" min="0" name="price" value={form.price} onChange={change} className="field mt-1.5"/></label><label className="text-sm font-semibold text-slate-600">Surface (m²)<input type="number" min="0" name="area" value={form.area} onChange={change} className="field mt-1.5"/></label>
    <label className="text-sm font-semibold text-slate-600">Chambres<input type="number" min="0" name="bedrooms" value={form.bedrooms} onChange={change} className="field mt-1.5"/></label><label className="text-sm font-semibold text-slate-600">Salles de bain<input type="number" min="0" name="bathrooms" value={form.bathrooms} onChange={change} className="field mt-1.5"/></label>
    <label className="text-sm font-semibold text-slate-600">Statut<select name="status" value={form.status} onChange={change} className="field mt-1.5"><option>Disponible</option><option>Réservé</option><option>Vendu</option><option>Loué</option></select></label>
    <label className="text-sm font-semibold text-slate-600">URL de l'image<input name="imageUrl" value={form.imageUrl} onChange={change} className="field mt-1.5"/></label>
    <label className="sm:col-span-2 text-sm font-semibold text-slate-600">Description<textarea name="description" value={form.description} onChange={change} className="field mt-1.5" rows="3"/></label></div>
    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={onCancel} className="btn-light">Annuler</button><button className="btn-primary"><CheckCircle2 size={16}/>Enregistrer</button></div>
  </form>
}
function App() {
  const [page, setPage] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [properties, setProperties] = useState(initialProperties)
  const [users, setUsers] = useState(demoUsers)
  const [requests, setRequests] = useState(sampleRequests)
  const [messages, setMessages] = useState(sampleMessages)
  const [dashboard, setDashboard] = useState(null)
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [toast, setToast] = useState('')
  const [apiOnline, setApiOnline] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user, logout } = useAuth()

  const refresh = async () => {
    setLoading(true)
    try {
      const [d,p,u,r,m] = await Promise.all([api.dashboard(), api.properties(), api.users(), api.requests(), api.messages()])
      setDashboard(d); setProperties(p); setUsers(u); setRequests(r); setMessages(m); setApiOnline(true)
    } catch { setApiOnline(false) } finally { setLoading(false) }
  }
  useEffect(() => { refresh() }, [])
  const notify = msg => { setToast(msg); setTimeout(() => setToast(''), 2600) }
  const visibleProperties = useMemo(() => properties.filter(p => `${p.title} ${p.city} ${p.address}`.toLowerCase().includes(query.toLowerCase())), [properties, query])
  const stats = {
    properties: dashboard?.totalProperties ?? properties.length,
    available: dashboard?.availableProperties ?? properties.filter(p=>p.status==='Disponible').length,
    users: dashboard?.totalUsers ?? users.length,
    pending: dashboard?.pendingRequests ?? requests.filter(r=>r.status==='En attente').length,
    messages: dashboard?.unreadMessages ?? messages.filter(m=>!m.isRead).length,
    value: dashboard?.totalValue ?? properties.filter(p=>p.transaction==='Vente').reduce((s,p)=>s+Number(p.price),0)
  }
  const saveProperty = async data => {
    try { if(editing) await api.updateProperty(editing.id, {...editing,...data}); else await api.createProperty(data); await refresh(); notify('Bien enregistré avec succès.') }
    catch { if(editing) setProperties(a=>a.map(x=>x.id===editing.id?{...x,...data}:x)); else setProperties(a=>[{...data,id:Date.now()},...a]); notify('Mode démonstration : modification locale.') }
    setModal(null); setEditing(null)
  }
  const removeProperty = async id => {
    if(!confirm('Supprimer définitivement ce bien ?')) return
    try { await api.deleteProperty(id); await refresh() } catch { setProperties(a=>a.filter(x=>x.id!==id)) }
    notify('Bien supprimé.')
  }
  const saveUser = async data => {
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, data)
        setUsers(a => a.map(x => x.id === editingUser.id ? { ...x, ...data } : x))
        notify('Utilisateur modifié avec succès.')
      } else {
        await api.createUser(data)
        setUsers(a => [{ ...data, id: Date.now(), status: 'Actif' }, ...a])
        notify('Utilisateur ajouté.')
      }
      await refresh()
    } catch {
      if (editingUser) {
        setUsers(a => a.map(x => x.id === editingUser.id ? { ...x, ...data } : x))
      } else {
        setUsers(a => [{ ...data, id: Date.now(), status: 'Actif' }, ...a])
      }
      notify('Mode démonstration : modification locale.')
    }
    setModal(null); setEditingUser(null)
  }
  const updateRequest = async (id,status) => {
    try { await api.updateRequest(id,status); await refresh() } catch { setRequests(a=>a.map(r=>r.id===id?{...r,status}:r)) }
    notify('Statut mis à jour.')
  }
  const markRead = async id => {
    try { await api.readMessage(id); await refresh() } catch { setMessages(a=>a.map(m=>m.id===id?{...m,isRead:true}:m)) }
    notify('Message marqué comme lu.')
  }

  const title = nav.find(n=>n.page===page)?.label || 'Vue générale'
  const Sidebar = () => <aside className={`${mobileOpen?'fixed inset-y-0 left-0 z-40 flex':'hidden'} w-64 shrink-0 flex-col border-r border-slate-100 bg-white px-5 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen`}>
    <div className="mb-10 flex items-center justify-between px-1"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white"><Home size={21}/></div><div><p className="font-display text-base font-extrabold tracking-tight text-slate-900">estate<span className="text-brand">.</span></p><p className="text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Administration</p></div></div><button className="lg:hidden" onClick={()=>setMobileOpen(false)}><X/></button></div>
    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-400">Menu principal</p>
    <nav className="space-y-1">{nav.map(n=><button key={n.page} onClick={()=>{setPage(n.page);setMobileOpen(false)}} className={`sidebar-link w-full ${page===n.page?'active':''}`}><n.icon size={18}/>{n.label}{n.page==='messages'&&stats.messages>0&&<span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-[10px] text-blue-700">{stats.messages}</span>}</button>)}</nav>
    <div className="mt-auto"><div className="mb-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-white"><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><TrendingUp size={18}/></div><p className="font-display text-sm font-bold">Votre activité grandit</p><p className="mt-1 text-xs leading-relaxed text-blue-100">Suivez vos performances depuis votre espace.</p><button onClick={()=>setPage('dashboard')} className="mt-3 text-xs font-bold text-white underline underline-offset-4">Voir les statistiques</button></div><button className="sidebar-link w-full"><Settings size={18}/>Paramètres</button><div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-extrabold text-blue-700">{user?.fullName.split(' ').map(n=>n[0]).join('') || 'AB'}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-800">{user?.fullName}</p><p className="text-xs text-slate-400">{user?.role}</p></div><button onClick={logout} className="text-slate-400 hover:text-slate-600"><LogOut size={16} /></button></div></div>
  </aside>

  return <div className="min-h-screen lg:flex">
    <Sidebar/>
    {mobileOpen&&<div className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden" onClick={()=>setMobileOpen(false)}/>}
    <main className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur lg:px-9">
        <div className="flex items-center gap-3"><button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden" onClick={()=>setMobileOpen(true)}><Menu size={20}/></button><div><p className="text-xs font-medium text-slate-400">Espace d'administration / <span className="text-slate-600">{title}</span></p><h1 className="font-display text-lg font-extrabold text-slate-900">{title}</h1></div></div>
        <div className="flex items-center gap-3"><div className={`hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold sm:flex ${apiOnline?'bg-emerald-50 text-emerald-700':'bg-amber-50 text-amber-700'}`}><span className={`h-1.5 w-1.5 rounded-full ${apiOnline?'bg-emerald-500':'bg-amber-500'}`}/>{apiOnline?'API connectée':'Mode démo'}</div><button onClick={refresh} className="rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50" title="Actualiser"><RefreshCw size={17} className={loading?'animate-spin':''}/></button><button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500"><Bell size={17}/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500"/></button><div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-extrabold text-indigo-700">{user?.fullName.split(' ').map(n=>n[0]).join('') || 'AB'}</div></div>
      </header>
      <div className="mx-auto max-w-[1500px] p-5 lg:p-9">
        {page==='dashboard'&&<Dashboard user={user} stats={stats} properties={properties} requests={requests} setPage={setPage}/>}
        {page==='properties'&&<Properties properties={visibleProperties} query={query} setQuery={setQuery} onAdd={()=>{setEditing(null);setModal('property')}} onEdit={p=>{setEditing(p);setModal('property')}} onDelete={removeProperty}/>}
        {page==='users'&&<UsersPage users={users} onAdd={()=>{setEditingUser(null);setModal('user')}} onEdit={u=>{setEditingUser(u);setModal('user')}} onDelete={async id=>{try{await api.deleteUser(id);await refresh()}catch{setUsers(a=>a.filter(x=>x.id!==id))}notify('Utilisateur supprimé.')}}/>}
        {page==='requests'&&<RequestsPage requests={requests} onUpdate={updateRequest}/>}
        {page==='messages'&&<MessagesPage messages={messages} onRead={markRead}/>}
      </div>
    </main>
    {modal==='property'&&<Modal title={editing?'Modifier le bien':'Ajouter un bien immobilier'} onClose={()=>{setModal(null);setEditing(null)}}><PropertyForm item={editing} onSave={saveProperty} onCancel={()=>setModal(null)}/></Modal>}
    {modal==='user'&&<Modal title={editingUser?'Modifier l\'utilisateur':'Ajouter un utilisateur'} onClose={()=>{setModal(null);setEditingUser(null)}}><UserForm item={editingUser} onSave={saveUser} onCancel={()=>{setModal(null);setEditingUser(null)}}/></Modal>}
    {toast&&<div className="fixed bottom-6 right-6 z-[70] rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-xl">{toast}</div>}
  </div>
}

function Dashboard({user,stats,properties,requests,setPage}) {
  const pie = [{name:'Appartement',value:42},{name:'Villa',value:28},{name:'Maison',value:18},{name:'Autres',value:12}]
  const colors=['#3157D5','#8B9FF0','#F6B95F','#C9D2E8']
  return <div className="space-y-7">
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm text-slate-500">Mercredi 11 novembre 2026</p><h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900">Bonjour {user?.fullName?.split(' ')[0] || 'Amira'} 👋</h2><p className="mt-1 text-sm text-slate-500">Voici un aperçu de votre activité immobilière.</p></div><button onClick={()=>setPage('properties')} className="btn-primary"><Plus size={17}/>Ajouter un bien</button></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Total des biens" value={stats.properties} change="+12,8%" icon={Building2} tone="blue"/>
      <StatCard title="Biens disponibles" value={stats.available} change="+8,2%" icon={Home} tone="green"/>
      <StatCard title="Utilisateurs" value={stats.users} change="+5,4%" icon={Users} tone="violet"/>
      <StatCard title="Demandes en attente" value={stats.pending} change="+2 nouvelles" icon={ClipboardList} tone="amber" sub="à traiter"/>
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
      <section className="panel p-5 lg:p-6"><div className="flex items-start justify-between"><div><h3 className="font-display font-extrabold text-slate-900">Évolution des demandes</h3><p className="mt-1 text-xs text-slate-400">Volume de demandes sur les 12 derniers mois</p></div><button className="btn-light !px-3 !py-2 text-xs">Cette année <ChevronDown size={14}/></button></div><div className="mt-5 h-[250px]"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{left:-20,right:8,top:10,bottom:0}}><defs><linearGradient id="fillBlue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3157D5" stopOpacity={0.22}/><stop offset="100%" stopColor="#3157D5" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#eef1f7" vertical={false}/><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill:'#94a3b8',fontSize:11}}/><YAxis axisLine={false} tickLine={false} tick={{fill:'#94a3b8',fontSize:11}}/><Tooltip contentStyle={{borderRadius:12,border:'1px solid #eef1f7',fontSize:12}}/><Area type="monotone" dataKey="value" name="Demandes" stroke="#3157D5" strokeWidth={3} fill="url(#fillBlue)"/></AreaChart></ResponsiveContainer></div></section>
      <section className="panel p-5 lg:p-6"><div><h3 className="font-display font-extrabold text-slate-900">Répartition des biens</h3><p className="mt-1 text-xs text-slate-400">Par catégorie de propriété</p></div><div className="relative mt-2 h-[190px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pie} dataKey="value" innerRadius={58} outerRadius={82} paddingAngle={4} stroke="none">{pie.map((x,i)=><Cell key={x.name} fill={colors[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="font-display text-2xl font-extrabold">{stats.properties}</span><span className="text-[10px] text-slate-400">Biens au total</span></div></div><div className="grid grid-cols-2 gap-x-3 gap-y-2">{pie.map((p,i)=><div className="flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full" style={{background:colors[i]}}/>{p.name}<b className="ml-auto text-slate-800">{p.value}%</b></div>)}</div></section>
    </div>
    <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
      <section className="panel overflow-hidden"><div className="flex items-center justify-between px-5 py-5"><div><h3 className="font-display font-extrabold text-slate-900">Biens récemment ajoutés</h3><p className="mt-1 text-xs text-slate-400">Les dernières propriétés enregistrées</p></div><button onClick={()=>setPage('properties')} className="text-xs font-bold text-brand hover:underline">Voir tout</button></div><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">Bien immobilier</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Prix</th><th className="px-5 py-3">Statut</th></tr></thead><tbody>{properties.slice(0,4).map(p=><tr key={p.id} className="border-t border-slate-50"><td className="px-5 py-3"><div className="flex items-center gap-3"><img src={p.imageUrl} className="h-10 w-12 rounded-lg object-cover" onError={e=>e.currentTarget.src='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=200'}/><div><p className="font-bold text-slate-800">{p.title}</p><p className="text-xs text-slate-400">{p.city}</p></div></div></td><td className="px-4 py-3 text-slate-500">{p.type}</td><td className="px-4 py-3 font-bold text-slate-800">{money(p.price)}</td><td className="px-5 py-3"><Status>{p.status}</Status></td></tr>)}</tbody></table></div></section>
      <section className="panel p-5"><div className="flex items-center justify-between"><div><h3 className="font-display font-extrabold text-slate-900">Demandes récentes</h3><p className="mt-1 text-xs text-slate-400">Dernières demandes reçues</p></div><button onClick={()=>setPage('requests')} className="text-xs font-bold text-brand">Tout voir</button></div><div className="mt-4 space-y-4">{requests.slice(0,3).map(r=><div className="flex items-start gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">{r.clientName.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-800">{r.clientName}</p><p className="truncate text-xs text-slate-400">{r.propertyTitle}</p></div><Status>{r.status}</Status></div>)}</div></section>
    </div>
    <div className="grid gap-4 sm:grid-cols-2"><div className="panel flex items-center gap-4 p-5"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><Wallet size={22}/></div><div><p className="text-xs text-slate-400">Valeur totale des biens en vente</p><p className="mt-1 font-display text-xl font-extrabold">{money(stats.value)}</p></div></div><div className="panel flex items-center gap-4 p-5"><div className="rounded-xl bg-violet-50 p-3 text-violet-700"><MessageSquare size={22}/></div><div><p className="text-xs text-slate-400">Messages non lus</p><p className="mt-1 font-display text-xl font-extrabold">{stats.messages}</p></div></div></div>
  </div>
}
function Properties({properties,query,setQuery,onAdd,onEdit,onDelete}) {
  const [filter,setFilter]=useState('Tous')
  const data=properties.filter(p=>filter==='Tous'||p.status===filter)
  return <div className="space-y-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="font-display text-2xl font-extrabold">Biens immobiliers</h2><p className="mt-1 text-sm text-slate-500">Gérez votre portefeuille de propriétés.</p></div><button onClick={onAdd} className="btn-primary"><Plus size={17}/>Ajouter un bien</button></div>
    <div className="panel p-4"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} className="field pl-10" placeholder="Rechercher par titre, ville, adresse..."/></div><div className="flex items-center gap-2"><Filter size={16} className="text-slate-400"/><select className="field md:w-44" value={filter} onChange={e=>setFilter(e.target.value)}>{['Tous','Disponible','Réservé','Vendu','Loué'].map(x=><option>{x}</option>)}</select></div></div></div>
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">{data.map(p=><article key={p.id} className="panel group overflow-hidden"><div className="relative h-48 overflow-hidden bg-slate-100"><img src={p.imageUrl} onError={e=>e.currentTarget.src='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900'} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><div className="absolute left-3 top-3"><Status>{p.status}</Status></div><span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-white">{p.transaction}</span><button className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-slate-600"><MoreHorizontal size={17}/></button></div><div className="p-5"><p className="font-display text-lg font-extrabold text-slate-900">{p.title}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin size={13}/>{p.address}, {p.city}</p><p className="mt-4 font-display text-xl font-extrabold text-brand">{money(p.price)} <span className="text-xs font-medium text-slate-400">{p.transaction==='Location'?'/ mois':''}</span></p><div className="mt-4 flex items-center gap-4 border-y border-slate-100 py-3 text-xs text-slate-500"><span className="flex items-center gap-1"><BedDouble size={15}/>{p.bedrooms} ch.</span><span className="flex items-center gap-1"><Bath size={15}/>{p.bathrooms} sdb</span><span className="flex items-center gap-1"><Maximize2 size={14}/>{p.area} m²</span><span className="ml-auto rounded-md bg-slate-50 px-2 py-1">{p.type}</span></div><div className="mt-4 flex gap-2"><button onClick={()=>onEdit(p)} className="btn-light flex-1"><Pencil size={14}/>Modifier</button><button onClick={()=>onDelete(p.id)} className="btn-light !px-3 text-rose-500 hover:bg-rose-50"><Trash2 size={15}/></button></div></div></article>)}</div>
    {data.length===0&&<div className="panel p-12 text-center text-sm text-slate-400">Aucun bien ne correspond à votre recherche.</div>}
  </div>
}
function UsersPage({users,onAdd,onEdit,onDelete}) {
  return <div className="space-y-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="font-display text-2xl font-extrabold">Utilisateurs</h2><p className="mt-1 text-sm text-slate-500">Gérez les administrateurs, agents et clients.</p></div><button onClick={onAdd} className="btn-primary"><Plus size={17}/>Ajouter un utilisateur</button></div><div className="panel overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[750px] text-left text-sm"><thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-6 py-4">Utilisateur</th><th className="px-4 py-4">Téléphone</th><th className="px-4 py-4">Rôle</th><th className="px-4 py-4">Statut</th><th className="px-6 py-4">Action</th></tr></thead><tbody>{users.map(u=><tr className="border-t border-slate-100" key={u.id}><td className="px-6 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">{u.fullName.split(' ').map(x=>x[0]).slice(0,2).join('')}</div><div><p className="font-bold text-slate-800">{u.fullName}</p><p className="text-xs text-slate-400">{u.email}</p></div></div></td><td className="px-4 py-4 text-slate-500">{u.phone}</td><td className="px-4 py-4"><span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{u.role}</span></td><td className="px-4 py-4"><Status>{u.status}</Status></td><td className="px-6 py-4"><div className="flex items-center gap-2"><button onClick={()=>onEdit(u)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-700"><Pencil size={16}/></button><button onClick={()=>onDelete(u.id)} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div></div></div>
}
function UserForm({item,onSave,onCancel}) {
  const [form,setForm]=useState(item||{fullName:'',email:'',phone:'',role:'Client',status:'Actif'})
  const change=e=>setForm({...form,[e.target.name]:e.target.value})
  return <form onSubmit={e=>{e.preventDefault();onSave(form)}} className="space-y-4"><label className="block text-sm font-semibold text-slate-600">Nom complet<input required name="fullName" value={form.fullName} onChange={change} className="field mt-1.5"/></label><label className="block text-sm font-semibold text-slate-600">Adresse e-mail<input required type="email" name="email" value={form.email} onChange={change} className="field mt-1.5"/></label><label className="block text-sm font-semibold text-slate-600">Téléphone<input name="phone" value={form.phone} onChange={change} className="field mt-1.5"/></label><label className="block text-sm font-semibold text-slate-600">Rôle<select name="role" value={form.role} onChange={change} className="field mt-1.5"><option>Client</option><option>Agent</option><option>Administrateur</option></select></label><div className="flex justify-end gap-2 pt-3"><button type="button" onClick={onCancel} className="btn-light">Annuler</button><button className="btn-primary">{item?'Enregistrer les modifications':'Créer l\'utilisateur'}</button></div></form>
}
function RequestsPage({requests,onUpdate}) {
  return <div className="space-y-6"><div><h2 className="font-display text-2xl font-extrabold">Demandes de contact & visites</h2><p className="mt-1 text-sm text-slate-500">Suivez les demandes envoyées par les clients.</p></div><div className="grid gap-4 sm:grid-cols-3"><StatCard title="Total demandes" value={requests.length} change="+" icon={ClipboardList}/><StatCard title="En attente" value={requests.filter(x=>x.status==='En attente').length} change="À traiter" icon={Clock3} tone="amber"/><StatCard title="Confirmées" value={requests.filter(x=>x.status==='Confirmée').length} change="Validées" icon={CheckCircle2} tone="green"/></div><div className="space-y-3">{requests.map(r=><div key={r.id} className="panel flex flex-col justify-between gap-4 p-5 lg:flex-row lg:items-center"><div className="flex items-start gap-3"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CalendarDays size={20}/></div><div><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-slate-800">{r.clientName}</p><Status>{r.status}</Status></div><p className="mt-1 text-sm text-slate-500">{r.propertyTitle}</p><p className="mt-2 text-xs text-slate-400">{r.email} · {r.phone}</p><p className="mt-2 text-sm text-slate-600">{r.message}</p></div></div><div className="flex shrink-0 gap-2"><button onClick={()=>onUpdate(r.id,'En attente')} className="btn-light">En attente</button><button onClick={()=>onUpdate(r.id,'Confirmée')} className="btn-primary"><CheckCircle2 size={15}/>Confirmer</button></div></div>)}</div></div>
}
function MessagesPage({messages,onRead}) {
  return <div className="space-y-6"><div><h2 className="font-display text-2xl font-extrabold">Messages</h2><p className="mt-1 text-sm text-slate-500">Boîte de réception des messages du site.</p></div><div className="panel divide-y divide-slate-100">{messages.map(m=><div key={m.id} className={`flex flex-col gap-3 p-5 sm:flex-row sm:items-start ${!m.isRead?'bg-blue-50/30':''}`}><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600"><Mail size={18}/></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-bold text-slate-800">{m.senderName}</p>{!m.isRead&&<span className="h-2 w-2 rounded-full bg-blue-600"/>}<span className="text-xs text-slate-400">{m.email}</span></div><p className="mt-1 text-sm font-semibold text-slate-700">{m.subject}</p><p className="mt-1 text-sm text-slate-500">{m.content}</p></div><div className="flex items-center gap-2">{!m.isRead?<button onClick={()=>onRead(m.id)} className="btn-light text-xs"><CheckCircle2 size={14}/>Marquer comme lu</button>:<span className="text-xs font-semibold text-emerald-600">Lu</span>}</div></div>)}</div></div>
}
export default App;