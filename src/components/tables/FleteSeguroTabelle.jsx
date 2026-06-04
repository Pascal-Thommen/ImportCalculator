import EditableCell from '../ui/EditableCell.jsx'
import DropdownCell from '../ui/DropdownCell.jsx'
import SummaryField from '../ui/SummaryField.jsx'
import { berechneZwischen } from '../../logic/berechnung.js'

export default function FleteSeguroTabelle({ kalk, t, handlers }) {
  const { setFleteWaehrung, setFleteWechselkurs, updateFleteZeile, addFleteZeile, removeFleteZeile } = handlers
  const { flete, produkte } = kalk
  const zeilen = flete.zeilen || []
  const mehrere = (produkte.zeilen||[]).length > 1
  const { cifPYG, cifW2 } = berechneZwischen(kalk)

  const aufteilungOptions = [
    { value: 'Wert', label: t.wert },
    { value: 'Maßeinheit', label: t.maseinheit_opt },
    { value: 'Menge', label: t.menge_opt },
  ]

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/70 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
          <h2 className="font-bold text-slate-800">{t.flete_seguro}</h2>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            {t.waehrung}
            <input type="text" value={flete.waehrung} onChange={e => setFleteWaehrung(e.target.value)}
              className="w-14 px-1.5 py-0.5 text-xs border border-slate-200 rounded text-center font-semibold bg-white focus:outline-none focus:border-emerald-400" />
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            1&nbsp;{flete.waehrung}&nbsp;=
            <input type="number" value={flete.wechselkurs} onChange={e => setFleteWechselkurs(parseFloat(e.target.value)||0)}
              className="w-24 px-1.5 py-0.5 text-xs border border-slate-200 rounded text-right font-mono bg-white focus:outline-none focus:border-emerald-400" />
            PYG
          </span>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <th className="text-left px-6 py-2.5">{t.beschreibung}</th>
            <th className="text-right px-4 py-2.5 w-36">{t.betrag} ({flete.waehrung})</th>
            {mehrere && <th className="text-center px-4 py-2.5 w-36">{t.aufteilung}</th>}
            <th className="w-12" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {zeilen.map(z => (
            <tr key={z.id} className="group hover:bg-emerald-50/20 transition-colors">
              <td className="px-4 py-1.5"><EditableCell value={z.beschreibung} onChange={v => updateFleteZeile(z.id,'beschreibung',v)} align="left" /></td>
              <td className="px-4 py-1.5"><EditableCell value={z.betrag} onChange={v => updateFleteZeile(z.id,'betrag',v)} type="number" /></td>
              {mehrere && <td className="px-4 py-1.5"><DropdownCell value={z.aufteilung} options={aufteilungOptions} onChange={v => updateFleteZeile(z.id,'aufteilung',v)} /></td>}
              <td className="px-2">
                <button onClick={() => removeFleteZeile(z.id)}
                  className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center mx-auto rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-6 py-2.5 border-t border-slate-100">
        <button onClick={addFleteZeile} className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
          <span className="text-base leading-none">+</span>{t.zeile_hinzufuegen}
        </button>
      </div>

      <div className="px-6 py-5 bg-gradient-to-r from-emerald-50 to-teal-50/30 border-t border-emerald-100 flex flex-wrap gap-10">
        <SummaryField label={`${t.cif} (${flete.waehrung})`} value={cifW2} currency="USD" />
        <SummaryField label={`${t.cif} (PYG)`} value={cifPYG} currency="PYG" />
      </div>
    </section>
  )
}
