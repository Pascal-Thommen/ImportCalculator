import { lookupHs } from '../../data/hsDatenbank.js'
import { getHerkunft } from '../../data/herkunftDaten.js'

const TYP_STYLE = {
  success: {
    wrap:  'bg-green-50 border-green-200 text-green-800',
    icon:  'bg-green-100 text-green-600',
    sym:   '✓',
  },
  info: {
    wrap:  'bg-blue-50 border-blue-200 text-blue-800',
    icon:  'bg-blue-100 text-blue-500',
    sym:   'i',
  },
  warning: {
    wrap:  'bg-amber-50 border-amber-200 text-amber-800',
    icon:  'bg-amber-100 text-amber-600',
    sym:   '!',
  },
  danger: {
    wrap:  'bg-red-50 border-red-200 text-red-800',
    icon:  'bg-red-100 text-red-600',
    sym:   '!!',
  },
}

function fmt(template, vars) {
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), template)
}

function computeHinweise(kalk, t) {
  const hinweise = []
  const herkunftInfo = getHerkunft(kalk.herkunft || '')
  const zeilen = kalk.produkte?.zeilen || []
  const hatProdukte = zeilen.some(z => (z.betrag || 0) > 0)

  if (!hatProdukte) return hinweise

  // Herkunft fehlt
  if (!kalk.herkunft) {
    hinweise.push({ typ: 'info', text: t.warn_herkunft_fehlt })
  }

  // Mercosur-Vorteil
  if (kalk.herkunft && herkunftInfo.mercosur) {
    hinweise.push({ typ: 'success', text: t.warn_mercosur })
  }

  // Pro-Produkt HS-Code-Checks
  const seenISC = new Set()
  const seenZoll = new Set()
  let hatUnbekanntenCode = false

  for (const p of zeilen) {
    if (!(p.betrag > 0)) continue
    const name = p.name || p.hsCode || '—'

    if (!p.hsCode) continue

    const hs = lookupHs(p.hsCode)

    if (!hs) {
      hatUnbekanntenCode = true
      continue
    }

    // ISC
    if (hs.isc > 0 && !seenISC.has(p.hsCode)) {
      seenISC.add(p.hsCode)
      hinweise.push({
        typ: 'warning',
        text: fmt(t.warn_isc, { name, rate: hs.isc + '%' }),
      })
    }

    // Hoher Zoll (nur relevant wenn nicht Mercosur)
    if (!herkunftInfo.mercosur && !seenZoll.has(p.hsCode)) {
      if (hs.zollsatz >= 30) {
        seenZoll.add(p.hsCode)
        hinweise.push({
          typ: 'danger',
          text: fmt(t.warn_hochzoll_extrem, { name, rate: hs.zollsatz + '%' }),
        })
      } else if (hs.zollsatz >= 20) {
        seenZoll.add(p.hsCode)
        hinweise.push({
          typ: 'warning',
          text: fmt(t.warn_hochzoll, { name, rate: hs.zollsatz + '%' }),
        })
      }
    }
  }

  if (hatUnbekanntenCode) {
    const unbekannte = zeilen.filter(z => z.hsCode && !lookupHs(z.hsCode))
    if (unbekannte.length > 0) {
      hinweise.push({
        typ: 'info',
        text: fmt(t.warn_hs_unbekannt, { code: unbekannte[0].hsCode }),
      })
    }
  }

  // Gewicht fehlt bei gesetzter Herkunft
  if (kalk.herkunft && zeilen.every(z => !(z.gewicht > 0))) {
    hinweise.push({ typ: 'info', text: t.warn_gewicht_fehlt })
  }

  // HS-Code fehlt
  if (zeilen.some(z => (z.betrag || 0) > 0 && !z.hsCode)) {
    hinweise.push({ typ: 'info', text: t.warn_hs_fehlt })
  }

  return hinweise
}

export default function HinweisePanel({ kalk, t }) {
  const hinweise = computeHinweise(kalk, t)
  if (hinweise.length === 0) return null

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-2.5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
        <div className="w-1.5 h-5 rounded-full bg-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.hinweise}</span>
      </div>
      <div className="px-5 py-3 flex flex-wrap gap-2">
        {hinweise.map((h, i) => {
          const s = TYP_STYLE[h.typ] ?? TYP_STYLE.info
          return (
            <div key={i} className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-xs font-medium ${s.wrap}`}>
              <span className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold leading-none ${s.icon}`}>
                {s.sym}
              </span>
              <span className="leading-snug">{h.text}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
