// ============================================================================
// ESTRUCTURA DEL CUESTIONARIO
//
// Este archivo NO contiene textos de cara al usuario: esos viven en campaign.js
// y los mantiene el equipo de contenidos. Aquí solo se declara:
//
//   1. qué pregunta aparece en qué contexto y en qué orden,
//   2. qué llega al resumen del médico y con qué palabras,
//   3. en qué ORDEN se evalúan las lecturas del resultado.
//
// Está escrito como tabla a propósito, para que el equipo médico de Novartis
// pueda revisarlo y reordenarlo sin tocar el resto del código.
// ============================================================================

// ---------------------------------------------------------------------------
// 1. PREGUNTAS
//
// El orden de este arreglo es el orden en que se muestran.
//
//   id         · debe existir en `questions` de campaign.js
//   contextos  · 'todos' o lista: dia, calor, frio, madrugada, noche-calor
//   si         · condición extra para que aparezca (opcional)
//   urgencia   · si la respuesta cumple esto, corta a la pantalla de emergencia
//   resumen    · etiqueta en el resumen del médico.
//                  ausente → usa el texto de la propia pregunta
//                  false   → no aparece en el resumen
//   valores    · reescritura de la respuesta para el médico.
//                  lo que no esté aquí usa el texto que leyó la persona
// ---------------------------------------------------------------------------
export const PREGUNTAS = [
  { id: 'p1', contextos: 'todos', resumen: 'Lo que describe' },

  {
    id: 'p1b',
    contextos: 'todos',
    si: (r) => r.p1 === 'hinchazon',
    urgencia: (v) => v === 'urgente',
    resumen: 'Señales de urgencia'
  },

  {
    id: 'p2',
    contextos: 'todos',
    resumen: 'Comportamiento',
    valores: {
      si: 'Aparecen y desaparecen en <24 h',
      persisten: 'Se quedan días en el mismo sitio'
    }
  },

  { id: 'p3', contextos: 'todos', resumen: 'Tiempo con síntomas' },

  { id: 'n1', contextos: ['madrugada', 'noche-calor'], resumen: 'Inicio del brote' },
  { id: 'n2', contextos: ['madrugada', 'noche-calor'], resumen: 'Noches afectadas' },

  { id: 'c1', contextos: ['calor', 'noche-calor'], resumen: 'Producto nuevo en la piel' },
  { id: 'c2', contextos: ['calor', 'noche-calor'], resumen: 'Relación con calor o sol' },

  { id: 'f1', contextos: ['frio'], resumen: 'Relación con el frío' },
  { id: 'f2', contextos: ['frio'], resumen: 'Piel irritada por el ambiente seco' },

  { id: 'p4', contextos: 'todos', resumen: 'Posible detonante' },

  {
    id: 'p5',
    contextos: 'todos',
    resumen: 'Impacto en vida / sueño',
    vacio: 'No reportó impacto',
    valores: {
      sueno: 'Sueño',
      concentracion: 'Concentración',
      evito_planes: 'Vida social',
      angustia: 'Ánimo / estrés',
      trabajo: 'Trabajo'
    }
  },

  {
    id: 'p6',
    contextos: 'todos',
    resumen: 'Tratamiento previo',
    valores: {
      fallido: 'Tomó antihistamínico y sigue con síntomas',
      funciona: 'Antihistamínico le ayuda'
    }
  }
]

// ---------------------------------------------------------------------------
// 2. LECTURAS DEL RESULTADO
//
// Se evalúan de arriba hacia abajo y GANA LA PRIMERA QUE SE CUMPLA.
// Para cambiar la prioridad clínica, basta con mover una regla de lugar.
//
// `cuando` recibe las respuestas crudas: r.p2, r.p3, r.c1, etc.
//
// PENDIENTE DE REVISIÓN MÉDICA: hoy "reacción a algo nuevo" se evalúa antes que
// "urticaria crónica espontánea". Una persona con ronchas evanescentes de más de
// seis semanas que además identifica un detonante nunca ve la lectura de crónica.
// ---------------------------------------------------------------------------
export const LECTURAS = [
  {
    id: 'no-evanescente',
    cuando: (r) => r.p2 === 'persisten',
    titulo: 'Esto no se comporta como una urticaria típica.',
    detalle: 'Las ronchas que se quedan días en el mismo lugar necesitan una revisión médica. Llévale este resumen para no empezar de cero.'
  },
  {
    id: 'reaccion-a-algo-nuevo',
    cuando: (r) => r.p4 === 'detonante_claro' || r.p4 === 'estreno_nuevo' || r.c1 === 'si',
    titulo: 'Podría ser una reacción a algo nuevo.',
    detalle: 'Cuando hay algo recién estrenado de por medio, coméntalo con tu médico.'
  },
  {
    id: 'detonante-fisico',
    cuando: (r) => (r.c2 === 'si' || r.f1 === 'si') && r.p2 === 'si',
    titulo: 'Se comporta como una urticaria con detonante físico.',
    detalle: 'Tu piel puede reaccionar al frío o calor. Vale la pena que tu médico lo revise.'
  },
  {
    id: 'cronica',
    cuando: (r) => r.p2 === 'si' && r.p3 === 'cronica',
    titulo: 'Lo que describes encaja con urticaria crónica espontánea.',
    detalle: 'No es solo alergia y no es tu culpa. Tiene nombre y hay opciones que puedes conversar con tu médico.'
  },
  {
    id: 'aguda',
    cuando: (r) => r.p2 === 'si' && r.p3 === 'aguda',
    titulo: 'Por ahora parece algo pasajero.',
    detalle: 'Si cruza las 6 semanas y sigue apareciendo, coméntaselo a tu médico.'
  },
  {
    id: 'sin-lectura',
    cuando: () => true,
    titulo: 'Con esto no alcanzo a orientarte del todo.',
    detalle: 'Hay piezas que solo un médico puede juntar. Llévale este resumen para llegar con todo claro.'
  }
]

// ---------------------------------------------------------------------------
// 3. MENSAJE DE ESCALACIÓN
// Aparece cuando la persona ya probó antihistamínicos y sigue con síntomas.
// Es el pilar "Ask for more beyond AH" de la guía global.
// ---------------------------------------------------------------------------
export const ESCALACION = {
  cuando: (r) => r.p6 === 'fallido',
  enPantalla: 'Ya probaste antihistamínicos y sigues con síntomas. En tu próxima consulta, pregunta: «¿hay algo más que podamos intentar?».',
  enPdf: 'Ya probé antihistamínicos y sigo con síntomas. Quiero preguntar si hay algo más que podamos intentar.'
}

export const PREGUNTA_CLAVE = '«¿Hay algo más que podamos intentar?»'

// ============================================================================
// MOTOR
// De aquí para abajo no hay contenido, solo la mecánica que lee lo anterior.
// ============================================================================

const aplicaContexto = (p, ctx) => p.contextos === 'todos' || p.contextos.includes(ctx)

/** Preguntas que le tocan a esta persona, en orden. */
export function construirFlujo(respuestas, ctx) {
  return PREGUNTAS
    .filter((p) => aplicaContexto(p, ctx) && (!p.si || p.si(respuestas)))
    .map((p) => p.id)
}

/** ¿Esta respuesta corta a la pantalla de urgencia? */
export function esUrgencia(id, valor) {
  const p = PREGUNTAS.find((x) => x.id === id)
  return Boolean(p?.urgencia?.(valor))
}

/** Primera lectura que se cumple. */
export function leerResultado(respuestas) {
  return LECTURAS.find((l) => l.cuando(respuestas)) ?? LECTURAS[LECTURAS.length - 1]
}

/**
 * Resumen para el médico, derivado de lo que la persona respondió.
 * Toda pregunta contestada llega aquí salvo que declare `resumen: false`,
 * así ninguna se queda huérfana cuando contenidos agregue o quite preguntas.
 */
export function construirResumen(respuestas, ctx, questions) {
  const flujo = construirFlujo(respuestas, ctx)

  return PREGUNTAS
    .filter((p) => p.resumen !== false && flujo.includes(p.id))
    .map((p) => {
      const definicion = questions[p.id]
      const etiqueta = typeof p.resumen === 'string' ? p.resumen : definicion?.[1] ?? p.id
      const opciones = definicion?.[3] ?? []
      const textoDe = (v) => p.valores?.[v] ?? opciones.find((o) => o[0] === v)?.[1] ?? v

      const respuesta = respuestas[p.id]
      const sinResponder = respuesta == null || (Array.isArray(respuesta) && respuesta.length === 0)

      let valor
      if (sinResponder) valor = Array.isArray(respuesta) ? (p.vacio ?? 'Sin responder') : 'Sin responder'
      else if (Array.isArray(respuesta)) valor = respuesta.map(textoDe).join(', ')
      else valor = textoDe(respuesta)

      return { etiqueta, valor, sinResponder: sinResponder && !(Array.isArray(respuesta) && p.vacio) }
    })
}
