import ProdukteTabelle from '../tables/ProdukteTabelle.jsx'
import FleteSeguroTabelle from '../tables/FleteSeguroTabelle.jsx'
import ImportacionTabelle from '../tables/ImportacionTabelle.jsx'
import NationaleKostenTabelle from '../tables/NationaleKostenTabelle.jsx'
import Ergebnistabelle from '../tables/Ergebnistabelle.jsx'
import { berechne, berechneZwischen } from '../../logic/berechnung.js'

const fmtPYG = n => new Intl.NumberFormat('es-PY', { maximumFractionDigits: 0 }).format(Math.round(n || 0))
const fmtFX  = n => (n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function Metrik({ label, value, accent = false }) {
  return (
    <div className="text-right leading-none">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-slate-400 mb-0.5">{label}</div>
      <div className={`text-xs font-mono font-semibold ${accent ? 'text-blue-600' : 'text-slate-600'}`}>{value}</div>
    </div>
  )
}

export default function MainArea({ kalk, t, handlers }) {
  if (!kalk) return (
    <main className="flex-1 flex items-center justify-center bg-slate-50">
      <p className="text-slate-400">Keine Kalkulation ausgewählt.</p>
    </main>
  )

  const { fobW1, cifW2 } = berechneZwischen(kalk)
  const ergebnisse   = berechne(kalk)
  const totalTotal   = ergebnisse.reduce((s, e) => s + e.total,  0)
  const totalMenge   = ergebnisse.reduce((s, e) => s + (e.menge || 0), 0)
  const kostenProStk = totalMenge > 0 ? totalTotal / totalMenge : 0
  const hatWerte     = fobW1 > 0

  const waehrungP = kalk.produkte?.waehrung || 'USD'
  const waehrungF = kalk.flete?.waehrung    || 'USD'

  return (
    <main className="flex-1 overflow-y-auto bg-slate-100 flex flex-col">
      {/* Sticky header — zeigt immer das Ergebnis */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="px-8 py-3 flex items-center gap-4 min-h-[52px]">
          <div className="w-2 h-6 bg-blue-500 rounded-full flex-shrink-0" />
          <h1 className="text-sm font-bold text-slate-900 truncate">{kalk.meta.name}</h1>

          {hatWerte && (
            <>
              <div className="mx-2 w-px h-6 bg-slate-200 flex-shrink-0" />
              <div className="flex items-center gap-6 ml-auto">
                <Metrik label={`FOB (${waehrungP})`} value={fmtFX(fobW1)} />
                <Metrik label={`CIF (${waehrungF})`} value={fmtFX(cifW2)} />
                <Metrik label={`${t.gesamt} (PYG)`}  value={fmtPYG(totalTotal)} />
                {kostenProStk > 0 && (
                  <Metrik label={`${t.kosten_pro_unidad} (PYG)`} value={fmtPYG(kostenProStk)} accent />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-6 space-y-5">
        <ProdukteTabelle        kalk={kalk} t={t} handlers={handlers} />
        <FleteSeguroTabelle     kalk={kalk} t={t} handlers={handlers} />
        <ImportacionTabelle     kalk={kalk} t={t} handlers={handlers} />
        <NationaleKostenTabelle kalk={kalk} t={t} handlers={handlers} />
        <Ergebnistabelle        kalk={kalk} t={t} />
        <div className="h-6" />
      </div>
    </main>
  )
}
