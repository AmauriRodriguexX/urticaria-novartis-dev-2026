// Resolución del contexto (hora / temporada) y assets por contexto.
// Los textos viven en campaign.js y no se tocan aquí.

export const ORDER = ['dia', 'calor', 'frio', 'madrugada', 'noche-calor']

export const LABELS = { dia: 'Día', calor: 'Calor', frio: 'Frío', madrugada: 'Madrugada', 'noche-calor': 'Noche cálida' }

export const DARK = new Set(['madrugada', 'noche-calor'])

// Color sólido de fondo por contexto (los temas usan gradientes; los velos necesitan un color plano).
export const SOLID = { dia: '#f0eee6', calor: '#fbf2e6', frio: '#eaf1f3', madrugada: '#15151b', 'noche-calor': '#1a1418' }

const base = import.meta.env.BASE_URL

// --- KEY VISUAL ------------------------------------------------------------
// Escenas aprobadas por Novartis, con expansión generativa para dejar la copa
// y la persona en la mitad derecha, fuera del velo del texto.
// Medidas y encuadre en docs/09-key-visuals.md
const ESCENA = {
  dia: 'restaurante-dia',
  calor: 'restaurante-calor',
  frio: 'restaurante-frio',
  madrugada: 'insomnio',
  'noche-calor': 'insomnio'
}

const VIDEO = {
  dia: 'hero-context-dia.mp4',
  calor: 'hero-context-calor.mp4',
  frio: 'hero-context-frio.mp4',
  madrugada: 'hero-context-madrugada.mp4',
  'noche-calor': 'hero-context-noche-calida.mp4'
}

export function assetsFor(ctx) {
  const escena = ESCENA[ctx] || ESCENA.dia
  return {
    desktop: `${base}assets/img/kv-${escena}-desktop.jpg`,
    mobile: `${base}assets/img/kv-${escena}-mobile.jpg`,
    video: `${base}assets/video/${VIDEO[ctx] || VIDEO.dia}`
  }
}

// Solo hora y mes del dispositivo por ahora. Cuando exista la matriz
// geo + clima, esta función es el único punto que cambia.
export function resolveContext(now = new Date()) {
  const h = now.getHours(), m = now.getMonth()
  const warmSeason = m >= 4 && m <= 8
  if (h < 6) return warmSeason ? 'noche-calor' : 'madrugada'
  if ([11, 0, 1].includes(m)) return 'frio'
  return warmSeason ? 'calor' : 'dia'
}

// Vista forzada solo por query (?vista=madrugada). Funciona con cualquier base path.
export function forcedFromUrl() {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('vista')
  return ORDER.includes(v) ? v : null
}

export function previewEnabled() {
  return true
}
