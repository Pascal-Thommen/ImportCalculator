// Frachtrichtwerte in USD/kg, Zollregime, Visacinonsular in USD
export const HERKUNFT_OPTIONEN = [
  { key: '',           label: '—',                                 frachtRate: null, mercosur: true,  visacionUSD: 0  },
  { key: 'brasil_arg', label: 'Brasil / Argentina (Mercosur)',     frachtRate: 0.30, mercosur: true,  visacionUSD: 0  },
  { key: 'mercosur',   label: 'Otros Mercosur',                    frachtRate: 0.50, mercosur: true,  visacionUSD: 0  },
  { key: 'asien_see',  label: 'Asia – Marítimo (China, VN, IN…)', frachtRate: 1.20, mercosur: false, visacionUSD: 35 },
  { key: 'asien_luft', label: 'Asia – Aéreo',                      frachtRate: 4.50, mercosur: false, visacionUSD: 35 },
  { key: 'europa',     label: 'Europa – Marítimo',                 frachtRate: 1.80, mercosur: false, visacionUSD: 25 },
  { key: 'usa_kanada', label: 'EE.UU. / Canadá – Marítimo',       frachtRate: 1.50, mercosur: false, visacionUSD: 0  },
  { key: 'sonstiges',  label: 'Otro país (≈ 1.50 USD/kg)',        frachtRate: 1.50, mercosur: false, visacionUSD: 25 },
]

export function getHerkunft(key) {
  return HERKUNFT_OPTIONEN.find(h => h.key === key) ?? HERKUNFT_OPTIONEN[0]
}
