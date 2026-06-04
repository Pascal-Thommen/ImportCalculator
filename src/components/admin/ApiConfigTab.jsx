import { useState } from 'react'

const ADMIN_KEY = 'importkalk_admin_v1'

const MODELS = ['llama3.2', 'llama3.1', 'llama3', 'mistral', 'gemma2', 'phi3']
const FX_PROVIDERS = [
  { value: 'manual',            label: 'Manuell (kein API)' },
  { value: 'exchangerate-api',  label: 'exchangerate-api.com' },
  { value: 'fixer',             label: 'fixer.io' },
]

function loadConfig() {
  try { return JSON.parse(localStorage.getItem(ADMIN_KEY) || '{}') } catch { return {} }
}
function saveConfig(cfg) {
  localStorage.setItem(ADMIN_KEY, JSON.stringify(cfg))
}

export default function ApiConfigTab() {
  const [cfg, setCfg] = useState(loadConfig)
  const [status, setStatus] = useState({ ollama: null, fx: null })
  const [saved, setSaved] = useState(false)

  const update = (key, val) => {
    const next = { ...cfg, [key]: val }
    setCfg(next)
    saveConfig(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const testOllama = async () => {
    setStatus(s => ({ ...s, ollama: 'testing' }))
    const url   = (cfg.ollamaUrl || 'https://api.ollama.com/v1').replace(/\/$/, '')
    const key   = cfg.ollamaKey || ''
    const t0    = Date.now()
    try {
      const res = await fetch(`${url}/models`, {
        headers: key ? { Authorization: `Bearer ${key}` } : {},
        signal: AbortSignal.timeout(6000),
      })
      const ms = Date.now() - t0
      setStatus(s => ({ ...s, ollama: res.ok ? `ok — ${ms} ms` : `HTTP ${res.status}` }))
    } catch (e) {
      setStatus(s => ({ ...s, ollama: `Fehler: ${e.message}` }))
    }
  }

  const testFx = async () => {
    if (!cfg.fxProvider || cfg.fxProvider === 'manual') {
      setStatus(s => ({ ...s, fx: 'Manueller Modus — kein Test nötig' }))
      return
    }
    setStatus(s => ({ ...s, fx: 'testing' }))
    const key = cfg.fxApiKey || ''
    const t0  = Date.now()
    try {
      const url = cfg.fxProvider === 'fixer'
        ? `https://data.fixer.io/api/latest?access_key=${key}&symbols=PYG,USD`
        : `https://v6.exchangerate-api.com/v6/${key}/latest/USD`
      const res = await fetch(url, { signal: AbortSignal.timeout(6000) })
      const ms  = Date.now() - t0
      setStatus(s => ({ ...s, fx: res.ok ? `ok — ${ms} ms` : `HTTP ${res.status}` }))
    } catch (e) {
      setStatus(s => ({ ...s, fx: `Fehler: ${e.message}` }))
    }
  }

  const chip = (key) => {
    const s = status[key]
    if (!s) return null
    const ok      = s.startsWith('ok')
    const testing = s === 'testing'
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        testing ? 'bg-slate-100 text-slate-500' :
        ok      ? 'bg-green-100 text-green-700' :
                  'bg-red-100   text-red-700'
      }`}>
        {testing ? '…' : s}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {saved && (
        <div className="text-xs text-green-600 font-medium">✓ Gespeichert</div>
      )}

      {/* Ollama */}
      <Card title="Ollama API">
        <Field label="Endpoint URL">
          <input
            type="text"
            value={cfg.ollamaUrl || ''}
            onChange={e => update('ollamaUrl', e.target.value)}
            placeholder="https://api.ollama.com/v1"
            className={inp}
          />
        </Field>
        <Field label="API Key">
          <input
            type="password"
            value={cfg.ollamaKey || ''}
            onChange={e => update('ollamaKey', e.target.value)}
            placeholder="sk-…"
            className={inp}
          />
        </Field>
        <Field label="Modell">
          <select value={cfg.ollamaModel || 'llama3.2'} onChange={e => update('ollamaModel', e.target.value)} className={inp}>
            {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <div className="flex items-center gap-3 pt-1">
          <button onClick={testOllama} className={btn}>Verbindung testen</button>
          {chip('ollama')}
        </div>
      </Card>

      {/* Wechselkurs */}
      <Card title="Wechselkurs API">
        <Field label="Anbieter">
          <select value={cfg.fxProvider || 'manual'} onChange={e => update('fxProvider', e.target.value)} className={inp}>
            {FX_PROVIDERS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </Field>
        {cfg.fxProvider && cfg.fxProvider !== 'manual' && (
          <Field label="API Key">
            <input
              type="password"
              value={cfg.fxApiKey || ''}
              onChange={e => update('fxApiKey', e.target.value)}
              placeholder="API-Key"
              className={inp}
            />
          </Field>
        )}
        <div className="flex items-center gap-3 pt-1">
          <button onClick={testFx} className={btn}>Verbindung testen</button>
          {chip('fx')}
        </div>
        {(!cfg.fxProvider || cfg.fxProvider === 'manual') && (
          <p className="text-xs text-slate-400 mt-1">
            Im manuellen Modus trägt der User den Wechselkurs direkt in der App ein.
          </p>
        )}
      </Card>

      <p className="text-xs text-slate-400">
        Konfiguration wird verschlüsselt im Browser-Storage gespeichert. Kein Server erforderlich.
      </p>
    </div>
  )
}

const inp = 'w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 font-mono'
const btn = 'px-4 py-2 text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors'

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="px-6 py-3.5 border-b border-slate-100 bg-slate-50/60">
        <h2 className="font-bold text-slate-700">{title}</h2>
      </div>
      <div className="px-6 py-5 space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="grid gap-4 items-center" style={{ gridTemplateColumns: '160px 1fr' }}>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      {children}
    </div>
  )
}
