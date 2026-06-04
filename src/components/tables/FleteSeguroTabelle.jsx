import EditableCell from '../ui/EditableCell.jsx'
import DropdownCell from '../ui/DropdownCell.jsx'
import SummaryField from '../ui/SummaryField.jsx'
import { berechneZwischen } from '../../logic/berechnung.js'

export default function FleteSeguroTabelle({ kalk, t, handlers }) {
  const { setFleteWaehrung, setFleteWechselkurs, updateFleteZeile, addFleteZeile, removeFleteZeile } = handlers
  const { flete, produkte } = kalk
  const zeilen = flete.zeilen || []
  const mehrere = (produkte.zeilen || []).length > 1
  const { cifPYG, cifW2 } = berechneZwischen(kalk)

  const aufteilungOptions = [
    { value: 'Wert',       label: t.wert },
    { value: 'Maßeinheit', label: t.maseinheit_opt },
    { value: 'Menge',      label: t.menge_opt },
  ]

  return (
    <section className="mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b-2 border-green-500">
        {t.flete_seguro}
      </h2>

      {/* Währungszeile */}
      <div className="flex flex-wrap gap-4 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">{t.waehrung}:</label>
          <input
            type="text"
            value={flete.waehrung}
            onChange={e => setFleteWaehrung(e.target.value)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">{t.wechselkurs}{flete.waehrung}:</label>
          <input
            type="number"
            value={flete.wechselkurs}
            onChange={e => setFleteWechselkurs(parseFloat(e.target.value) || 0)}
            className="w-28 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400 text-right"
          />
        </div>
      </div>

      {/* Tabelle */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-2 py-2 font-medium text-gray-600">{t.beschreibung}</th>
              <th className="text-right px-2 py-2 font-medium text-gray-600">{t.betrag} ({flete.waehrung})</th>
              {mehrere && <th className="text-center px-2 py-2 font-medium text-gray-600">{t.aufteilung}</th>}
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {zeilen.map(z => (
              <tr key={z.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-2 py-1">
                  <EditableCell value={z.beschreibung} onChange={v => updateFleteZeile(z.id, 'beschreibung', v)} align="left" />
                </td>
                <td className="px-2 py-1">
                  <EditableCell value={z.betrag} onChange={v => updateFleteZeile(z.id, 'betrag', v)} type="number" />
                </td>
                {mehrere && (
                  <td className="px-2 py-1">
                    <DropdownCell value={z.aufteilung} options={aufteilungOptions} onChange={v => updateFleteZeile(z.id, 'aufteilung', v)} />
                  </td>
                )}
                <td className="px-1">
                  <button
                    onClick={() => removeFleteZeile(z.id)}
                    className="text-red-400 hover:text-red-600 text-xs px-1 py-0.5 rounded hover:bg-red-50"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addFleteZeile}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
      >
        {t.zeile_hinzufuegen}
      </button>

      {/* Summary */}
      <div className="flex flex-wrap gap-4 mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <SummaryField label={`${t.cif} (${flete.waehrung})`} value={cifW2} currency="USD" />
        <SummaryField label={`${t.cif} (PYG)`} value={cifPYG} currency="PYG" />
      </div>
    </section>
  )
}
