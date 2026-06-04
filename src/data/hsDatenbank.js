// HS-Code-Präfix → { beschreibung, zollsatz (AEC %), isc (ISC %), iva (IVA %) }
// Zollsätze gemäß Mercosur AEC (gilt für Nicht-Mercosur-Ursprünge)
const DB = {
  // Technologie & Elektronik
  '8471': { b: 'Computadoras, procesadores',          z:  0, i: 0, v:  5 },
  '8472': { b: 'Máquinas de oficina',                 z: 12, i: 0, v: 10 },
  '8473': { b: 'Partes de computadoras/máquinas',     z:  0, i: 0, v: 10 },
  '8517': { b: 'Teléfonos, smartphones',              z: 16, i: 0, v: 10 },
  '8518': { b: 'Micrófonos, altavoces',               z: 20, i: 0, v: 10 },
  '8519': { b: 'Reproductores de audio/video',        z: 20, i: 0, v: 10 },
  '8521': { b: 'Videograbadoras',                     z: 20, i: 0, v: 10 },
  '8528': { b: 'Monitores y televisores',             z: 20, i: 0, v: 10 },
  '8544': { b: 'Cables eléctricos',                   z: 14, i: 0, v: 10 },
  '8507': { b: 'Acumuladores eléctricos (baterías)',  z: 18, i: 0, v: 10 },
  // Indumentaria
  '6101': { b: 'Abrigos de punto, hombres',           z: 35, i: 0, v: 10 },
  '6102': { b: 'Abrigos de punto, mujeres',           z: 35, i: 0, v: 10 },
  '6109': { b: 'Camisetas de punto',                  z: 35, i: 0, v: 10 },
  '6110': { b: 'Pulóveres, suéteres',                 z: 35, i: 0, v: 10 },
  '6203': { b: 'Trajes y pantalones, hombres',        z: 35, i: 0, v: 10 },
  '6204': { b: 'Trajes y vestidos, mujeres',          z: 35, i: 0, v: 10 },
  '6211': { b: 'Ropa deportiva',                      z: 35, i: 0, v: 10 },
  // Calzado
  '6402': { b: 'Calzado exterior de caucho/plástico', z: 35, i: 0, v: 10 },
  '6403': { b: 'Calzado con parte superior de cuero', z: 35, i: 0, v: 10 },
  '6404': { b: 'Calzado con parte superior textil',   z: 35, i: 0, v: 10 },
  // Alimentos
  '0901': { b: 'Café',                                z: 10, i: 0, v:  5 },
  '1701': { b: 'Azúcar',                              z: 16, i: 0, v:  5 },
  '1901': { b: 'Preparaciones de harinas',            z: 18, i: 0, v:  5 },
  '1905': { b: 'Productos de panadería',              z: 18, i: 0, v:  5 },
  '2009': { b: 'Jugos de frutas',                     z: 20, i: 0, v: 10 },
  '2103': { b: 'Salsas y condimentos',                z: 20, i: 0, v: 10 },
  // Farmacéuticos
  '3003': { b: 'Medicamentos (sin dosificar)',         z:  0, i: 0, v:  5 },
  '3004': { b: 'Medicamentos dosificados',            z:  2, i: 0, v:  5 },
  // Cosméticos / Químicos
  '3301': { b: 'Aceites esenciales',                  z:  8, i: 0, v: 10 },
  '3303': { b: 'Perfumes y aguas de tocador',         z: 20, i: 0, v: 10 },
  '3304': { b: 'Cosméticos y maquillaje',             z: 20, i: 0, v: 10 },
  '3305': { b: 'Preparaciones capilares',             z: 18, i: 0, v: 10 },
  '3401': { b: 'Jabón y detergentes',                 z: 18, i: 0, v: 10 },
  // Plásticos
  '3923': { b: 'Artículos plásticos para transporte', z: 18, i: 0, v: 10 },
  '3926': { b: 'Otras manufacturas de plástico',      z: 18, i: 0, v: 10 },
  // Metales
  '7210': { b: 'Chapas de acero laminadas',           z: 12, i: 0, v: 10 },
  '7308': { b: 'Construcciones de hierro/acero',      z: 14, i: 0, v: 10 },
  // Maquinaria
  '8413': { b: 'Bombas para líquidos',                z: 14, i: 0, v: 10 },
  '8414': { b: 'Ventiladores y compresores',          z: 14, i: 0, v: 10 },
  '8415': { b: 'Aire acondicionado',                  z: 20, i: 0, v: 10 },
  '8418': { b: 'Refrigeradores y congeladores',       z: 20, i: 0, v: 10 },
  '8422': { b: 'Lavavajillas',                        z: 20, i: 0, v: 10 },
  '8450': { b: 'Lavadoras domésticas',                z: 20, i: 0, v: 10 },
  '8467': { b: 'Herramientas de mano con motor',      z: 14, i: 0, v: 10 },
  '8479': { b: 'Máquinas de uso general',             z: 12, i: 0, v: 10 },
  // Vehículos
  '8703': { b: 'Automóviles (turismo)',                z: 35, i: 1, v: 10 },
  '8708': { b: 'Partes y accesorios de vehículos',    z: 18, i: 0, v: 10 },
  // Juguetes / Juegos
  '9503': { b: 'Juguetes y vehículos de juguete',     z: 20, i: 0, v: 10 },
  '9504': { b: 'Videojuegos y juegos',                z: 20, i: 0, v: 10 },
  // Muebles
  '9401': { b: 'Asientos',                            z: 18, i: 0, v: 10 },
  '9403': { b: 'Muebles y sus partes',                z: 18, i: 0, v: 10 },
}

export function lookupHs(code) {
  if (!code) return null
  const d = String(code).replace(/\D/g, '')
  const entry = DB[d] ?? DB[d.slice(0, 4)] ?? null
  if (!entry) return null
  return { beschreibung: entry.b, zollsatz: entry.z, isc: entry.i, iva: entry.v }
}

export const HS_DATENBANK = DB
