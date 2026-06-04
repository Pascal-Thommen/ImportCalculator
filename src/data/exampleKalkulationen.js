import { v4 as uuid } from 'uuid'

export function makeEjMultipleProductos() {
  return {
    meta: { id: 'ej-multiple', name: 'Ej: multiple productos', datum: new Date().toISOString(), isBeispiel: true },
    sprache: 'DE',
    produkte: {
      waehrung: 'USD', wechselkurs: 7500,
      zeilen: [
        { id: uuid(), name: 'Televisor 55"', betrag: 500, menge: 10, maseinheit: 50 },
        { id: uuid(), name: 'Parlante BT',   betrag: 100, menge: 20, maseinheit: 10 },
      ],
    },
    flete: {
      waehrung: 'USD', wechselkurs: 7500,
      zeilen: [
        { id: uuid(), beschreibung: 'Flete Internacional', betrag: 250, aufteilung: 'Maßeinheit' },
        { id: uuid(), beschreibung: 'Seguro',              betrag: 60,  aufteilung: 'Wert' },
      ],
    },
    importacion: { zeilen: [
      { id: uuid(), beschreibung: 'Derecho Aduanero',                betrag: 4312500, aufteilung: 'Wert',       impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'Servicio de Valoración Aduanera', betrag: 143750,  aufteilung: 'Wert',       impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'INDI',                            betrag: 57500,   aufteilung: 'Wert',       impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'Percepción de IRE',               betrag: 287500,  aufteilung: 'Wert',       impuesto: 'Anticipo IRE' },
      { id: uuid(), beschreibung: 'Impuesto Selectivo al Consumo',   betrag: 0,       aufteilung: 'Wert',       impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'IVA',                             betrag: 957500,  aufteilung: 'Wert',       impuesto: 'IVA CF' },
      { id: uuid(), beschreibung: 'Canon Informático (Sofía)',       betrag: 28750,   aufteilung: 'Wert',       impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'Visación consular',               betrag: 75000,   aufteilung: 'Wert',       impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'Tasa Portuaria',                  betrag: 110000,  aufteilung: 'Maßeinheit', impuesto: '10%' },
      { id: uuid(), beschreibung: 'Fotocopias',                      betrag: 55000,   aufteilung: 'Wert',       impuesto: '10%' },
      { id: uuid(), beschreibung: 'Gastos de Estiba/Desestiba',      betrag: 165000,  aufteilung: 'Maßeinheit', impuesto: '10%' },
      { id: uuid(), beschreibung: 'Honorarios del Despachante',      betrag: 720000,  aufteilung: 'Wert',       impuesto: '10%' },
    ]},
    nationale: { zeilen: [
      { id: uuid(), beschreibung: 'Flete Aduana-Depósito', betrag: 180000, aufteilung: 'Maßeinheit', impuesto: '10%' },
    ]},
  }
}

export function makeEjercicio1() {
  return {
    meta: { id: 'ejercicio-1', name: 'Ej: Ejercicio 1', datum: new Date().toISOString(), isBeispiel: true },
    sprache: 'DE',
    produkte: {
      waehrung: 'USD', wechselkurs: 7000,
      zeilen: [
        { id: uuid(), name: 'Producto x1', betrag: 88, menge: 1000, maseinheit: 1 },
      ],
    },
    flete: {
      waehrung: 'USD', wechselkurs: 7000,
      zeilen: [
        { id: uuid(), beschreibung: 'Flete marítimo exterior',  betrag: 10250.20, aufteilung: 'Wert', impuesto: 'Exento' },
        { id: uuid(), beschreibung: 'Seguro',                   betrag: 5380,     aufteilung: 'Wert', impuesto: 'Exento' },
      ],
    },
    importacion: { zeilen: [
      { id: uuid(), beschreibung: 'Derecho Aduanero',                betrag: 4380256,  aufteilung: 'Wert', impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'Servicio de Valoración Aduanera', betrag: 1250652,  aufteilung: 'Wert', impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'INDI',                            betrag: 217832,   aufteilung: 'Wert', impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'Percepción de IRE',               betrag: 2464000,  aufteilung: 'Wert', impuesto: 'Anticipo IRE' },
      { id: uuid(), beschreibung: 'Impuesto Selectivo al Consumo',   betrag: 0,        aufteilung: 'Wert', impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'IVA',                             betrag: 61600000, aufteilung: 'Wert', impuesto: 'IVA CF' },
      { id: uuid(), beschreibung: 'Canon Informático (Sofía)',       betrag: 210850,   aufteilung: 'Wert', impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'Visación consular',               betrag: 1890301,  aufteilung: 'Wert', impuesto: 'Exento' },
      { id: uuid(), beschreibung: 'Tasa Portuaria',                  betrag: 1456380,  aufteilung: 'Wert', impuesto: '10%' },
      { id: uuid(), beschreibung: 'Fotocopias',                      betrag: 55000,    aufteilung: 'Wert', impuesto: '10%' },
      { id: uuid(), beschreibung: 'Gastos de Estiba/Desestiba',      betrag: 1320000,  aufteilung: 'Wert', impuesto: '10%' },
      { id: uuid(), beschreibung: 'Honorarios del Despachante',      betrag: 3850246,  aufteilung: 'Wert', impuesto: '10%' },
    ]},
    nationale: { zeilen: [
      { id: uuid(), beschreibung: 'Flete interno (Aduana-Depósito)', betrag: 1870000, aufteilung: 'Wert', impuesto: '10%' },
    ]},
  }
}
