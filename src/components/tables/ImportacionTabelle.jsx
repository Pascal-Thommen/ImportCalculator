import EditableCell from '../ui/EditableCell.jsx'
import DropdownCell from '../ui/DropdownCell.jsx'
import SummaryField from '../ui/SummaryField.jsx'
import { splitBetrag } from '../../logic/berechnung.js'

export default function ImportacionTabelle({ kalk, t, handlers }) {
  const { updateImportacionZeile, addImportacionZeile, removeImportacionZeile } = handlers
  const { importacion, produkte } = kalk
  const zeilen = importacion.zeilen || []
  const mehrere = (produkte.zeilen||[]).length > 1

  const impuestoOptions = [
    { value: 'Exento', label: t.exento },
    { value: 'Anticipo IRE', label: t.anticipo_ire },
    { value: 'IVA CF', label: t.iva_cf },
    { value: '10%', label: '10%' },
    { value: '5%', label: '5%' },
  ]
  const aufteilungOptions = [
    { value: 'Wert', label: t.wert },
    { value: 'Maßeinheit', label: t.maseinheit_opt },
    { value: 'Menge', label: t.menge_opt },
  ]

  let totalKosten = 0, totalSteuern = 0
  zeilen.forEach(z => { const s = splitBetrag(z.betrag||0, z.impuesto||'Exento'); totalKosten += s.kosten; totalSteuern += s.steuern })
  const fmt = n => new Intl.NumberFormat('es-PY',{minimumFractionDigits:0,maximumFractionDigits:0}).format(Math.round(n))

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-3.5 border-b border-slate-100 bg-gradient-to-r from-amber-50/70 to-transparent">
        <div className="w-1.5 h-6 rounded-full bg-amber-500" />
        <h2 className="font-bold text-slate-800">{t.importacion}</h2>
        <span className="ml-1 text-xs text-slate-400 font-medium">— Guaraníes (PYG)</span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <th className="text-left px-6 py-2.5">{t.beschreibung}</th>
            <th className="text-right px-4 py-2.5 w-40">{t.betrag} (PYG)</th>
            {mehrere && <th className="text-center px-4 py-2.5 w-36">{t.aufteilung}</th>}
            <th className="text-center px-4 py-2.5 w-36">{t.impuesto}</th>
            <th className="text-right px-4 py-2.5 w-36">{t.kosten}</th>
            <th className="text-right px-4 py-2.5 w-32">{t.steuern}</th>
            <th className="w-12" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {zeilen.map(z => {
            const { kosten, steuern } = splitBetrag(z.betrag||0, z.impuesto||'Exento')
            const isAuto = z._auto === true
            return (
              <tr key={z.id} className={`group transition-colors ${isAuto ? 'bg-slate-50/60 hover:bg-amber-50/30' : 'hover:bg-amber-50/20'}`}>
                <td className="px-4 py-1.5">
                  <EditableCell value={z.beschreibung} onChange={v => updateImportacionZeile(z.id,'beschreibung',v)} align="left" />
                </td>
                <td className="px-4 py-1.5">
                  <EditableCell
                    value={z.betrag}
                    onChange={v => updateImportacionZeile(z.id,'betrag',v)}
                    type="number"
                    className={isAuto ? 'text-slate-400 italic' : ''}
                  />
                </td>
                {mehrere && <td className="px-4 py-1.5"><DropdownCell value={z.aufteilung} options={aufteilungOptions} onChange={v => updateImportacionZeile(z.id,'aufteilung',v)} /></td>}
                <td className="px-4 py-1.5"><DropdownCell value={z.impuesto} options={impuestoOptions} onChange={v => updateImportacionZeile(z.id,'impuesto',v)} /></td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-500 text-xs">{fmt(kosten)}</td>
                <td className="px-4 py-1.5 text-right font-mono text-slate-500 text-xs">{fmt(steuern)}</td>
                <td className="px-2">
                  <button onClick={() => removeImportacionZeile(z.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center mx-auto rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs">✕</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="px-6 py-2.5 border-t border-slate-100">
        <button onClick={addImportacionZeile} className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors">
          <span className="text-base leading-none">+</span>{t.zeile_hinzufuegen}
        </button>
      </div>

      <div className="px-6 py-5 bg-gradient-to-r from-amber-50 to-orange-50/30 border-t border-amber-100 flex flex-wrap gap-10">
        <SummaryField label={`${t.kosten} (PYG)`} value={totalKosten} currency="PYG" />
        <SummaryField label={`${t.steuern} (PYG)`} value={totalSteuern} currency="PYG" />
        <SummaryField label={`${t.total} (PYG)`} value={totalKosten+totalSteuern} currency="PYG" />
      </div>
    </section>
  )
}
