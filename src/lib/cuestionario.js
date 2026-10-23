// ============================================================================
// ESTRUCTURA DEL CUESTIONARIO Y MOTOR DE EVALUACIÓN CLÍNICA (BEN / NOVARTIS CSU)
//
// Integra el modelo de puntuación oficial de 0 a 35 puntos:
//   - Eje Síntomas: Q1 a Q5 (0 a 15 pts)
//   - Eje Calidad de Vida: Q6 a Q11 (0 a 20 pts)
//   - Eje Desencadenantes: Q12 y Q13
//   - Eje Tratamiento y Consulta: Q14 a Q19
// Genera el informe clínico estructurado en 6 secciones para el paciente y el médico.
// ============================================================================

export const PREGUNTAS = [
  { id: 'q0', contextos: 'todos', resumen: 'Nombre' },
  { id: 'q1', contextos: 'todos', resumen: 'Síntomas presentados' },
  {
    id: 'q1b',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q1) && r.q1.includes('hinchazon'),
    urgencia: (v) => v === 'urgente',
    resumen: 'Señales de urgencia'
  },
  {
    id: 'q2',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q1) && !r.q1.includes('ninguno') && r.q1.length > 0,
    resumen: 'Tiempo con síntomas'
  },
  {
    id: 'q3',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q1) && r.q1.includes('ronchas'),
    resumen: 'Cantidad de ronchas (24h)'
  },
  {
    id: 'q4',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q1) && r.q1.includes('picazon'),
    resumen: 'Intensidad de comezón'
  },
  {
    id: 'q5',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q1) && r.q1.includes('hinchazon'),
    resumen: 'Severidad de hinchazón'
  },
  {
    id: 'q6',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q1) && !r.q1.includes('ninguno') && r.q1.length > 0,
    resumen: 'Áreas de vida afectadas'
  },
  {
    id: 'q7',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q6) && r.q6.includes('actividades'),
    resumen: 'Interferencia en actividades'
  },
  {
    id: 'q8',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q6) && r.q6.includes('sociales'),
    resumen: 'Afectación en relaciones sociales'
  },
  {
    id: 'q8b',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q6) && r.q6.includes('sexual'),
    resumen: 'Afectación en vida sexual'
  },
  {
    id: 'q9',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q6) && r.q6.includes('vestimenta'),
    resumen: 'Influencia en vestimenta'
  },
  {
    id: 'q10',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q6) && r.q6.includes('trabajo'),
    resumen: 'Afectación en trabajo/estudios'
  },
  {
    id: 'q11',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q6) && r.q6.includes('sueno'),
    resumen: 'Afectación en calidad de sueño'
  },
  {
    id: 'q12',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q1) && !r.q1.includes('ninguno') && r.q1.length > 0,
    resumen: 'Comentarios que has recibido'
  },
  {
    id: 'q13',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q1) && !r.q1.includes('ninguno') && r.q1.length > 0,
    resumen: 'Momento de mayor intensidad'
  },
  {
    id: 'q14',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q1) && !r.q1.includes('ninguno') && r.q1.length > 0,
    resumen: 'Consulta médica previa'
  },
  {
    id: 'q15',
    contextos: 'todos',
    si: (r) => r.q14 === '1',
    resumen: 'Frecuencia de consulta'
  },
  {
    id: 'q16',
    contextos: 'todos',
    si: (r) => r.q14 === '1',
    resumen: 'Especialista consultado'
  },
  {
    id: 'q17',
    contextos: 'todos',
    si: (r) => Array.isArray(r.q1) && !r.q1.includes('ninguno') && r.q1.length > 0,
    resumen: 'Tratamiento previo'
  },
  {
    id: 'q18',
    contextos: 'todos',
    si: (r) => r.q17 === '1',
    resumen: 'Tipo de tratamiento'
  },
  {
    id: 'q19',
    contextos: 'todos',
    si: (r) => r.q17 === '1',
    resumen: 'Efectividad percibida'
  }
]

// Tipos de tratamiento (Q18), sin nombres de productos ni fármacos: solo la forma de uso.
// SUJETO A CAMBIOS: la lista de opciones la define Novartis; ver ajustes-colega/REGISTRO-DE-CAMBIOS.md.
const TIPOS_TRAT = { oral: 'pastillas o jarabes', inyeccion: 'inyecciones', piel: 'productos en la piel', otro: 'otro tipo de tratamiento' }
function tiposTrat(sel) {
  const lista = (sel || []).map(k => TIPOS_TRAT[k]).filter(Boolean)
  return lista.length ? formatListES(lista, 'y') : 'algún tratamiento'
}

// Función auxiliar de formateo en español con regla de 'y' / 'e'
export function formatListES(items, conector = 'y') {
  if (!items || items.length === 0) return ''
  if (items.length === 1) return items[0]
  const last = items[items.length - 1]
  const initial = items.slice(0, -1).join(', ')
  const needsE = conector === 'y' && /^(i|hi)[^aeiou]/i.test(last.trim())
  const c = needsE ? 'e' : conector
  return `${initial} ${c} ${last}`
}

/** Motor de Puntuación de Ben (0 a 35 pts) */
export function calcularPuntuacionBen(r) {
  let sintomasPts = 0
  if (r.q1 && !r.q1.includes('ninguno')) {
    sintomasPts += (r.q1.includes('ronchas') ? 1 : 0) + (r.q1.includes('picazon') ? 1 : 0) + (r.q1.includes('hinchazon') ? 1 : 0)
  }
  if (r.q2 != null) sintomasPts += parseInt(r.q2, 10) || 0
  if (r.q3 != null) sintomasPts += parseInt(r.q3, 10) || 0
  if (r.q4 != null) sintomasPts += parseInt(r.q4, 10) || 0
  if (r.q5 != null) sintomasPts += parseInt(r.q5, 10) || 0

  let cvPts = 0
  ;['q7', 'q8', 'q8b', 'q9', 'q10', 'q11'].forEach((id) => {
    if (r[id] != null) cvPts += parseInt(r[id], 10) || 0
  })

  const total = sintomasPts + cvPts
  return { sintomasPts, cvPts, total }
}

/** Generador de las 6 Secciones del Modelo de Ben */
export function generarReporteBen(r) {
  const nombre = (r.q0 || '').trim() || 'Hola'
  const { sintomasPts: sPts, cvPts, total } = calcularPuntuacionBen(r)

  // SECCIÓN 1: Diagnóstico probabilístico
  let sDesc = ''
  if (sPts <= 1) sDesc = 'no presentas síntomas de urticaria, como habones (ronchas), comezón o hinchazón (angioedema)'
  else if (sPts <= 3) sDesc = 'presentas síntomas leves de urticaria'
  else if (sPts <= 5) sDesc = 'presentas síntomas moderados de urticaria'
  else if (sPts <= 10) sDesc = 'presentas síntomas intensos de urticaria'
  else sDesc = 'presentas síntomas muy intensos de urticaria'

  let cvDesc = ''
  if (cvPts <= 1) cvDesc = ''
  else if (cvPts <= 4) cvDesc = ' que afectan ligeramente tu vida diaria'
  else if (cvPts <= 7) cvDesc = ' que afectan algunas áreas de tu vida diaria'
  else if (cvPts <= 14) cvDesc = ' que afectan en gran medida tu vida diaria'
  else cvDesc = ' que afectan gravemente tu vida diaria'

  let probDesc = ''
  if (total <= 7) probDesc = 'Es poco probable que sufras urticaria crónica espontánea.'
  else if (total <= 12) probDesc = 'Es medianamente probable que sufras urticaria crónica espontánea.'
  else if (total <= 24) probDesc = 'Es probable que sufras urticaria crónica espontánea.'
  else probDesc = 'Es altamente probable que sufras urticaria crónica espontánea.'

  const seccion1 = `${nombre}, ${sDesc}${cvDesc}. ${probDesc}`

  // SECCIÓN 2: Síntomas
  const sList = []
  if (r.q3 === '1') sList.push('menos de 20 ronchas al día')
  else if (r.q3 === '2') sList.push('entre 20 y 50 ronchas al día')
  else if (r.q3 === '3') sList.push('más de 50 ronchas o largas áreas de enrojecimiento')

  if (r.q4 === '1') sList.push('comezón leve')
  else if (r.q4 === '2') sList.push('comezón moderada que es algo molesta')
  else if (r.q4 === '3') sList.push('comezón severa que interfiere con tus actividades')

  if (r.q5 === '1') sList.push('hinchazón leve que desaparece rápidamente')
  else if (r.q5 === '2') sList.push('hinchazón notoria que puede causar incomodidad')
  else if (r.q5 === '3') sList.push('hinchazón severa y dolorosa que dificulta la movilidad')

  const seccion2 = sList.length > 0 ? `Presentas ${formatListES(sList, 'y')}.` : ''

  // SECCIÓN 3: Afectaciones en calidad de vida
  // Solo se listan las áreas marcadas cuya escala suma más de 0 pts (orden del Excel).
  const AREAS = [
    ['actividades', 'q7', 'actividades diarias (como limpiar tu hogar)'],
    ['sociales', 'q8', 'actividades sociales (como salir con tu pareja, familia o amigos)'],
    ['sexual', 'q8b', 'tu vida sexual'],
    ['vestimenta', 'q9', 'la manera en que te vistes'],
    ['trabajo', 'q10', 'tu trabajo o estudios'],
    ['sueno', 'q11', 'calidad del sueño']
  ]
  const aList = AREAS
    .filter(([area, q]) => r.q6?.includes(area) && (parseInt(r[q], 10) || 0) > 0)
    .map(([, , texto]) => texto)

  const seccion3 = aList.length > 0 ? `Estos síntomas han afectado negativamente áreas de tu vida como: ${formatListES(aList, 'y')}.` : ''

  // SECCIÓN 4: Detonantes
  // Q12 son mitos que escuchan los pacientes: en la urticaria crónica espontánea no suele
  // identificarse un desencadenante externo, así que el resumen no los presenta como causas.
  const dList = []
  if (r.q12 && r.q12.includes('estres')) dList.push('el estrés')
  if (r.q12 && r.q12.includes('alergia')) dList.push('una alergia')
  if (r.q12 && r.q12.includes('sudor')) dList.push('el sudor')
  if (r.q12 && r.q12.includes('clima')) dList.push('el clima')
  if (r.q12 && r.q12.includes('comida')) dList.push('lo que comes')
  if (r.q12 && r.q12.includes('ropa')) dList.push('la ropa o el jabón')

  let momentoStr = ''
  if (r.q13) {
    if (r.q13 === 'manana') momentoStr = 'por la mañana'
    else if (r.q13 === 'tarde') momentoStr = 'por la tarde'
    else if (r.q13 === 'noche') momentoStr = 'por la noche'
    else if (r.q13 === 'sin_patron') momentoStr = 'sin importar el momento del día'
  }

  // "principalmente" solo acompaña a un momento concreto del día.
  const momentoFrase = r.q13 === 'sin_patron' ? momentoStr : `principalmente ${momentoStr}`

  const comentarios = dList.length > 0
    ? `Has escuchado que tus ronchas son por ${formatListES(dList, 'o')}. En la urticaria crónica espontánea no suele identificarse un desencadenante externo concreto: conviene comentarlo con un alergólogo o dermatólogo.`
    : ''
  let seccion4 = ''
  if (momentoStr) seccion4 = `Tus ronchas se dan ${momentoFrase}.`
  if (comentarios) seccion4 = seccion4 ? `${seccion4} ${comentarios}` : comentarios

  // SECCIÓN 5: Tratamiento y Consulta
  let seccion5 = ''
  const consulto = r.q14 === '1'
  const trat = r.q17 === '1'

  if (r.q14 == null) {
    // Sin síntomas no se hicieron las preguntas de historial: no hay nada que resumir.
    seccion5 = ''
  } else if (!consulto && !trat) {
    seccion5 = 'No has consultado a un médico sobre tus síntomas y no has recibido ninguna clase de tratamiento. Es altamente recomendable que acudas con un alergólogo o dermatólogo, o con un médico general que te canalice con uno de ellos, para recibir un tratamiento adecuado a tu caso.'
  } else if (!consulto && trat) {
    seccion5 = `No has consultado a un médico sobre tus síntomas, pero has usado ${tiposTrat(r.q18)}.`
  } else if (consulto) {
    const medList = []
    if (r.q16 && r.q16.includes('general')) medList.push('médicos generales')
    if (r.q16 && r.q16.includes('dermatologo')) medList.push('dermatólogos')
    if (r.q16 && r.q16.includes('alergologo')) medList.push('alergólogos')
    const medStr = medList.length > 0 ? formatListES(medList, 'y') : 'médicos'

    const freqStr = r.q15 === '3' ? 'de manera constante' : (r.q15 === '2' ? 'al menos una vez al mes' : 'pocas veces')
    const tipoT = trat ? ` y has usado ${tiposTrat(r.q18)}` : ''

    seccion5 = `Has recibido consulta con ${medStr} ${freqStr}${tipoT}.`
  }

  // SECCIÓN 6: Recomendación Final
  // Copy del Excel con su redacción corregida ("recomendamos altamente importante que…").
  // Solo aplica con tratamiento y con el umbral clínico: síntomas >= 2 y calidad de vida >= 2.
  const CIERRE = 'Tomando en cuenta esto, tus síntomas y el impacto en tu vida,'
  let seccion6 = ''
  if (trat && sPts >= 2 && cvPts >= 2) {
    if (r.q19 === '0') {
      seccion6 = `Consideras que tu tratamiento no ha sido nada efectivo. ${CIERRE} es muy importante que hables con un alergólogo o dermatólogo sobre tus síntomas y posibles tratamientos.`
    } else if (r.q19 === '1') {
      seccion6 = `Consideras que tu tratamiento ha sido poco efectivo. ${CIERRE} es muy importante que hables con un alergólogo o dermatólogo sobre tus síntomas y posibles tratamientos.`
    } else if (r.q19 === '2') {
      seccion6 = `Consideras que tu tratamiento ha sido medianamente efectivo. ${CIERRE} es importante que hables con un alergólogo o dermatólogo sobre la urticaria crónica y los tratamientos disponibles.`
    } else if (r.q19 === '3') {
      seccion6 = `Consideras que tu tratamiento ha sido muy efectivo. ${CIERRE} te recomendamos que continúes con tu tratamiento de la mano de tu proveedor de salud.`
    }
  }

  return { seccion1, seccion2, seccion3, seccion4, seccion5, seccion6, sPts, cvPts, total }
}

// ---------------------------------------------------------------------------
// MENSAJE DE ESCALACIÓN
// ---------------------------------------------------------------------------
export const ESCALACION = {
  cuando: (r) => r.q17 === '1' && (r.q19 === '0' || r.q19 === '1'),
  enPantalla: 'Has llevado tratamiento y sigues con síntomas persistentes. En tu próxima consulta, pregunta: «¿hay algo más que podamos intentar?».',
  enPdf: 'He llevado tratamiento previo sin control adecuado de mis síntomas. Quisiera valorar opciones avanzadas o tratamientos dirigidos.'
}

export const PREGUNTA_CLAVE = '«¿Hay algo más que podamos intentar?»'

// La pregunta clave solo tiene sentido para quien ya lleva un tratamiento.
export const mostrarPreguntaClave = (r) => r.q17 === '1'

// ============================================================================
// MOTOR DE FLUJO Y RESUMEN
// ============================================================================

const aplicaContexto = (p, ctx) => p.contextos === 'todos' || p.contextos.includes(ctx)

/** Preguntas que le tocan a esta persona en orden */
export function construirFlujo(respuestas, ctx) {
  // Si respondió que no tiene ningún síntoma, detiene el flujo
  if (Array.isArray(respuestas.q1) && respuestas.q1.includes('ninguno')) {
    return ['q0', 'q1']
  }
  return PREGUNTAS
    .filter((p) => aplicaContexto(p, ctx) && (!p.si || p.si(respuestas)))
    .map((p) => p.id)
}

/** ¿Esta respuesta corta a la pantalla de urgencia? */
export function esUrgencia(id, valor) {
  const p = PREGUNTAS.find((x) => x.id === id)
  return Boolean(p?.urgencia?.(valor))
}

/** Lectura y diagnóstico estructurado */
export function leerResultado(respuestas) {
  const rep = generarReporteBen(respuestas)
  return {
    titulo: 'Tu resultado orientativo',
    detalle: rep.seccion1,
    reporte: rep
  }
}

/**
 * Resumen para el médico estructurado con las 6 secciones de Ben
 */
export function construirResumen(respuestas, ctx, questions) {
  const flujo = construirFlujo(respuestas, ctx)

  return PREGUNTAS
    .filter((p) => p.resumen !== false && flujo.includes(p.id) && p.id !== 'q0')
    .map((p) => {
      const definicion = questions[p.id]
      const etiqueta = typeof p.resumen === 'string' ? p.resumen : definicion?.[1] ?? p.id
      const opciones = definicion?.[3] ?? []
      const textoDe = (v) => opciones.find((o) => o[0] === v)?.[1] ?? v

      const respuesta = respuestas[p.id]
      const sinResponder = respuesta == null || (Array.isArray(respuesta) && respuesta.length === 0)

      let valor
      if (sinResponder) valor = 'Sin responder'
      else if (Array.isArray(respuesta)) valor = respuesta.map(textoDe).join(', ')
      else valor = textoDe(respuesta)

      return { etiqueta, valor, sinResponder }
    })
}

