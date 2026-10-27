// Variaciones del hero por momento del día y clima (Excel "Estructura, KWs y copy", columnas F–P).
// Erratas del Excel corregidas aquí: "epsecialista", "tratamieentos", "si tus síntomas te acercará", doble espacio.
import { getSimulatedDate, isNight } from './context.js'

// Umbrales de temperatura (°C). De noche el calor se siente antes.
const HOT_DAY = 27
const HOT_NIGHT = 24
const COLD = 15

// Columnas "Calor y lugar" / "Frío y lugar" ([LUGAR] = ciudad). Pendiente definir cuándo se usan.
export const LUGAR_SLOTS = ['calor-lugar', 'frio-lugar']

// Los textos describen el momento en que se visita el sitio. La hora y el clima nunca se presentan como causa
// de la enfermedad (aclaración de los asesores médicos, reunión del 22 de octubre de 2026).
const GENERICA = 'Si la comezón interfiere con tu trabajo o tu rutina, un profesional de la salud puede valorar tus síntomas.'
const CONVERSA = 'Conoce los síntomas característicos de la urticaria crónica espontánea (UCE) y coméntalos con un profesional de la salud.'
const CLIMA = {
  manana: { calor: 'Mañana de calor en [LUGAR]', frio: 'Mañana fría en [LUGAR]' },
  tarde: { calor: 'Tarde de calor en [LUGAR]', frio: 'Tarde fría en [LUGAR]' },
  noche: { calor: 'Noche calurosa en [LUGAR]', frio: 'Noche fría en [LUGAR]' }
}
const MOMENTOS = ['manana', 'tarde', 'noche']

// Arma las 11 variantes de una página: tres momentos, sus versiones con calor o frío, y las de ciudad.
function armar({ base, conClima, lugar }) {
  const out = {}
  for (const m of MOMENTOS) {
    out[m] = base[m]
    for (const c of ['calor', 'frio']) out[`${m}-${c}`] = conClima(CLIMA[m][c], m, c)
  }
  out['calor-lugar'] = lugar('Calor en [LUGAR]', 'calor')
  out['frio-lugar'] = lugar('Frío en [LUGAR]', 'frio')
  return out
}

// Títulos del banner de Inicio: documento "Novartis | Cambios Ronda 1" (27-oct-2026), hoja "Hoja 6", fila 2.
// Solo se corrigieron mayúsculas y "Haz de las Ronchas" (noche y calor) por "Haz de la urticaria".
const COLA = 'Haz de la urticaria la parte más pequeña de tu vida'
export const HOME_DEFAULT_TITLE = `Que la comezón no te detenga: ${COLA}`
const HOME_TITULOS = {
  manana: `Empieza tu día libre de comezón: ${COLA}`,
  'manana-calor': `Afronta el calor de la mañana sin ronchas: ${COLA}`,
  'manana-frio': `¿Mañanas frías y piel irritada? ${COLA}`,
  tarde: `Recupera tu tarde y para la comezón: ${COLA}`,
  'tarde-calor': `Que ni el calor ni la comezón detengan tu día: ${COLA}`,
  'tarde-frio': `¿Frío y comezón?: ${COLA}`,
  noche: `¿La comezón no te deja dormir? ${COLA}`,
  'noche-calor': `¿El calor y la comezón no te dejan dormir? ${COLA}`,
  'noche-frio': `¿El frío y la comezón interrumpen tu sueño?: ${COLA}`,
  // Variante con ubicación. El documento no indica cuándo se usa; por ahora no se muestra.
  'calor-lugar': `Ponle un alto a la comezón. ${COLA} en [LUGAR]`,
  'frio-lugar': `Ponle un alto a la comezón. ${COLA} en [LUGAR]`
}
const conTitulos = (page, titulos) =>
  Object.fromEntries(Object.entries(page).map(([slot, v]) => [slot, titulos[slot] ? { ...v, title: titulos[slot] } : v]))

const variations = {
  '': conTitulos(armar({
    base: {
      manana: { intro: 'Comenzar la mañana con ronchas o comezón puede afectar tu día. Un profesional de la salud puede valorar tus síntomas.' },
      tarde: { intro: 'Si la comezón interfiere con tu trabajo o tu rutina, un profesional de la salud puede valorar tus síntomas.' },
      noche: { intro: 'La comezón de noche puede afectar tu descanso. Anota cuándo aparece y conversa con un profesional de la salud.' }
    },
    conClima: (frase, m, c) => m === 'noche' && c === 'calor'
      ? { intro: 'Si la comezón afecta tu descanso, anota cuándo aparece y conversa con un profesional de la salud.' }
      : { intro: GENERICA },
    lugar: () => ({ intro: GENERICA })
  }), HOME_TITULOS),
  // Síntomas solo cambia por momento del día (Cambios Ronda 1, hoja "sintomas", fila 2): con calor o frío se usa
  // el mismo texto del momento.
  sintomas: (() => {
    const base = {
      manana: { title: '¿Inicias tu mañana con comezón? Reconoce los síntomas de la urticaria crónica y recupera el control', intro: `Comenzar el día con ronchas o comezón puede ser desgastante. ${CONVERSA}` },
      tarde: { title: 'Aprovecha la tarde. Reconoce los síntomas de la urticaria crónica y recupera el control', intro: `Llegar a la tarde con la piel irritada o con comezón puede dificultar tus actividades. ${CONVERSA}` },
      noche: { title: 'Que la comezón no te quite el sueño. Reconoce los síntomas de la urticaria crónica y recupera el control', intro: `La comezón de noche puede afectar tu descanso. ${CONVERSA}` }
    }
    return armar({ base, conClima: (frase, m) => base[m], lugar: () => base.tarde })
  })(),
  // Tratamiento solo cambia por momento del día (Cambios Ronda 1, hoja "tratamiento", fila 2).
  tratamiento: (() => {
    const intro = 'La comezón puede afectar tu vida personal y laboral. Un profesional de la salud puede valorar tu caso y orientarte sobre el tratamiento más adecuado para ti.'
    const base = {
      manana: { title: 'Despierta sin comezón: Encuentra el tratamiento para la urticaria crónica espontánea', intro },
      tarde: { title: '¿La comezón de la tarde interfiere con tus actividades? Habla con tu médico sobre tu tratamiento', intro },
      noche: { title: 'Duerme sin ronchas ni comezón: Habla con tu médico sobre el tratamiento de la urticaria crónica espontánea', intro: 'La comezón puede afectar tu descanso. Un profesional de la salud puede valorar tu caso y orientarte sobre el tratamiento más adecuado para ti.' }
    }
    // Variante con ubicación: cargada, pero el documento no indica cuándo se usa.
    const lugar = { title: 'Tratamiento para la urticaria crónica espontánea en [LUGAR]: Habla con tu médico hoy', intro }
    return armar({ base, conClima: (frase, m) => base[m], lugar: () => lugar })
  })(),
  // El Test no trae subtítulo propio: se conserva el texto base de la página.
  test: Object.fromEntries(Object.entries(armar({
    base: {
      manana: { title: '¿Despiertas con comezón? Haz el test informativo' },
      tarde: { title: '¿La comezón de la tarde afecta tu jornada? Haz el test informativo' },
      noche: { title: '¿La comezón afecta tu descanso? Haz el test informativo' }
    },
    conClima: frase => ({ title: `${frase}: haz el test informativo` }),
    lugar: frase => ({ title: `${frase}: haz el test informativo` })
  })))
}

// Momento del día + sensación térmica. Con temperatura real manda la temperatura;
// sin ella (o con ?vista= forzada) se usa el contexto visual para que texto y foto coincidan.
export function heroSlot(ctx, now = new Date(), temp = null) {
  const d = getSimulatedDate(now)
  const h = d.getHours()
  const night = isNight(d)
  // El momento sigue al escenario visual: madrugada y noche cálida siempre usan el texto nocturno,
  // y el resto nunca muestra texto de noche aunque la hora real sea nocturna (ligas de prueba con ?vista=).
  const dark = ctx === 'madrugada' || ctx === 'noche-calor'
  const moment = dark ? 'noche' : (night ? (h < 12 ? 'manana' : 'tarde') : h < 12 ? 'manana' : 'tarde')

  let thermal = ''
  if (temp != null) {
    if (temp >= (night ? HOT_NIGHT : HOT_DAY)) thermal = 'calor'
    else if (temp <= COLD) thermal = 'frio'
  } else if (ctx === 'calor' || ctx === 'noche-calor') thermal = 'calor'
  else if (ctx === 'frio') thermal = 'frio'

  return thermal ? `${moment}-${thermal}` : moment
}

// Devuelve { title, intro? } para la página y el contexto, o null si la página no tiene variaciones.
export function heroVariation(slug, ctx, now = new Date(), temp = null, city = null) {
  // Directorio: agrega la ciudad detectada al título (Cambios Ronda 1, hoja "directorio", fila 2).
  if (slug === 'directorio-medico') return city ? { title: `Directorio de alergólogos y dermatólogos en ${city}` } : null
  const page = variations[slug]
  if (!page) return null
  const v = page[heroSlot(ctx, now, temp)]
  if (!v) return null
  const place = city || 'tu ciudad'
  const fill = text => text?.replaceAll('[LUGAR]', place)
  return { title: fill(v.title), intro: fill(v.intro) }
}
