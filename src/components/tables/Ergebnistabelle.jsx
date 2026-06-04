import { berechne } from '../../logic/berechnung.js'

const fmt = n => new Intl.NumberFormat('es-PY',{minimumFractionDigits:0,maximumFractionDigits:0}).format(Math.round(n||0))

export default function Ergebnistabelle({ kalk, t }) {
  const ergebnisse = berechne(kalk)
  const totalKosten  = ergebnisse.reduce((s,e) => s+e.kosten,  0)
  const totalSteuern = ergebnisse.reduce((s,e) => s+e.steuern, 0)
  const totalTotal   = ergebnisse.reduce((s,e) => s+e.total,   0)

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden" style={{borderTop: '4px solid #2563eb'}}>
      <div className="px-6 py-4 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="font-extrabold text-slate-800 text-xl tracking-tight">{t.ergebnisse}</h2>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <th className="text-left px-6 py-3">{t.produkt}</th>
            <th className="text-right px-4 py-3 w-28">{t.menge}</th>
            <th className="text-right px-4 py-3">{t.kosten} (PYG)</th>
            <th className="text-right px-4 py-3">{t.steuern} (PYG)</th>
            <th className="text-right px-4 py-3">{t.total} (PYG)</th>
            <th className="text-right px-6 py-3">{t.kosten_pro_unidad}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ergebnisse.map((e,i) => (
            <tr key={e.id||i} className="hover:bg-blue-50/40 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800 text-base">{e.name}</td>
              <td className="px-4 py-4 text-right font-mono text-slate-500">{(e.menge||0).toLocaleString('es-PY')}</td>
              <td className="px-4 py-4 text-right font-mono text-slate-600">{fmt(e.kosten)}</td>
              <td className="px-4 py-4 text-right font-mono text-slate-600">{fmt(e.steuern)}</td>
              <td className="px-4 py-4 text-right font-mono font-bold text-slate-900 text-base">{fmt(e.total)}</td>
              <td className="px-6 py-4 text-right font-mono font-extrabold text-blue-600 text-base">{fmt(e.kostenProUnidad)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-blue-50 border-t-2 border-blue-200">
            <td className="px-6 py-4 font-extrabold text-slate-700 text-base">{t.summe}</td>
            <td className="px-4 py-4" />
            <td className="px-4 py-4 text-right font-mono font-semibold text-slate-500">{fmt(totalKosten)}</td>
            <td className="px-4 py-4 text-right font-mono font-semibold text-slate-500">{fmt(totalSteuern)}</td>
            <td className="px-4 py-4 text-right font-mono font-extrabold text-blue-700 text-2xl">{fmt(totalTotal)}</td>
            <td className="px-6 py-4" />
          </tr>
        </tfoot>
      </table>
    </section>
  )
}
