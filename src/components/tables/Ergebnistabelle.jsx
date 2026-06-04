import { berechne } from '../../logic/berechnung.js'

const fmt = n => new Intl.NumberFormat('es-PY',{minimumFractionDigits:0,maximumFractionDigits:0}).format(Math.round(n||0))

export default function Ergebnistabelle({ kalk, t }) {
  const ergebnisse = berechne(kalk)
  const totalKosten  = ergebnisse.reduce((s,e) => s+e.kosten,  0)
  const totalSteuern = ergebnisse.reduce((s,e) => s+e.steuern, 0)
  const totalTotal   = ergebnisse.reduce((s,e) => s+e.total,   0)

  return (
    <section className="bg-white rounded-2xl shadow-xl ring-2 ring-slate-800/10 border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-700 flex items-center gap-3">
        <div className="w-2 h-8 rounded-full bg-blue-400" />
        <h2 className="font-extrabold text-white text-xl tracking-tight">{t.ergebnisse}</h2>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100 border-b-2 border-slate-300 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <th className="text-left px-6 py-3.5">{t.produkt}</th>
            <th className="text-right px-4 py-3.5 w-28">{t.menge}</th>
            <th className="text-right px-4 py-3.5">{t.kosten} (PYG)</th>
            <th className="text-right px-4 py-3.5">{t.steuern} (PYG)</th>
            <th className="text-right px-4 py-3.5">{t.total} (PYG)</th>
            <th className="text-right px-6 py-3.5">{t.kosten_pro_unidad}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ergebnisse.map((e,i) => (
            <tr key={e.id||i} className="hover:bg-blue-50/50 transition-colors">
              <td className="px-6 py-4 font-bold text-slate-800 text-base">{e.name}</td>
              <td className="px-4 py-4 text-right font-mono text-slate-500">{(e.menge||0).toLocaleString('es-PY')}</td>
              <td className="px-4 py-4 text-right font-mono text-slate-600">{fmt(e.kosten)}</td>
              <td className="px-4 py-4 text-right font-mono text-slate-600">{fmt(e.steuern)}</td>
              <td className="px-4 py-4 text-right font-mono font-bold text-slate-900 text-lg">{fmt(e.total)}</td>
              <td className="px-6 py-4 text-right font-mono font-extrabold text-blue-600 text-lg">{fmt(e.kostenProUnidad)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
            <td className="px-6 py-5 font-extrabold text-lg">{t.summe}</td>
            <td className="px-4 py-5" />
            <td className="px-4 py-5 text-right font-mono font-bold text-slate-300">{fmt(totalKosten)}</td>
            <td className="px-4 py-5 text-right font-mono font-bold text-slate-300">{fmt(totalSteuern)}</td>
            <td className="px-4 py-5 text-right font-mono font-extrabold text-white text-2xl">{fmt(totalTotal)}</td>
            <td className="px-6 py-5" />
          </tr>
        </tfoot>
      </table>
    </section>
  )
}
