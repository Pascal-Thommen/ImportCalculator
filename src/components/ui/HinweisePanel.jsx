import { lookupHs } from '../../data/hsDatenbank.js'
import { getHerkunft } from '../../data/herkunftDaten.js'

const CHIP = {
  success: 'bg-green-50  border-green-200  text-green-800',
  info:    'bg-blue-50   border-blue-200   text-blue-700',
  warning: 'bg-amber-50  border-amber-200  text-amber-800',
  danger:  'bg-red-50    border-red-200    text-red-800',
}
const SYM = { success: '✓', info: 'i', warning: '!', danger: '!!' }

function fmt(template, vars) {
  return Object.entries(vars).reduce((s, [k, v]) => s.replace(`{${k}}`, v), template)
}

function computeHinweise(kalk, t) {
  const hinweise = []
  const herkunftInfo = getHerkunft(kalk.herkunft || '')
  const zeilen = kalk.produkte?.zeilen || []
  const hatProdukte = zeilen.some(z => (z.betrag || 0) > 0)
  if (!hatProdukte) return hinweise

  if (!kalk.herkunft)
    hinweise.push({ typ: 'info', text: t.warn_herkunft_fehlt })

  if (kalk.herkunft && herkunftInfo.mercosur)
    hinweise.push({ typ: 'success', text: t.warn_mercosur })

  const seenISC = new Set(), seenZoll = new Set()
  let hatUnbekannt = false

  for (const p of zeilen) {
    if (!(p.betrag > 0) || !p.hsCode) continue
    const hs = lookupHs(p.hsCode)
    const name = p.name || p.hsCode

    if (!hs) { hatUnbekannt = true; continue }

    if (hs.isc > 0 && !seenISC.has(p.hsCode)) {
      seenISC.add(p.hsCode)
      hinweise.push({ typ: 'warning', text: fmt(t.warn_isc, { name, rate: hs.isc + '%' }) })
    }
    if (!herkunftInfo.mercosur && !seenZoll.has(p.hsCode)) {
      if (hs.zollsatz >= 30) {
        seenZoll.add(p.hsCode)
        hinweise.push({ typ: 'danger', text: fmt(t.warn_hochzoll_extrem, { name, rate: hs.zollsatz + '%' }) })
      } else if (hs.zollsatz >= 20) {
        seenZoll.add(p.hsCode)
        hinweise.push({ typ: 'warning', text: fmt(t.warn_hochzoll, { name, rate: hs.zollsatz + '%' }) })
      }
    }
  }

  if (hatUnbekannt) {
    const first = zeilen.find(z => z.hsCode && !lookupHs(z.hsCode))
    if (first) hinweise.push({ typ: 'info', text: fmt(t.warn_hs_unbekannt, { code: first.hsCode }) })
  }

  if (kalk.herkunft && zeilen.every(z => !(z.gewicht > 0)))
    hinweise.push({ typ: 'info', text: t.warn_gewicht_fehlt })

  if (zeilen.some(z => (z.betrag || 0) > 0 && !z.hsCode))
    hinweise.push({ typ: 'info', text: t.warn_hs_fehlt })

  return hinweise
}

// Rendert nur Chips — kein eigener Container, einbettbar überall.
export default function HinweisePanel({ kalk, t }) {
  const hinweise = computeHinweise(kalk, t)
  if (hinweise.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {hinweise.map((h, i) => (
        <span key={i} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${CHIP[h.typ] ?? CHIP.info}`}>
          <span className="font-bold text-[10px] leading-none">{SYM[h.typ]}</span>
          {h.text}
        </span>
      ))}
    </div>
  )
}
