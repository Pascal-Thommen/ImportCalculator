import { berechne } from '../../logic/berechnung.js'

const fmt = n => new Intl.NumberFormat('es-PY',{minimumFractionDigits:0,maximumFractionDigits:0}).format(Math.round(n||0))

export default function Ergebnistabelle({ kalk, t }) {
  const ergebnisse = berechne(kalk)
  const totalKosten  = ergebnisse.reduce((s,e) => s+e.kosten,  0)
  const totalSteuern = ergebnisse.reduce((s,e) => s+e.steuern, 0)
  const totalTotal   = ergebnisse.reduce((s,e) => s+e.total,   0)

  return (
    <section className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-slate-800 to-slate-700 flex items-center gap-3">
        <div className="w-1.5 h-7 rounded-full bg-blue-400" />
        <h2 className="font-bold text-white text-lg tracking-tight">{t.ergebnisse}</h2>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
            <tr key={e.id||i} className="hover:bg-slate-50/60 transition-colors">
              <td className="px-6 py-3.5 font-semibold text-slate-800">{e.name}</td>
              <td className="px-4 py-3.5 text-right font-mono text-slate-500">{(e.menge||0).toLocaleString('es-PY')}</td>
              <td className="px-4 py-3.5 text-right font-mono text-slate-600">{fmt(e.kosten)}</td>
              <td className="px-4 py-3.5 text-right font-mono text-slate-600">{fmt(e.steuern)}</td>
              <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800 text-base">{fmt(e.total)}</td>
              <td className="px-6 py-3.5 text-right font-mono font-bold text-blue-600 text-base">{fmt(e.kostenProUnidad)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
            <td className="px-6 py-4 font-bold text-base">{t.summe}</td>
            <td className="px-4 py-4" />
            <td className="px-4 py-4 text-right font-mono font-bold">{fmt(totalKosten)}</td>
            <td className="px-4 py-4 text-right font-mono font-bold">{fmt(totalSteuern)}</td>
            <td className="px-4 py-4 text-right font-mono font-bold text-lg">{fmt(totalTotal)}</td>
            <td className="px-6 py-4" />
          </tr>
        </tfoot>
      </table>
    </section>
  )
}
