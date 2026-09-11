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
  calor: 'hero-dia-auto.mp4',
  frio: 'hero-context-frio.mp4',
  madrugada: 'hero-context-madrugada.mp4',
  'noche-calor': 'hero-context-madrugada.mp4',
}

export function assetsFor(ctx) {
  const escena = ESCENA[ctx] || ESCENA.dia
  return {
    desktop: `${base}assets/img/kv-${escena}-desktop.jpg`,
    mobile: `${base}assets/img/kv-${escena}-mobile.jpg`,
    video: `${base}assets/video/${VIDEO[ctx] || VIDEO.dia}`
  }
}

// Detección de noche / madrugada (10:00 p.m. a 6:00 a.m.)
export function isNight(now = new Date()) {
  const h = now.getHours()
  return h >= 22 || h < 6
}

// Resolución automática del contexto: hora real del usuario + clima regional + temporada
export function resolveContext(now = new Date(), weather = null) {
  const h = now.getHours(), m = now.getMonth()
  const night = isNight(now)
  const temp = weather?.temp

  // Si tenemos temperatura real desde el servicio meteorológico
  if (temp != null) {
    if (night) {
      return temp >= 24 ? 'noche-calor' : 'madrugada'
    }
    if (temp >= 27) return 'calor'
    if (temp <= 15) return 'frio'
    return 'dia'
  }

  // Fallback instantáneo basado en horario del dispositivo y estacionalidad
  const warmSeason = m >= 4 && m <= 8
  if (night) return warmSeason ? 'noche-calor' : 'madrugada'
  if ([11, 0, 1].includes(m)) return 'frio'
  return warmSeason ? 'calor' : 'dia'
}

// Generador dinámico de saludo/reloj según ciudad y hora real
export function formatTimeGreeting(ctx, city = null, now = new Date()) {
  let h = now.getHours()
  const m = now.getMinutes().toString().padStart(2, '0')
  const ampm = h >= 12 ? 'p.m.' : 'a.m.'
  let h12 = h % 12
  if (h12 === 0) h12 = 12
  const horaStr = `Son las ${h12}:${m} ${ampm}`

  if (ctx === 'madrugada' || ctx === 'noche-calor') {
    return city ? `${horaStr} en ${city}` : horaStr
  }
  if (ctx === 'calor') {
    return city ? `En ${city}, ahora mismo` : 'Ahora mismo'
  }
  if (ctx === 'frio') {
    return city ? `Con el frío en ${city}` : 'Con el frío de esta temporada'
  }
  // Día: saludo natural según mañana o tarde
  return h >= 12 && h < 19 ? 'Buenas tardes' : 'Buenos días'
}

// Vista forzada solo por query (?vista=madrugada). Funciona con cualquier base path.
export function forcedFromUrl() {
  if (typeof window === 'undefined') return null
  const v = new URLSearchParams(window.location.search).get('vista')
  return ORDER.includes(v) ? v : null
}

// En producción pública este navegador NO existe. Solo se activa para el equipo si se indica en URL.
export function previewEnabled() {
  if (typeof window === 'undefined') return false
  const p = new URLSearchParams(window.location.search)
  return p.has('preview') || p.has('dev') || p.has('vista')
}
