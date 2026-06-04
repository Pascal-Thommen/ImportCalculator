import EditableCell from '../ui/EditableCell.jsx'
import SummaryField from '../ui/SummaryField.jsx'
import { berechneZwischen } from '../../logic/berechnung.js'
import { lookupHs } from '../../data/hsDatenbank.js'
import { HERKUNFT_OPTIONEN } from '../../data/herkunftDaten.js'

export default function ProdukteTabelle({ kalk, t, handlers }) {
  const {
    setHerkunft, schätzen,
    setProduktWaehrung, setProduktWechselkurs,
    updateProduktZeile, setProduktHsCode,
    addProduktZeile, removeProduktZeile,
  } = handlers
  const { produkte, herkunft = '' } = kalk
  const zeilen = produkte.zeilen || []
  const mehrere = zeilen.length > 1
  const { fobPYG, fobW1 } = berechneZwischen(kalk)
  const herkunftDetails = HERKUNFT_OPTIONEN.find(h => h.key === herkunft) ?? null

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
      {/* Kopfzeile 1: Titel + Währung */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 to-transparent">
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

      {/* Kopfzeile 2: Herkunft + Schätzen */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-100 bg-blue-50/30">
        <span className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-medium">{t.herkunft}</span>
          <select
            value={herkunft}
            onChange={e => setHerkunft(e.target.value)}
            className="px-2 py-1 text-xs border border-slate-200 rounded bg-white focus:outline-none focus:border-blue-400 text-slate-700 min-w-[220px]"
          >
            {HERKUNFT_OPTIONEN.map(h => (
              <option key={h.key} value={h.key}>{h.label}</option>
            ))}
          </select>
          {herkunft && (
            <span className="text-slate-400 italic">
              {HERKUNFT_OPTIONEN.find(h => h.key === herkunft)?.frachtRate != null
                ? `≈ ${HERKUNFT_OPTIONEN.find(h => h.key === herkunft).frachtRate} USD/kg`
                : ''}
            </span>
          )}
        </span>
        <button
          onClick={schätzen}
          title={t.schaetzen_tooltip}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-colors shadow-sm"
        >
          {t.schaetzen}
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <th className="text-left px-6 py-2.5">{t.beschreibung}</th>
            <th className="text-right px-4 py-2.5 w-32">{t.betrag} ({produkte.waehrung})</th>
            <th className="text-right px-4 py-2.5 w-24">{t.menge}</th>
            <th className="text-right px-4 py-2.5 w-28">{t.gewicht_kg}</th>
            <th className="text-left px-4 py-2.5 w-40">{t.hs_code}</th>
            {mehrere && <th className="text-right px-4 py-2.5 w-24">{t.maseinheit}</th>}
            <th className="text-right px-4 py-2.5 w-32">Total ({produkte.waehrung})</th>
            <th className="w-12" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {zeilen.map(z => {
            const hsInfo = lookupHs(z.hsCode)
            return (
              <tr key={z.id} className="group hover:bg-blue-50/20 transition-colors">
                <td className="px-4 py-1.5">
                  <EditableCell value={z.name} onChange={v => updateProduktZeile(z.id,'name',v)} align="left" placeholder="Producto..." />
                </td>
                <td className="px-4 py-1.5">
                  <EditableCell value={z.betrag} onChange={v => updateProduktZeile(z.id,'betrag',v)} type="number" />
                </td>
                <td className="px-4 py-1.5">
                  <EditableCell value={z.menge} onChange={v => updateProduktZeile(z.id,'menge',v)} type="number" />
                </td>
                <td className="px-4 py-1.5">
                  <EditableCell value={z.gewicht ?? 0} onChange={v => updateProduktZeile(z.id,'gewicht',v)} type="number" />
                </td>
                <td className="px-4 py-1.5">
                  <div className="flex items-center gap-1">
                    <EditableCell
                      value={z.hsCode || ''}
                      onChange={v => setProduktHsCode(z.id, v)}
                      align="left"
                      placeholder="8471…"
                      className={!z.hsCodeManual ? 'text-slate-400' : ''}
                    />
                    {hsInfo && hsInfo.isc > 0 && (
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-100 text-amber-600 text-[9px] font-bold flex items-center justify-center" title={`ISC ${hsInfo.isc}%`}>ISC</span>
                    )}
                    {hsInfo && !herkunftDetails?.mercosur && hsInfo.zollsatz >= 30 && (
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-red-100 text-red-600 text-[9px] font-bold flex items-center justify-center" title={`Zoll ${hsInfo.zollsatz}%`}>!</span>
                    )}
                    {z.hsCode && !hsInfo && (
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-100 text-amber-500 text-[9px] font-bold flex items-center justify-center" title="HS-Code nicht in Datenbank">?</span>
                    )}
                  </div>
                  {hsInfo && (
                    <div className="text-xs text-slate-400 italic px-1 leading-tight mt-0.5 truncate max-w-[148px]" title={hsInfo.beschreibung}>
                      {hsInfo.beschreibung}
                    </div>
                  )}
                </td>
                {mehrere && (
                  <td className="px-4 py-1.5">
                    <EditableCell value={z.maseinheit} onChange={v => updateProduktZeile(z.id,'maseinheit',v)} type="number" />
                  </td>
                )}
                <td className="px-4 py-1.5 text-right font-mono text-slate-600">
                  {((z.betrag||0)*(z.menge||0)).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}
                </td>
                <td className="px-2">
                  <button onClick={() => removeProduktZeile(z.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center mx-auto rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all text-xs">✕</button>
                </td>
              </tr>
            )
          })}
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
