import { getHerkunft } from '../data/herkunftDaten.js'
import { lookupHs } from '../data/hsDatenbank.js'

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

function despachanteBaseUSD(cifUSD) {
  if (cifUSD <= 0)      return 0
  if (cifUSD < 1000)    return 150
  if (cifUSD <= 10000)  return cifUSD * 0.025
  if (cifUSD <= 50000)  return cifUSD * 0.020
  if (cifUSD <= 200000) return cifUSD * 0.015
  return cifUSD * 0.010
}

// Berechnet Schätzwerte für alle Felder mit _auto: true.
// Rückgabe: { flete: {beschreibung: wert}, importacion: {...}, nationale: {...} }
// Flete-Werte in der Flete-Währung, alle anderen in PYG.
export function berechneAutoFelder(state) {
  const { produkte, flete, herkunft = '' } = state
  const wk1 = produkte.wechselkurs || 7500
  const wk2 = flete.wechselkurs    || 7500
  const herkunftInfo = getHerkunft(herkunft)

  const zeilen = produkte.zeilen || []

  // FOB
  const fobW1  = zeilen.reduce((s, p) => s + (p.betrag || 0) * (p.menge || 0), 0)
  const fobPYG = fobW1 * wk1
  const fobW2  = wk2 > 0 ? fobPYG / wk2 : 0

  // Gewicht gesamt (kg)
  const gewichtGesamt = zeilen.reduce((s, p) => s + (p.gewicht || 0), 0)

  // Fracht (in Flete-Währung)
  const frachtW2 = herkunftInfo.frachtRate !== null
    ? Math.round(gewichtGesamt * herkunftInfo.frachtRate * 100) / 100
    : null

  // Seguro = 0.4% × FOB (in Flete-Währung)
  const seguroW2 = Math.round(fobW2 * 0.004 * 100) / 100

  // CIF (PYG)
  const cifPYG = fobPYG + ((frachtW2 ?? 0) + seguroW2) * wk2
  const cifW2  = wk2 > 0 ? cifPYG / wk2 : 0

  // Gewichtete HS-Code-Sätze (nach FOB-Anteil)
  let avgZollsatz = 0, avgISC = 0, avgIVA = 10
  if (fobW1 > 0) {
    avgZollsatz = 0; avgISC = 0; avgIVA = 0
    for (const p of zeilen) {
      const share = ((p.betrag || 0) * (p.menge || 0)) / fobW1
      const hs = lookupHs(p.hsCode)
      avgZollsatz += share * (hs?.zollsatz ?? 0)
      avgISC      += share * (hs?.isc      ?? 0)
      avgIVA      += share * (hs?.iva      ?? 10)
    }
  }

  // Mercosur → kein Zoll
  const zollFinal = herkunftInfo.mercosur ? 0 : avgZollsatz
  const iscFinal  = herkunftInfo.mercosur ? 0 : avgISC

  // Importabgaben (PYG)
  const derechoAduanero = Math.round(zollFinal / 100 * cifPYG)
  const dna             = Math.round(0.005 * cifPYG)
  const indi            = Math.round(0.005 * cifPYG)
  const ire             = Math.round(0.020 * cifPYG)
  const isc             = Math.round(iscFinal / 100 * cifPYG)
  const ivaBase         = cifPYG + derechoAduanero + isc
  const iva             = Math.round(avgIVA / 100 * ivaBase)
  const canonSofia      = Math.round(5 * wk2)
  const visacion        = Math.round(herkunftInfo.visacionUSD * wk2)

  // Nationale Kosten (PYG)
  const frachtPYG           = (frachtW2 ?? 0) * wk2
  const tasaPortuaria       = Math.round(frachtPYG * 0.10 * 1.10)
  const fotocopias          = 15000
  const estiba              = 50000
  const fleteAduanaDeposito = 100000
  const despachante         = Math.round(despachanteBaseUSD(cifW2) * wk2 * 1.10)

  return {
    flete: {
      'Flete Internacional': frachtW2,   // null wenn Herkunft unbekannt
      'Seguro':              seguroW2,
    },
    importacion: {
      'Derecho Aduanero':                derechoAduanero,
      'Servicio de Valoración Aduanera': dna,
      'INDI':                            indi,
      'Percepción de IRE':               ire,
      'Impuesto Selectivo al Consumo':   isc,
      'IVA':                             iva,
      'Canon Informático (Sofía)':       canonSofia,
      'Visación consular':               visacion,
      'Tasa Portuaria':                  tasaPortuaria,
      'Fotocopias':                      fotocopias,
      'Gastos de Estiba/Desestiba':      estiba,
      'Honorarios del Despachante':      despachante,
    },
    nationale: {
      'Flete Aduana-Depósito': fleteAduanaDeposito,
    },
  }
}
