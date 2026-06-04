import ProdukteTabelle from '../tables/ProdukteTabelle.jsx'
import FleteSeguroTabelle from '../tables/FleteSeguroTabelle.jsx'
import ImportacionTabelle from '../tables/ImportacionTabelle.jsx'
import NationaleKostenTabelle from '../tables/NationaleKostenTabelle.jsx'
import Ergebnistabelle from '../tables/Ergebnistabelle.jsx'
import HinweisePanel from '../ui/HinweisePanel.jsx'

export default function MainArea({ kalk, t, handlers }) {
  if (!kalk) return (
    <main className="flex-1 flex items-center justify-center bg-slate-50">
      <p className="text-slate-400">Keine Kalkulation ausgewählt.</p>
    </main>
  )

  const datum = new Date(kalk.meta.datum).toLocaleDateString('es-PY', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <main className="flex-1 overflow-y-auto bg-slate-100 flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="px-8 py-3.5 flex items-center gap-4">
          <div className="w-2 h-8 bg-blue-500 rounded-full flex-shrink-0" />
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">{kalk.meta.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{datum}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-6 space-y-5">
        <ProdukteTabelle       kalk={kalk} t={t} handlers={handlers} />
        <HinweisePanel         kalk={kalk} t={t} />
        <FleteSeguroTabelle    kalk={kalk} t={t} handlers={handlers} />
        <ImportacionTabelle    kalk={kalk} t={t} handlers={handlers} />
        <NationaleKostenTabelle kalk={kalk} t={t} handlers={handlers} />
        <Ergebnistabelle       kalk={kalk} t={t} />
        <div className="h-6" />
      </div>
    </main>
  )
}
