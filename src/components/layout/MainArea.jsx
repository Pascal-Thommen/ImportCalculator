import ProdukteTabelle from '../tables/ProdukteTabelle.jsx'
import FleteSeguroTabelle from '../tables/FleteSeguroTabelle.jsx'
import ImportacionTabelle from '../tables/ImportacionTabelle.jsx'
import NationaleKostenTabelle from '../tables/NationaleKostenTabelle.jsx'
import Ergebnistabelle from '../tables/Ergebnistabelle.jsx'

export default function MainArea({ kalk, t, handlers }) {
  if (!kalk) {
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        <p className="text-gray-400">Keine Kalkulation ausgewählt.</p>
      </main>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{kalk.meta.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date(kalk.meta.datum).toLocaleDateString('es-PY', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <ProdukteTabelle kalk={kalk} t={t} handlers={handlers} />
        <FleteSeguroTabelle kalk={kalk} t={t} handlers={handlers} />
        <ImportacionTabelle kalk={kalk} t={t} handlers={handlers} />
        <NationaleKostenTabelle kalk={kalk} t={t} handlers={handlers} />
        <Ergebnistabelle kalk={kalk} t={t} />
      </div>
    </main>
  )
}
