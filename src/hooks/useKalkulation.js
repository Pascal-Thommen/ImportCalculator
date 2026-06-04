import { useState, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import { makeDefaultImportacionZeilen, makeDefaultNationaleZeilen, makeDefaultFleteZeilen, makeDefaultProduktZeilen } from '../data/defaultRows.js'
import { makeEjMultipleProductos, makeEjercicio1 } from '../data/exampleKalkulationen.js'
import { berechneAutoFelder } from '../logic/berechnung.js'

const VERLAUF_KEY = 'importkalk_verlauf_v3'
const AKTIV_KEY   = 'importkalk_aktiv_v3'
const SPRACHE_KEY = 'importkalk_sprache'

function makeLeereKalkulation(nummer) {
  return {
    meta: { id: uuid(), name: `Kalkulation #${nummer}`, datum: new Date().toISOString(), isBeispiel: false },
    sprache: 'DE',
    herkunft: '',
    produkte: { waehrung: 'USD', wechselkurs: 7500, zeilen: makeDefaultProduktZeilen() },
    flete:    { waehrung: 'USD', wechselkurs: 7500, zeilen: makeDefaultFleteZeilen() },
    importacion: { zeilen: makeDefaultImportacionZeilen() },
    nationale:   { zeilen: makeDefaultNationaleZeilen() },
  }
}

function ladeVerlauf() {
  try {
    const raw = localStorage.getItem(VERLAUF_KEY)
    if (raw) return JSON.parse(raw)
  } catch { }
  return [makeEjMultipleProductos(), makeEjercicio1()]
}

function ladeAktivId(verlauf) {
  try {
    const raw = localStorage.getItem(AKTIV_KEY)
    if (raw) { const id = JSON.parse(raw); if (verlauf.find(k => k.meta.id === id)) return id }
  } catch { }
  return verlauf[0]?.meta.id || null
}

export function useKalkulation() {
  const [verlauf, setVerlaufRaw] = useState(() => ladeVerlauf())
  const [aktivId, setAktivIdRaw] = useState(() => ladeAktivId(ladeVerlauf()))
  const [sprache, setSpracheRaw] = useState(() => localStorage.getItem(SPRACHE_KEY) || 'DE')

  const setVerlauf = useCallback((v) => { setVerlaufRaw(v); localStorage.setItem(VERLAUF_KEY, JSON.stringify(v)) }, [])
  const setAktivId = useCallback((id) => { setAktivIdRaw(id); localStorage.setItem(AKTIV_KEY, JSON.stringify(id)) }, [])
  const setSprache = useCallback((s) => { setSpracheRaw(s); localStorage.setItem(SPRACHE_KEY, s) }, [])

  const aktiveKalk = verlauf.find(k => k.meta.id === aktivId) || verlauf[0]

  const updateAktive = useCallback((updater) => {
    setVerlauf(verlauf.map(k => k.meta.id === aktivId ? updater(k) : k))
  }, [verlauf, aktivId, setVerlauf])

  const neueKalkulation = useCallback(() => {
    const nr = verlauf.filter(k => !k.meta.isBeispiel).length + 1
    const neu = makeLeereKalkulation(nr)
    setVerlauf([...verlauf, neu])
    setAktivId(neu.meta.id)
  }, [verlauf, setVerlauf, setAktivId])

  const umbenennen = useCallback((id, name) =>
    setVerlauf(verlauf.map(k => k.meta.id === id ? { ...k, meta: { ...k.meta, name } } : k))
  , [verlauf, setVerlauf])

  const loeschen = useCallback((id) => {
    const next = verlauf.filter(k => k.meta.id !== id)
    if (next.length === 0) { const neu = makeLeereKalkulation(1); setVerlauf([neu]); setAktivId(neu.meta.id) }
    else { setVerlauf(next); if (aktivId === id) setAktivId(next[0].meta.id) }
  }, [verlauf, aktivId, setVerlauf, setAktivId])

  // Generisches Zeilen-Update: setzt _auto: false wenn betrag geändert wird
  const up = (path, id, feld, wert) => updateAktive(k => ({
    ...k, [path]: {
      ...k[path],
      zeilen: k[path].zeilen.map(z =>
        z.id === id
          ? { ...z, [feld]: wert, ...(feld === 'betrag' ? { _auto: false } : {}) }
          : z
      )
    }
  }))
  const add = (path, zeile) => updateAktive(k => ({ ...k, [path]: { ...k[path], zeilen: [...k[path].zeilen, zeile] } }))
  const del = (path, id)   => updateAktive(k => ({ ...k, [path]: { ...k[path], zeilen: k[path].zeilen.filter(z => z.id !== id) } }))

  // Füllt alle Zeilen mit _auto: true mit geschätzten Werten
  const schätzen = useCallback(() => {
    updateAktive(k => {
      const auto = berechneAutoFelder(k)

      const updateZeilen = (zeilen, autoMap) =>
        zeilen.map(z => {
          if (z._auto !== true) return z
          const wert = autoMap[z.beschreibung]
          if (wert === undefined || wert === null) return z
          return { ...z, betrag: wert }
        })

      return {
        ...k,
        flete:      { ...k.flete,      zeilen: updateZeilen(k.flete.zeilen      || [], auto.flete) },
        importacion:{ ...k.importacion, zeilen: updateZeilen(k.importacion.zeilen|| [], auto.importacion) },
        nationale:  { ...k.nationale,   zeilen: updateZeilen(k.nationale.zeilen  || [], auto.nationale) },
      }
    })
  }, [updateAktive])

  return {
    verlauf, aktivId, aktiveKalk, sprache, setSprache, setAktivId, neueKalkulation, umbenennen, loeschen,

    setHerkunft: (h) => updateAktive(k => ({ ...k, herkunft: h })),

    setProduktWaehrung:    (w)  => updateAktive(k => ({ ...k, produkte: { ...k.produkte, waehrung: w } })),
    setProduktWechselkurs: (wk) => updateAktive(k => ({ ...k, produkte: { ...k.produkte, wechselkurs: wk } })),
    updateProduktZeile:    (id, f, v) => updateAktive(k => ({
      ...k, produkte: { ...k.produkte, zeilen: k.produkte.zeilen.map(z => z.id === id ? { ...z, [f]: v } : z) }
    })),
    setProduktHsCode: (id, code) => updateAktive(k => ({
      ...k, produkte: { ...k.produkte, zeilen: k.produkte.zeilen.map(z =>
        z.id === id ? { ...z, hsCode: code, hsCodeManual: true } : z
      )}
    })),
    addProduktZeile:  () => add('produkte', { id: uuid(), name: `Producto ${(aktiveKalk?.produkte.zeilen.length||0)+1}`, betrag: 0, menge: 0, maseinheit: 0, gewicht: 0, hsCode: '', hsCodeManual: false }),
    removeProduktZeile: (id) => del('produkte', id),

    setFleteWaehrung:    (w)  => updateAktive(k => ({ ...k, flete: { ...k.flete, waehrung: w } })),
    setFleteWechselkurs: (wk) => updateAktive(k => ({ ...k, flete: { ...k.flete, wechselkurs: wk } })),
    updateFleteZeile:    (id, f, v) => up('flete', id, f, v),
    addFleteZeile:       () => add('flete', { id: uuid(), beschreibung: '', betrag: 0, aufteilung: 'Wert' }),
    removeFleteZeile:    (id) => del('flete', id),

    updateImportacionZeile: (id, f, v) => up('importacion', id, f, v),
    addImportacionZeile:    () => add('importacion', { id: uuid(), beschreibung: '', betrag: 0, aufteilung: 'Wert', impuesto: 'Exento' }),
    removeImportacionZeile: (id) => del('importacion', id),

    updateNationaleZeile: (id, f, v) => up('nationale', id, f, v),
    addNationaleZeile:    () => add('nationale', { id: uuid(), beschreibung: '', betrag: 0, aufteilung: 'Wert', impuesto: 'Exento' }),
    removeNationaleZeile: (id) => del('nationale', id),

    schätzen,
  }
}
