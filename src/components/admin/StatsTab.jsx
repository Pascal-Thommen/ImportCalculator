import { HERKUNFT_OPTIONEN } from '../../data/herkunftDaten.js'

const VERLAUF_KEY = 'importkalk_verlauf_v3'

function loadVerlauf() {
  try { return JSON.parse(localStorage.getItem(VERLAUF_KEY) || '[]') } catch { return [] }
}

function startOfDay(d)  { const x = new Date(d); x.setHours(0,0,0,0); return x }
function startOfWeek(d) { const x = startOfDay(d); x.setDate(x.getDate() - x.getDay()); return x }

function computeStats(verlauf) {
  const user = verlauf.filter(k => !k.meta.isBeispiel)
  const now  = new Date()
  const sow  = startOfWeek(now)
  const sod  = startOfDay(now)

  const total = user.length
  const woche = user.filter(k => new Date(k.meta.datum) >= sow).length
  const heute = user.filter(k => new Date(k.meta.datum) >= sod).length

  // Herkunft-Häufigkeit
  const hCounts = {}
  for (const k of user) {
    const h = k.herkunft || ''
    hCounts[h] = (hCounts[h] || 0) + 1
  }
  const topHerkunft = Object.entries(hCounts)
    .filter(([k]) => k)
    .sort(([,a],[,b]) => b - a)
    .slice(0, 6)

  const herkunftLabel = key =>
    HERKUNFT_OPTIONEN.find(h => h.key === key)?.label ?? key

  // Ø FOB
  let totalFob = 0, fobN = 0
  for (const k of user) {
    const fob = (k.produkte?.zeilen || []).reduce((s, p) => s + (p.betrag||0)*(p.menge||0), 0)
    if (fob > 0) { totalFob += fob; fobN++ }
  }
  const avgFob = fobN > 0 ? totalFob / fobN : 0

  // Überschreibrate: _auto:false vs _auto:true
  let autoKeep = 0, overridden = 0
  for (const k of user) {
    const rows = [
      ...(k.flete?.zeilen || []),
      ...(k.importacion?.zeilen || []),
      ...(k.nationale?.zeilen || []),
    ]
    for (const z of rows) {
      if (z._auto === true)  autoKeep++
      if (z._auto === false) overridden++
    }
  }
  const overrideRate = (autoKeep + overridden) > 0
    ? Math.round(overridden / (autoKeep + overridden) * 100)
    : null

  // Mercosur vs Drittland
  const mercosurKeys = new Set(['brasil_arg','mercosur'])
  let mercosur = 0, drittland = 0
  for (const k of user) {
    if (mercosurKeys.has(k.herkunft)) mercosur++
    else if (k.herkunft) drittland++
  }

  return { total, woche, heute, topHerkunft, herkunftLabel, avgFob, overrideRate, mercosur, drittland }
}

const fmtNum = n => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function StatsTab() {
  const verlauf = loadVerlauf()
  const s = computeStats(verlauf)

  return (
    <div className="space-y-6">
      {/* Zähler oben */}
      <div className="grid grid-cols-3 gap-4">
        <CountCard label="Kalkulationen gesamt" value={s.total} />
        <CountCard label="Diese Woche" value={s.woche} />
        <CountCard label="Heute" value={s.heute} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Herkunft */}
        <Card title="Beliebteste Herkunftsländer">
          {s.topHerkunft.length === 0 ? (
            <p className="text-sm text-slate-400 py-2">Noch keine Daten</p>
          ) : (
            <div className="space-y-2.5">
              {s.topHerkunft.map(([key, count]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="text-xs text-slate-600 w-44 truncate" title={s.herkunftLabel(key)}>
                    {s.herkunftLabel(key)}
                  </div>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${s.total > 0 ? (count / s.total) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono text-slate-400 w-5 text-right">{count}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Qualität & Werte */}
        <Card title="Qualität & Werte">
          <Row label="Ø FOB-Wert"
            value={s.avgFob > 0 ? `${fmtNum(s.avgFob)} USD` : '—'} />
          <Row label="Schätzfelder manuell überschrieben"
            value={s.overrideRate !== null ? `${s.overrideRate} %` : '—'} />
          <Row label="Mercosur-Importe"
            value={s.mercosur > 0
              ? `${s.mercosur} (${Math.round(s.mercosur / (s.mercosur + s.drittland || 1) * 100)} %)`
              : '—'} />
          <Row label="Drittland-Importe"
            value={s.drittland > 0 ? s.drittland : '—'} />
        </Card>
      </div>

      {s.total === 0 && (
        <p className="text-sm text-slate-400 text-center py-4">
          Noch keine Kalkulationen vorhanden. Daten erscheinen sobald Nutzer die App verwenden.
        </p>
      )}
    </div>
  )
}

function CountCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 text-center">
      <div className="text-4xl font-extrabold text-slate-800 font-mono">{value}</div>
      <div className="text-xs text-slate-500 mt-2 font-medium">{label}</div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/60">
        <h3 className="font-bold text-slate-700 text-sm">{title}</h3>
      </div>
      <div className="px-5 py-4 space-y-3">{children}</div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-mono font-semibold text-slate-700">{value}</span>
    </div>
  )
}
