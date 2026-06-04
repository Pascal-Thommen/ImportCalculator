export function splitBetrag(betrag, impuesto) {
  switch (impuesto) {
    case 'Exento':       return { kosten: betrag,           steuern: 0 }
    case 'Anticipo IRE': return { kosten: 0,                steuern: betrag }
    case 'IVA CF':       return { kosten: 0,                steuern: betrag }
    case '10%':          return { kosten: betrag / 1.10,    steuern: betrag / 11 }
    case '5%':           return { kosten: betrag / 1.05,    steuern: betrag / 21 }
    default:             return { kosten: betrag,           steuern: 0 }
  }
}

function getAnteil(produkt, aufteilung, alleProdukte) {
  if (alleProdukte.length === 1) return 1

  switch (aufteilung) {
    case 'Wert': {
      const fob = alleProdukte.reduce((s, p) => s + (p.betrag || 0) * (p.menge || 0), 0)
      if (fob === 0) return 1 / alleProdukte.length
      return ((produkt.betrag || 0) * (produkt.menge || 0)) / fob
    }
    case 'Maßeinheit': {
      const sumME = alleProdukte.reduce((s, p) => s + (p.maseinheit || 0), 0)
      if (sumME === 0) return 1 / alleProdukte.length
      return (produkt.maseinheit || 0) / sumME
    }
    case 'Menge': {
      const sumMG = alleProdukte.reduce((s, p) => s + (p.menge || 0), 0)
      if (sumMG === 0) return 1 / alleProdukte.length
      return (produkt.menge || 0) / sumMG
    }
    default:
      return 1 / alleProdukte.length
  }
}

export function berechne(state) {
  const { produkte, flete, importacion, nationale } = state
  const produkteZeilen = produkte.zeilen || []
  const wk1 = produkte.wechselkurs || 1
  const wk2 = flete.wechselkurs || 1

  const ergebnis = produkteZeilen.map(p => ({ ...p, kosten: 0, steuern: 0 }))

  const alleZeilen = [
    ...produkteZeilen.map(p => ({
      betrag: (p.betrag || 0) * (p.menge || 0) * wk1,
      impuesto: 'Exento',
      aufteilung: 'Wert',
    })),
    ...(flete.zeilen || []).map(z => ({
      betrag: (z.betrag || 0) * wk2,
      impuesto: 'Exento',
      aufteilung: z.aufteilung || 'Wert',
    })),
    ...(importacion.zeilen || []).map(z => ({
      betrag: z.betrag || 0,
      impuesto: z.impuesto || 'Exento',
      aufteilung: z.aufteilung || 'Wert',
    })),
    ...(nationale.zeilen || []).map(z => ({
      betrag: z.betrag || 0,
      impuesto: z.impuesto || 'Exento',
      aufteilung: z.aufteilung || 'Wert',
    })),
  ]

  for (const zeile of alleZeilen) {
    const { kosten, steuern } = splitBetrag(zeile.betrag, zeile.impuesto)
    for (let i = 0; i < produkteZeilen.length; i++) {
      const anteil = getAnteil(produkteZeilen[i], zeile.aufteilung, produkteZeilen)
      ergebnis[i].kosten  += kosten  * anteil
      ergebnis[i].steuern += steuern * anteil
    }
  }

  return ergebnis.map(p => ({
    id:              p.id,
    name:            p.name,
    menge:           p.menge || 0,
    kosten:          p.kosten,
    steuern:         p.steuern,
    total:           p.kosten + p.steuern,
    kostenProUnidad: (p.menge || 0) > 0 ? p.kosten / p.menge : 0,
  }))
}

export function berechneZwischen(state) {
  const { produkte, flete } = state
  const produkteZeilen = produkte.zeilen || []
  const wk1 = produkte.wechselkurs || 1
  const wk2 = flete.wechselkurs || 1

  const fobPYG = produkteZeilen.reduce((s, p) => s + (p.betrag || 0) * (p.menge || 0) * wk1, 0)
  const fobW1  = wk1 > 0 ? fobPYG / wk1 : 0

  const fletePYG = (flete.zeilen || []).reduce((s, z) => s + (z.betrag || 0) * wk2, 0)
  const cifPYG   = fobPYG + fletePYG
  const cifW2    = wk2 > 0 ? cifPYG / wk2 : 0

  return { fobPYG, fobW1, cifPYG, cifW2 }
}
