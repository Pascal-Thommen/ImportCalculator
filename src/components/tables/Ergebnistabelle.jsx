import { berechne } from '../../logic/berechnung.js'

const fmt = n =>
  new Intl.NumberFormat('es-PY', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(n || 0))

export default function Ergebnistabelle({ kalk, t }) {
  const ergebnisse = berechne(kalk)
  const totalKosten  = ergebnisse.reduce((s, e) => s + e.kosten,  0)
  const totalSteuern = ergebnisse.reduce((s, e) => s + e.steuern, 0)
  const totalTotal   = ergebnisse.reduce((s, e) => s + e.total,   0)

  return (
    <section className="mt-6">
      <div className="rounded-xl border-2 border-gray-300 overflow-hidden shadow-sm">
        <div className="bg-gray-800 px-4 py-3">
          <h2 className="text-base font-bold text-white">{t.ergebnisse}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="text-left px-3 py-2 font-semibold text-gray-700">{t.produkt}</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-700">{t.menge}</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-700">{t.kosten} (PYG)</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-700">{t.steuern} (PYG)</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-700">{t.total} (PYG)</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-700">{t.kosten_pro_unidad}</th>
              </tr>
            </thead>
            <tbody>
              {ergebnisse.map((e, i) => (
                <tr key={e.id || i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-3 py-2 font-medium text-gray-800">{e.name}</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-700">{(e.menge || 0).toLocaleString('es-PY')}</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-700">{fmt(e.kosten)}</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-700">{fmt(e.steuern)}</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-gray-800">{fmt(e.total)}</td>
                  <td className="px-3 py-2 text-right font-mono text-blue-700 font-semibold">{fmt(e.kostenProUnidad)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-800 text-white">
                <td className="px-3 py-2 font-bold">{t.summe}</td>
                <td className="px-3 py-2"></td>
                <td className="px-3 py-2 text-right font-mono font-bold">{fmt(totalKosten)}</td>
                <td className="px-3 py-2 text-right font-mono font-bold">{fmt(totalSteuern)}</td>
                <td className="px-3 py-2 text-right font-mono font-bold">{fmt(totalTotal)}</td>
                <td className="px-3 py-2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  )
}
