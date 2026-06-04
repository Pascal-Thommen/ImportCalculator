import { v4 as uuid } from 'uuid'

export function makeBeispiel1() {
  return {
    meta: {
      id: 'beispiel-1',
      name: 'Ejemplo 1 Producto',
      datum: new Date().toISOString(),
      isBeispiel: true,
    },
    sprache: 'DE',
    produkte: {
      waehrung: 'USD',
      wechselkurs: 7500,
      zeilen: [
        { id: uuid(), name: 'Televisor 55"', betrag: 500, menge: 10, maseinheit: 100 },
      ],
    },
    flete: {
      waehrung: 'USD',
      wechselkurs: 7500,
      zeilen: [
        { id: uuid(), beschreibung: 'Flete Internacional', betrag: 200, aufteilung: 'Wert' },
        { id: uuid(), beschreibung: 'Seguro',              betrag: 50,  aufteilung: 'Wert' },
      ],
    },
    importacion: {
      zeilen: [
        { id: uuid(), beschreibung: 'Derecho Aduanero',                betrag: 3937500, aufteilung: 'Wert',       impuesto: 'Exento' },
        { id: uuid(), beschreibung: 'Servicio de Valoración Aduanera', betrag: 131250,  aufteilung: 'Wert',       impuesto: 'Exento' },
        { id: uuid(), beschreibung: 'INDI',                            betrag: 52500,   aufteilung: 'Wert',       impuesto: 'Exento' },
        { id: uuid(), beschreibung: 'Percepción de IRE',               betrag: 262500,  aufteilung: 'Wert',       impuesto: 'Anticipo IRE' },
        { id: uuid(), beschreibung: 'Impuesto Selectivo al Consumo',   betrag: 0,       aufteilung: 'Wert',       impuesto: 'Exento' },
        { id: uuid(), beschreibung: 'IVA',                             betrag: 875000,  aufteilung: 'Wert',       impuesto: 'IVA CF' },
        { id: uuid(), beschreibung: 'Canon Informático (Sofía)',       betrag: 26250,   aufteilung: 'Wert',       impuesto: 'Exento' },
        { id: uuid(), beschreibung: 'Visación consular',               betrag: 75000,   aufteilung: 'Wert',       impuesto: 'Exento' },
        { id: uuid(), beschreibung: 'Tasa Portuaria',                  betrag: 110000,  aufteilung: 'Maßeinheit', impuesto: '10%' },
        { id: uuid(), beschreibung: 'Fotocopias',                      betrag: 55000,   aufteilung: 'Wert',       impuesto: '10%' },
        { id: uuid(), beschreibung: 'Gastos de Estiba/Desestiba',      betrag: 165000,  aufteilung: 'Maßeinheit', impuesto: '10%' },
        { id: uuid(), beschreibung: 'Honorarios del Despachante',      betrag: 660000,  aufteilung: 'Wert',       impuesto: '10%' },
      ],
    },
    nationale: {
      zeilen: [
        { id: uuid(), beschreibung: 'Flete Aduana-Depósito', betrag: 165000, aufteilung: 'Maßeinheit', impuesto: '10%' },
      ],
    },
  }
}

export function makeBeispiel2() {
  return {
    meta: {
      id: 'beispiel-2',
      name: 'Ejemplo 2 Productos',
      datum: new Date().toISOString(),
      isBeispiel: true,
    },
    sprache: 'DE',
    produkte: {
      waehrung: 'USD',
      wechselkurs: 7500,
      zeilen: [
        { id: uuid(), name: 'Televisor 55"', betrag: 500, menge: 10, maseinheit: 50 },
        { id: uuid(), name: 'Parlante BT',   betrag: 100, menge: 20, maseinheit: 10 },
      ],
    },
    flete: {
      waehrung: 'USD',
      wechselkurs: 7500,
      zeilen: [
        { id: uuid(), beschreibung: 'Flete Internacional', betrag: 250, aufteilung: 'Maßeinheit' },
        { id: uuid(), beschreibung: 'Seguro',              betrag: 60,  aufteilung: 'Wert' },
      ],
    },
    importacion: {
      zeilen: [
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
      ],
    },
    nationale: {
      zeilen: [
        { id: uuid(), beschreibung: 'Flete Aduana-Depósito', betrag: 180000, aufteilung: 'Maßeinheit', impuesto: '10%' },
      ],
    },
  }
}
