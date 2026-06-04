import { useState } from 'react'
import ApiConfigTab from './ApiConfigTab.jsx'
import StatsTab from './StatsTab.jsx'
import VerlaufTab from './VerlaufTab.jsx'

function isLocalAccess() {
  const h = window.location.hostname
  return (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h.startsWith('100.')      ||  // NetBird
    h.startsWith('192.168.')  ||
    h.startsWith('10.')       ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h)
  )
}

const TABS = [
  { key: 'config',  label: 'API-Konfiguration' },
  { key: 'stats',   label: 'Nutzungsübersicht' },
  { key: 'verlauf', label: 'Import-Verlauf' },
]

export default function AdminApp() {
  const [tab, setTab] = useState('config')

  if (!isLocalAccess()) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-5xl">🔒</div>
          <h1 className="text-2xl font-bold text-white">Zugang verweigert</h1>
          <p className="text-slate-400 text-sm">Die Adminkonsole ist nur im lokalen Netzwerk zugänglich.</p>
          <p className="text-slate-600 text-xs font-mono">{window.location.hostname}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white px-8 py-4 flex items-center gap-3">
        <div className="w-2 h-6 bg-blue-400 rounded-full flex-shrink-0" />
        <span className="font-bold">ImportCalculator</span>
        <span className="text-slate-500">/</span>
        <span className="font-medium text-slate-300">Admin</span>
        <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs font-mono">
          {window.location.hostname}
        </span>
        <a href="#" className="ml-auto text-sm text-slate-400 hover:text-white transition-colors">
          ← Zur App
        </a>
      </header>

      <nav className="bg-white border-b border-slate-200 px-8 flex">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="px-8 py-6 max-w-4xl">
        {tab === 'config'  && <ApiConfigTab />}
        {tab === 'stats'   && <StatsTab />}
        {tab === 'verlauf' && <VerlaufTab />}
      </main>
    </div>
  )
}
