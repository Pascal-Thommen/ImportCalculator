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
    <section className="mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3 pb-1 border-b-2 border-blue-500">
        {t.produkte}
      </h2>

      {/* Währungszeile */}
      <div className="flex flex-wrap gap-4 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">{t.waehrung}:</label>
          <input
            type="text"
            value={produkte.waehrung}
            onChange={e => setProduktWaehrung(e.target.value)}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 font-medium">{t.wechselkurs}{produkte.waehrung}:</label>
          <input
            type="number"
            value={produkte.wechselkurs}
            onChange={e => setProduktWechselkurs(parseFloat(e.target.value) || 0)}
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
              <th className="text-right px-2 py-2 font-medium text-gray-600">{t.betrag} ({produkte.waehrung})</th>
              <th className="text-right px-2 py-2 font-medium text-gray-600">{t.menge}</th>
              {mehrere && <th className="text-right px-2 py-2 font-medium text-gray-600">{t.maseinheit}</th>}
              <th className="text-right px-2 py-2 font-medium text-gray-600">Total ({produkte.waehrung})</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {zeilen.map(z => {
              const total = (z.betrag || 0) * (z.menge || 0)
              return (
                <tr key={z.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-2 py-1">
                    <EditableCell value={z.name} onChange={v => updateProduktZeile(z.id, 'name', v)} align="left" placeholder="Producto..." />
                  </td>
                  <td className="px-2 py-1">
                    <EditableCell value={z.betrag} onChange={v => updateProduktZeile(z.id, 'betrag', v)} type="number" />
                  </td>
                  <td className="px-2 py-1">
                    <EditableCell value={z.menge} onChange={v => updateProduktZeile(z.id, 'menge', v)} type="number" />
                  </td>
                  {mehrere && (
                    <td className="px-2 py-1">
                      <EditableCell value={z.maseinheit} onChange={v => updateProduktZeile(z.id, 'maseinheit', v)} type="number" />
                    </td>
                  )}
                  <td className="px-2 py-1 text-right font-mono text-gray-700">
                    {total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-1">
                    <button
                      onClick={() => removeProduktZeile(z.id)}
                      className="text-red-400 hover:text-red-600 text-xs px-1 py-0.5 rounded hover:bg-red-50"
                      title="Zeile löschen"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={addProduktZeile}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
      >
        {t.zeile_hinzufuegen}
      </button>

      {/* Summary */}
      <div className="flex flex-wrap gap-4 mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <SummaryField label={`${t.fob} (${produkte.waehrung})`} value={fobW1} currency="USD" />
        <SummaryField label={`${t.fob} (PYG)`} value={fobPYG} currency="PYG" />
      </div>
    </section>
  )
}
