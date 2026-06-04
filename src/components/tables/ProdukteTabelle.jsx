import EditableCell from '../ui/EditableCell.jsx'
import SummaryField from '../ui/SummaryField.jsx'
import { berechneZwischen } from '../../logic/berechnung.js'

export default function ProdukteTabelle({ kalk, t, handlers }) {
  const { setProduktWaehrung, setProduktWechselkurs, updateProduktZeile, addProduktZeile, removeProduktZeile } = handlers
  const { produkte } = kalk
  const zeilen = produkte.zeilen || []
  const mehrere = zeilen.length > 1
  const { fobPYG, fobW1 } = berechneZwischen(kalk)

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 rounded-full bg-blue-500" />
          <h2 className="font-bold text-slate-800">{t.produkte}</h2>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            {t.waehrung}
            <input type="text" value={produkte.waehrung} onChange={e => setProduktWaehrung(e.target.value)}
              className="w-14 px-1.5 py-0.5 text-xs border border-slate-200 rounded text-center font-semibold bg-white focus:outline-none focus:border-blue-400" />
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            1&nbsp;{produkte.waehrung}&nbsp;=
            <input type="number" value={produkte.wechselkurs} onChange={e => setProduktWechselkurs(parseFloat(e.target.value)||0)}
              className="w-24 px-1.5 py-0.5 text-xs border border-slate-200 rounded text-right font-mono bg-white focus:outline-none focus:border-blue-400" />
            PYG
          </span>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <th className="text-left px-6 py-2.5">{t.beschreibung}</th>
            <th className="text-right px-4 py-2.5 w-36">{t.betrag} ({produkte.waehrung})</th>
            <th className="text-right px-4 py-2.5 w-28">{t.menge}</th>
            {mehrere && <th className="text-right px-4 py-2.5 w-28">{t.maseinheit}</th>}
            <th className="text-right px-4 py-2.5 w-36">Total ({produkte.waehrung})</th>
            <th className="w-12" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {zeilen.map(z => (
            <tr key={z.id} className="group hover:bg-blue-50/20 transition-colors">
              <td className="px-4 py-1.5"><EditableCell value={z.name} onChange={v => updateProduktZeile(z.id,'name',v)} align="left" placeholder="Producto..." /></td>
              <td className="px-4 py-1.5"><EditableCell value={z.betrag} onChange={v => updateProduktZeile(z.id,'betrag',v)} type="number" /></td>
              <td className="px-4 py-1.5"><EditableCell value={z.menge} onChange={v => updateProduktZeile(z.id,'menge',v)} type="number" /></td>
              {mehrere && <td className="px-4 py-1.5"><EditableCell value={z.maseinheit} onChange={v => updateProduktZeile(z.id,'maseinheit',v)} type="number" /></td>}
              <td className="px-4 py-1.5 text-right font-mono text-slate-600">
                {((z.betrag||0)*(z.menge||0)).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
              </td>
              <td className="px-2">
                <button onClick={() => removeProduktZeile(z.id)}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center mx-auto rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-6 py-2.5 border-t border-slate-100">
        <button onClick={addProduktZeile} className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
          <span className="text-base leading-none">+</span>{t.zeile_hinzufuegen}
        </button>
      </div>

      <div className="px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50/30 border-t border-blue-100 flex flex-wrap gap-10">
        <SummaryField label={`${t.fob} (${produkte.waehrung})`} value={fobW1} currency="USD" />
        <SummaryField label={`${t.fob} (PYG)`} value={fobPYG} currency="PYG" />
      </div>
    </section>
  )
}
