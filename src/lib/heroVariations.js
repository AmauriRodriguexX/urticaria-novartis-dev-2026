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
const CONVERSA = 'Conocer los signos te ayuda a conversarlos con un profesional de la salud.'
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

const COLA = 'Haz de la Urticaria la Parte Más Pequeña de tu Vida'
const variations = {
  '': armar({
    base: {
      manana: { title: `¿Empiezas el día con comezón? ${COLA}`, intro: 'Comenzar la mañana con ronchas o comezón puede afectar tu día. Un profesional de la salud puede valorar tus síntomas.' },
      tarde: { title: `¿La comezón te interrumpe por la tarde? ${COLA}`, intro: 'Si la comezón interfiere con tu trabajo o tu rutina, un profesional de la salud puede valorar tus síntomas.' },
      noche: { title: `¿La comezón no te deja dormir? ${COLA}`, intro: 'La comezón de noche puede afectar tu descanso. Anota cuándo aparece y conversa con un profesional de la salud.' }
    },
    conClima: (frase, m, c) => m === 'noche' && c === 'calor'
      ? { title: 'Noche calurosa en [LUGAR]: ¿la comezón no te deja dormir?', intro: 'Si la comezón afecta tu descanso, anota cuándo aparece y conversa con un profesional de la salud.' }
      : { title: `${frase}: ${COLA}`, intro: GENERICA },
    lugar: (frase, c) => ({ title: `${frase}: ${c === 'calor' ? 'Haz de las Ronchas la Parte Más Pequeña de tu Vida' : COLA}`, intro: GENERICA })
  }),
  sintomas: armar({
    base: {
      manana: { title: '¿Despiertas con comezón? Conoce los síntomas de la urticaria crónica espontánea', intro: `Comenzar el día con ronchas o comezón puede ser desgastante. ${CONVERSA}` },
      tarde: { title: '¿Comezón por la tarde? Conoce los síntomas de la urticaria crónica espontánea', intro: `Llegar a la tarde con la piel irritada o con comezón puede dificultar tus actividades. ${CONVERSA}` },
      noche: { title: '¿La comezón no te deja descansar? Conoce los síntomas de la urticaria crónica espontánea', intro: `La comezón de noche puede afectar tu descanso. ${CONVERSA}` }
    },
    conClima: frase => ({ title: `${frase}: conoce los síntomas de la urticaria crónica espontánea`, intro: CONVERSA }),
    lugar: frase => ({ title: `${frase}: conoce los síntomas de la urticaria crónica espontánea`, intro: CONVERSA })
  }),
  tratamiento: armar({
    base: {
      manana: { title: '¿La comezón afecta tu mañana? Habla con tu médico sobre tu tratamiento', intro: 'La comezón puede afectar tu vida personal y laboral. Un profesional de la salud puede valorar tu caso y orientarte sobre el tratamiento.' },
      tarde: { title: '¿La comezón de la tarde interfiere con tus actividades? Habla con tu médico sobre tu tratamiento', intro: 'La comezón puede afectar tu vida personal y laboral. Un profesional de la salud puede valorar tu caso y orientarte sobre el tratamiento.' },
      noche: { title: '¿La comezón afecta tu descanso? Habla con tu médico sobre tu tratamiento', intro: 'La comezón puede afectar tu descanso. Un profesional de la salud puede valorar tu caso y orientarte sobre el tratamiento.' }
    },
    conClima: frase => ({ title: `${frase}: habla con tu médico sobre tu tratamiento`, intro: 'Un profesional de la salud puede valorar tu caso y orientarte sobre el tratamiento.' }),
    lugar: frase => ({ title: `${frase}: habla con tu médico sobre tu tratamiento`, intro: 'Un profesional de la salud puede valorar tu caso y orientarte sobre el tratamiento.' })
  }),
  // El Test no trae subtítulo propio: se conserva el texto base de la página.
  test: Object.fromEntries(Object.entries(armar({
    base: {
      manana: { title: '¿Despiertas con comezón? Haz el test orientativo' },
      tarde: { title: '¿La comezón de la tarde afecta tu jornada? Haz el test orientativo' },
      noche: { title: '¿La comezón afecta tu descanso? Haz el test orientativo' }
    },
    conClima: frase => ({ title: `${frase}: haz el test orientativo` }),
    lugar: frase => ({ title: `${frase}: haz el test orientativo` })
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
  const page = variations[slug]
  if (!page) return null
  const v = page[heroSlot(ctx, now, temp)]
  if (!v) return null
  const place = city || 'tu ciudad'
  const fill = text => text?.replaceAll('[LUGAR]', place)
  return { title: fill(v.title), intro: fill(v.intro) }
}
