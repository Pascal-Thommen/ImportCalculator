import { useState, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import {
  makeDefaultImportacionZeilen,
  makeDefaultNationaleZeilen,
  makeDefaultFleteZeilen,
  makeDefaultProduktZeilen,
} from '../data/defaultRows.js'
import { makeBeispiel1, makeBeispiel2 } from '../data/exampleKalkulationen.js'

const VERLAUF_KEY = 'importkalk_verlauf'
const AKTIV_KEY   = 'importkalk_aktiv'
const SPRACHE_KEY = 'importkalk_sprache'

function makeLeereKalkulation(nummer) {
  return {
    meta: {
      id: uuid(),
      name: `Kalkulation #${nummer}`,
      datum: new Date().toISOString(),
      isBeispiel: false,
    },
    sprache: 'DE',
    produkte: {
      waehrung: 'USD',
      wechselkurs: 7500,
      zeilen: makeDefaultProduktZeilen(),
    },
    flete: {
      waehrung: 'USD',
      wechselkurs: 7500,
      zeilen: makeDefaultFleteZeilen(),
    },
    importacion: {
      zeilen: makeDefaultImportacionZeilen(),
    },
    nationale: {
      zeilen: makeDefaultNationaleZeilen(),
    },
  }
}

function ladeVerlauf() {
  try {
    const raw = localStorage.getItem(VERLAUF_KEY)
    if (raw) return JSON.parse(raw)
  } catch { }
  return [makeBeispiel1(), makeBeispiel2()]
}

function ladeAktivId(verlauf) {
  try {
    const raw = localStorage.getItem(AKTIV_KEY)
    if (raw) {
      const id = JSON.parse(raw)
      if (verlauf.find(k => k.meta.id === id)) return id
    }
  } catch { }
  return verlauf[0]?.meta.id || null
}

export function useKalkulation() {
  const [verlauf, setVerlaufRaw] = useState(() => ladeVerlauf())
  const [aktivId, setAktivIdRaw] = useState(() => {
    const v = ladeVerlauf()
    return ladeAktivId(v)
  })
  const [sprache, setSpracheRaw] = useState(() => {
    return localStorage.getItem(SPRACHE_KEY) || 'DE'
  })

  const setVerlauf = useCallback((v) => {
    setVerlaufRaw(v)
    localStorage.setItem(VERLAUF_KEY, JSON.stringify(v))
  }, [])

  const setAktivId = useCallback((id) => {
    setAktivIdRaw(id)
    localStorage.setItem(AKTIV_KEY, JSON.stringify(id))
  }, [])

  const setSprache = useCallback((s) => {
    setSpracheRaw(s)
    localStorage.setItem(SPRACHE_KEY, s)
  }, [])

  const aktiveKalk = verlauf.find(k => k.meta.id === aktivId) || verlauf[0]

  const updateAktive = useCallback((updater) => {
    setVerlauf(verlauf.map(k =>
      k.meta.id === aktivId ? updater(k) : k
    ))
  }, [verlauf, aktivId, setVerlauf])

  const neueKalkulation = useCallback(() => {
    const benutzerKalks = verlauf.filter(k => !k.isBeispiel)
    const nummer = benutzerKalks.length + 1
    const neu = makeLeereKalkulation(nummer)
    setVerlauf([...verlauf, neu])
    setAktivId(neu.meta.id)
  }, [verlauf, setVerlauf, setAktivId])

  const umbenennen = useCallback((id, neuerName) => {
    setVerlauf(verlauf.map(k =>
      k.meta.id === id ? { ...k, meta: { ...k.meta, name: neuerName } } : k
    ))
  }, [verlauf, setVerlauf])

  const loeschen = useCallback((id) => {
    const neuerVerlauf = verlauf.filter(k => k.meta.id !== id)
    if (neuerVerlauf.length === 0) {
      const neu = makeLeereKalkulation(1)
      setVerlauf([neu])
      setAktivId(neu.meta.id)
    } else {
      setVerlauf(neuerVerlauf)
      if (aktivId === id) setAktivId(neuerVerlauf[0].meta.id)
    }
  }, [verlauf, aktivId, setVerlauf, setAktivId])

  const setProduktWaehrung = useCallback((w) =>
    updateAktive(k => ({ ...k, produkte: { ...k.produkte, waehrung: w } })), [updateAktive])
  const setProduktWechselkurs = useCallback((wk) =>
    updateAktive(k => ({ ...k, produkte: { ...k.produkte, wechselkurs: wk } })), [updateAktive])
  const updateProduktZeile = useCallback((id, feld, wert) =>
    updateAktive(k => ({ ...k, produkte: { ...k.produkte, zeilen: k.produkte.zeilen.map(z => z.id === id ? { ...z, [feld]: wert } : z) } })), [updateAktive])
  const addProduktZeile = useCallback(() =>
    updateAktive(k => ({ ...k, produkte: { ...k.produkte, zeilen: [...k.produkte.zeilen, { id: uuid(), name: `Producto ${k.produkte.zeilen.length + 1}`, betrag: 0, menge: 0, maseinheit: 0 }] } })), [updateAktive])
  const removeProduktZeile = useCallback((id) =>
    updateAktive(k => ({ ...k, produkte: { ...k.produkte, zeilen: k.produkte.zeilen.filter(z => z.id !== id) } })), [updateAktive])

  const setFleteWaehrung = useCallback((w) =>
    updateAktive(k => ({ ...k, flete: { ...k.flete, waehrung: w } })), [updateAktive])
  const setFleteWechselkurs = useCallback((wk) =>
    updateAktive(k => ({ ...k, flete: { ...k.flete, wechselkurs: wk } })), [updateAktive])
  const updateFleteZeile = useCallback((id, feld, wert) =>
    updateAktive(k => ({ ...k, flete: { ...k.flete, zeilen: k.flete.zeilen.map(z => z.id === id ? { ...z, [feld]: wert } : z) } })), [updateAktive])
  const addFleteZeile = useCallback(() =>
    updateAktive(k => ({ ...k, flete: { ...k.flete, zeilen: [...k.flete.zeilen, { id: uuid(), beschreibung: '', betrag: 0, aufteilung: 'Wert' }] } })), [updateAktive])
  const removeFleteZeile = useCallback((id) =>
    updateAktive(k => ({ ...k, flete: { ...k.flete, zeilen: k.flete.zeilen.filter(z => z.id !== id) } })), [updateAktive])

  const updateImportacionZeile = useCallback((id, feld, wert) =>
    updateAktive(k => ({ ...k, importacion: { ...k.importacion, zeilen: k.importacion.zeilen.map(z => z.id === id ? { ...z, [feld]: wert } : z) } })), [updateAktive])
  const addImportacionZeile = useCallback(() =>
    updateAktive(k => ({ ...k, importacion: { ...k.importacion, zeilen: [...k.importacion.zeilen, { id: uuid(), beschreibung: '', betrag: 0, aufteilung: 'Wert', impuesto: 'Exento' }] } })), [updateAktive])
  const removeImportacionZeile = useCallback((id) =>
    updateAktive(k => ({ ...k, importacion: { ...k.importacion, zeilen: k.importacion.zeilen.filter(z => z.id !== id) } })), [updateAktive])

  const updateNationaleZeile = useCallback((id, feld, wert) =>
    updateAktive(k => ({ ...k, nationale: { ...k.nationale, zeilen: k.nationale.zeilen.map(z => z.id === id ? { ...z, [feld]: wert } : z) } })), [updateAktive])
  const addNationaleZeile = useCallback(() =>
    updateAktive(k => ({ ...k, nationale: { ...k.nationale, zeilen: [...k.nationale.zeilen, { id: uuid(), beschreibung: '', betrag: 0, aufteilung: 'Wert', impuesto: 'Exento' }] } })), [updateAktive])
  const removeNationaleZeile = useCallback((id) =>
    updateAktive(k => ({ ...k, nationale: { ...k.nationale, zeilen: k.nationale.zeilen.filter(z => z.id !== id) } })), [updateAktive])

  return {
    verlauf, aktivId, aktiveKalk, sprache, setSprache, setAktivId,
    neueKalkulation, umbenennen, loeschen,
    setProduktWaehrung, setProduktWechselkurs, updateProduktZeile, addProduktZeile, removeProduktZeile,
    setFleteWaehrung, setFleteWechselkurs, updateFleteZeile, addFleteZeile, removeFleteZeile,
    updateImportacionZeile, addImportacionZeile, removeImportacionZeile,
    updateNationaleZeile, addNationaleZeile, removeNationaleZeile,
  }
}
