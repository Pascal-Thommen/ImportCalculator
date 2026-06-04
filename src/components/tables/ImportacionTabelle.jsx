import EditableCell from '../ui/EditableCell.jsx'
import DropdownCell from '../ui/DropdownCell.jsx'
import SummaryField from '../ui/SummaryField.jsx'
import { splitBetrag } from '../../logic/berechnung.js'

export default function ImportacionTabelle({ kalk, t, handlers }) {
  const { updateImportacionZeile, addImportacionZeile, removeImportacionZeile } = handlers
  const { importacion, produkte } = kalk
  const zeilen = importacion.zeilen || []
  const mehrere = (produkte.zeilen || []).length > 1

  const impuestoOptions = [
    { value: 'Exento',       label: t.exento },
    { value: 'Anticipo IRE', label: t.anticipo_ire },
    { value: 'IVA CF',       label: t.iva_cf },
    { value: '10%',          label: '10%' },
    { value: '5%',           label: '5%' },
  ]

  const aufteilungOptions = [
    { value: 'Wert',       label: t.wert },
    { value: 'Maßeinheit', label: t.maseinheit_opt },
    { value: 'Menge',      label: t.menge_opt },
  ]

  let totalKosten = 0, totalSteuern = 0
  for (const z of zeilen) {
    const { kosten, steuern } = splitBetrag(z.betrag || 0, z.impuesto || 'Exento')
    totalKosten  += kosten
    totalSteuern += steuern
  }

  const formatPYG = n => new Intl.NumberFormat('es-PY', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(n))

  return (
    <section className="mb-6">
      <div className="flex items-center gap-3 mb-3 pb-1 border-b-2 border-orange-500">
        <h2 className="text-lg font-bold text-gray-800">{t.importacion}</h2>
        <span className="text-sm text-gray-500">— Guaraníes (PYG)</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-2 py-2 font-medium text-gray-600">{t.beschreibung}</th>
              <th className="text-right px-2 py-2 font-medium text-gray-600">{t.betrag} (PYG)</th>
              {mehrere && <th className="text-center px-2 py-2 font-medium text-gray-600">{t.aufteilung}</th>}
              <th className="text-center px-2 py-2 font-medium text-gray-600">{t.impuesto}</th>
              <th className="text-right px-2 py-2 font-medium text-gray-600">{t.kosten}</th>
              <th className="text-right px-2 py-2 font-medium text-gray-600">{t.steuern}</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {zeilen.map(z => {
              const { kosten, steuern } = splitBetrag(z.betrag || 0, z.impuesto || 'Exento')
              return (
                <tr key={z.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-2 py-1">
                    <EditableCell value={z.beschreibung} onChange={v => updateImportacionZeile(z.id, 'beschreibung', v)} align="left" />
                  </td>
                  <td className="px-2 py-1">
                    <EditableCell value={z.betrag} onChange={v => updateImportacionZeile(z.id, 'betrag', v)} type="number" />
                  </td>
                  {mehrere && (
                    <td className="px-2 py-1">
                      <DropdownCell value={z.aufteilung} options={aufteilungOptions} onChange={v => updateImportacionZeile(z.id, 'aufteilung', v)} />
                    </td>
                  )}
                  <td className="px-2 py-1">
                    <DropdownCell value={z.impuesto} options={impuestoOptions} onChange={v => updateImportacionZeile(z.id, 'impuesto', v)} />
                  </td>
                  <td className="px-2 py-1 text-right font-mono text-gray-600 text-xs">{formatPYG(kosten)}</td>
                  <td className="px-2 py-1 text-right font-mono text-gray-600 text-xs">{formatPYG(steuern)}</td>
                  <td className="px-1">
                    <button
                      onClick={() => removeImportacionZeile(z.id)}
                      className="text-red-400 hover:text-red-600 text-xs px-1 py-0.5 rounded hover:bg-red-50"
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
        onClick={addImportacionZeile}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
      >
        {t.zeile_hinzufuegen}
      </button>

      {/* Summary */}
      <div className="flex flex-wrap gap-4 mt-3 p-3 bg-orange-50 rounded-lg border border-orange-100">
        <SummaryField label={`${t.kosten} (PYG)`} value={totalKosten} currency="PYG" />
        <SummaryField label={`${t.steuern} (PYG)`} value={totalSteuern} currency="PYG" />
        <SummaryField label={`${t.total} (PYG)`} value={totalKosten + totalSteuern} currency="PYG" />
      </div>
    </section>
  )
}
