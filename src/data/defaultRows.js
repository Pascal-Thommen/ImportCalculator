import { v4 as uuid } from 'uuid'

export function makeDefaultImportacionZeilen() {
  return [
    { id: uuid(), beschreibung: 'Derecho Aduanero',                betrag: 0, aufteilung: 'Wert',       impuesto: 'Exento',      _auto: true },
    { id: uuid(), beschreibung: 'Servicio de Valoración Aduanera', betrag: 0, aufteilung: 'Wert',       impuesto: 'Exento',      _auto: true },
    { id: uuid(), beschreibung: 'INDI',                            betrag: 0, aufteilung: 'Wert',       impuesto: 'Exento',      _auto: true },
    { id: uuid(), beschreibung: 'Percepción de IRE',               betrag: 0, aufteilung: 'Wert',       impuesto: 'Anticipo IRE',_auto: true },
    { id: uuid(), beschreibung: 'Impuesto Selectivo al Consumo',   betrag: 0, aufteilung: 'Wert',       impuesto: 'Exento',      _auto: true },
    { id: uuid(), beschreibung: 'IVA',                             betrag: 0, aufteilung: 'Wert',       impuesto: 'IVA CF',      _auto: true },
    { id: uuid(), beschreibung: 'Canon Informático (Sofía)',       betrag: 0, aufteilung: 'Wert',       impuesto: 'Exento',      _auto: true },
    { id: uuid(), beschreibung: 'Visación consular',               betrag: 0, aufteilung: 'Wert',       impuesto: 'Exento',      _auto: true },
    { id: uuid(), beschreibung: 'Tasa Portuaria',                  betrag: 0, aufteilung: 'Maßeinheit', impuesto: '10%',         _auto: true },
    { id: uuid(), beschreibung: 'Fotocopias',                      betrag: 0, aufteilung: 'Wert',       impuesto: '10%',         _auto: true },
    { id: uuid(), beschreibung: 'Gastos de Estiba/Desestiba',      betrag: 0, aufteilung: 'Maßeinheit', impuesto: '10%',         _auto: true },
    { id: uuid(), beschreibung: 'Honorarios del Despachante',      betrag: 0, aufteilung: 'Wert',       impuesto: '10%',         _auto: true },
  ]
}

export function makeDefaultNationaleZeilen() {
  return [
    { id: uuid(), beschreibung: 'Flete Aduana-Depósito', betrag: 0, aufteilung: 'Maßeinheit', impuesto: '10%', _auto: true },
  ]
}

export function makeDefaultFleteZeilen() {
  return [
    { id: uuid(), beschreibung: 'Flete Internacional', betrag: 0, aufteilung: 'Wert', _auto: true },
    { id: uuid(), beschreibung: 'Seguro',              betrag: 0, aufteilung: 'Wert', _auto: true },
  ]
}

export function makeDefaultProduktZeilen() {
  return [
    { id: uuid(), name: 'Producto 1', betrag: 0, menge: 0, maseinheit: 0, gewicht: 0, hsCode: '', hsCodeManual: false },
  ]
}
