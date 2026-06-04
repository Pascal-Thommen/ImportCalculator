import { HERKUNFT_OPTIONEN } from '../../data/herkunftDaten.js'

const VERLAUF_KEY = 'importkalk_verlauf_v3'

function loadVerlauf() {
  try { return JSON.parse(localStorage.getItem(VERLAUF_KEY) || '[]') } catch { return [] }
}

function herkunftLabel(key) {
  return HERKUNFT_OPTIONEN.find(h => h.key === key)?.label ?? key ?? '—'
}

function exportCSV(kalks) {
  const header = ['Datum','Name','Produkte','Herkunft','FOB (USD)','HS-Codes']
  const rows   = kalks.map(k => {
    const datum    = new Date(k.meta.datum).toLocaleDateString('de-DE')
    const name     = `"${(k.meta.name || '').replace(/"/g,'""')}"`
    const produkte = `"${(k.produkte?.zeilen||[]).map(z=>z.name).filter(Boolean).join('; ').replace(/"/g,'""')}"`
    const herkunft = herkunftLabel(k.herkunft)
    const fob      = (k.produkte?.zeilen||[]).reduce((s,p)=>s+(p.betrag||0)*(p.menge||0),0).toFixed(2)
    const hs       = `"${(k.produkte?.zeilen||[]).map(z=>z.hsCode).filter(Boolean).join('; ')}"`
    return [datum, name, produkte, herkunft, fob, hs].join(',')
  })
  const csv  = [header.join(','), ...rows].join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `importcalculator-${new Date().toISOString().slice(0,10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const fmtDate = s =>
  new Date(s).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
const fmtFob  = n =>
  n > 0 ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'

export default function VerlaufTab() {
  const verlauf   = loadVerlauf()
  const userKalks = [...verlauf].filter(k => !k.meta.isBeispiel).reverse()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{userKalks.length} Kalkulationen</p>
        <button
          onClick={() => exportCSV(userKalks)}
          disabled={userKalks.length === 0}
          className="px-4 py-2 text-sm font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="text-left px-5 py-3">Datum</th>
              <th className="text-left px-4 py-3">Kalkulation</th>
              <th className="text-left px-4 py-3">Produkte</th>
              <th className="text-left px-4 py-3">Herkunft</th>
              <th className="text-right px-5 py-3">FOB (USD)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {userKalks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400 text-sm">
                  Noch keine Kalkulationen vorhanden
                </td>
              </tr>
            ) : userKalks.map(k => {
              const fob     = (k.produkte?.zeilen||[]).reduce((s,p)=>s+(p.betrag||0)*(p.menge||0),0)
              const namen   = (k.produkte?.zeilen||[]).map(z=>z.name).filter(Boolean).join(', ')
              const hl      = herkunftLabel(k.herkunft)
              const istMerco = ['brasil_arg','mercosur'].includes(k.herkunft)
              return (
                <tr key={k.meta.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                    {fmtDate(k.meta.datum)}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{k.meta.name}</td>
                  <td className="px-4 py-3 text-slate-500 max-w-[220px] truncate" title={namen}>
                    {namen || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {k.herkunft ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        istMerco
                          ? 'bg-green-50 text-green-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {hl}
                      </span>
                    ) : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-slate-600">
                    {fmtFob(fob)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
