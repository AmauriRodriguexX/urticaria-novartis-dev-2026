import pageMetadata from './pageMetadata.json'
import { heroVariation } from './heroVariations.js'

const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`

// Parámetros de las ligas de prueba (escenario, hora, ciudad, clima) que se conservan al navegar entre páginas.
const TEST_PARAMS = ['vista', 'hora', 'ciudad', 'city', 'temp', 'temperatura']
const testQuery = (() => {
  if (typeof window === 'undefined') return ''
  const current = new URLSearchParams(window.location.search)
  const kept = new URLSearchParams()
  for (const key of TEST_PARAMS) if (current.has(key)) kept.set(key, current.get(key))
  const query = kept.toString()
  return query ? `?${query}` : ''
})()

export function routeHref(slug = '') {
  const clean = String(slug).replace(/^\/+|\/+$/g, '')
  return `${BASE}${clean ? `${clean}/` : ''}${testQuery}`
}

export function routeFromPath(pathname = window.location.pathname) {
  const base = BASE.replace(/\/$/, '')
  const path = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname
  return path.replace(/^\/+|\/+$/g, '')
}

export const navigation = [
  { label: 'Inicio', slug: '' },
  { label: 'Recursos', slug: 'recursos-herramientas' },
  { label: 'Síntomas', slug: 'sintomas' },
  { label: 'Tratamientos', slug: 'tratamiento' },
  { label: 'Directorio', slug: 'directorio-medico' },
  { label: 'Testimonios', slug: 'testimonios' },
  { label: 'Blog', slug: 'blog' },
  { label: 'Acerca de', slug: 'sobre-nosotros' }
]

export function homeCopyFor(ctx, now, city, temp) {
  const variation = heroVariation('', ctx, now, temp, city)
  return {
    kicker: 'Más que Urticaria',
    title: variation?.title || 'Urticaria Crónica Espontánea: Haz de la Urticaria la Parte Más Pequeña de tu Vida',
    intro: variation?.intro || "Vivir con picazón constante, habones e hinchazón inesperada puede sentirse abrumador. En 'Más que Urticaria' te acompañamos para que entiendas tu diagnóstico, encuentres la atención médica adecuada y recuerdes que tu vida es mucho más grande que tus síntomas.",
    primaryCta: 'Hacer Test de Autoevaluación',
    secondaryCta: 'Buscar Especialista',
    note: ''
  }
}

export const landingPages = {
  'sobre-nosotros': {
    ...pageMetadata['sobre-nosotros'],
    eyebrow: 'Más que Urticaria',
    title: 'Sobre Nosotros: Más que Urticaria',
    intro: 'Más que Urticaria reúne información y herramientas para ayudar a las personas a entender la urticaria crónica y preparar una conversación con un profesional de la salud.',
    ctas: [{ label: 'Conoce el sitio', href: '#causa' }],
    sections: [
      {
        id: 'causa', title: '¿Quiénes somos?',
        paragraphs: [
          '“Más que Urticaria” es un sitio informativo sobre urticaria crónica espontánea (UCE). Aquí puedes explorar explicaciones en lenguaje claro, registrar lo que observas y preparar preguntas para una consulta.',
          'El contenido del sitio no ofrece diagnóstico ni atención médica. Un profesional de la salud puede valorar tus síntomas y conversar contigo sobre los siguientes pasos.',
          'Este sitio es desarrollado con el patrocinio de Novartis.'
        ]
      },
      {
        title: 'Cómo se guía este sitio',
        cards: [
          { title: 'Claridad', text: 'Explicar términos y recursos con palabras sencillas, sin asumir que quien llega conoce el tema.' },
          { title: 'Orientación', text: 'Ayudar a organizar observaciones y preguntas para conversar con un profesional de la salud.' }
        ],
        listTitle: 'Principios de contenido',
        list: [
          'Lenguaje accesible: explicar las siglas y los términos médicos cuando aparecen.',
          'Uso responsable: distinguir información general de una valoración o recomendación médica.',
          'Privacidad: explicar cómo funcionan las herramientas y qué ocurre con la información que escribes.',
          'Transparencia: identificar los temas que todavía están en preparación.'
        ]
      },
      {
        title: '¿Qué puedes hacer en el sitio?',
        intro: 'Explora las herramientas y secciones disponibles para conocer más y preparar una consulta:',
        cards: [
          { title: 'Entender los síntomas', text: 'Consulta información general sobre ronchas, comezón e hinchazón.' , route: 'sintomas', linkLabel: 'Ver síntomas' },
          { title: 'Preparar la consulta', text: 'Usa el test de orientación y el Diario de Síntomas para ordenar tus observaciones.', route: 'recursos-herramientas', linkLabel: 'Explorar recursos' },
          { title: 'Conocer opciones generales', text: 'Lee información para conversar con un profesional sobre el tratamiento.', route: 'tratamiento', linkLabel: 'Ver tratamientos' }
        ]
      },
      {
        title: 'Preguntas frecuentes sobre el sitio',
        faqs: [
          { question: '¿Más que Urticaria ofrece consultas médicas directas?', answer: 'No. Este es un sitio informativo; no ofrece consultas médicas ni reemplaza la valoración de un profesional de la salud.' },
          { question: '¿Tiene algún costo acceder a los recursos de la web?', answer: 'Los recursos informativos disponibles en este sitio no requieren registro.' }
        ]
      }
    ],
    closing: { title: 'Recuerda: tu vida es más que urticaria.', text: 'Explora los recursos disponibles o prepara una conversación con un profesional de la salud.', cta: { label: 'Ir a Recursos', route: 'recursos-herramientas' } }
  },
  sintomas: {
    ...pageMetadata.sintomas,
    eyebrow: 'Reconoce lo que pasa en tu piel',
    title: 'Síntomas de la Urticaria Crónica Espontánea: Reconoce los Brotes y Recupera el Control',
    intro: 'Vivir con comezón constante, habones e hinchazón inesperada puede ser desgastante. Identificar lo que le pasa a tu piel puede ayudarte a preparar una conversación con un profesional de la salud.',
    ctas: [{ label: 'Comenzar Test de Síntomas', action: 'quiz' }],
    sections: [
      {
        title: '¿Cuáles son los síntomas principales de la urticaria crónica?',
        intro: 'La Urticaria Crónica Espontánea (UCE) puede manifestarse con lesiones cutáneas recurrentes durante más de seis semanas. Un profesional de la salud puede valorar tus síntomas.',
        cards: [
          { title: 'Habones o ronchas', text: 'Elevaciones en la piel, a menudo rojizas o rosadas, que pueden provocar comezón.' },
          { title: 'Comezón o picazón', text: 'Una sensación de prurito que puede interferir con el descanso y las actividades.' },
          { title: 'Ardor o molestia local', text: 'Sensación de quemazón, calor o dolor en las zonas afectadas.' },
          { title: 'Lesiones cambiantes', text: 'Los habones individuales suelen desaparecer en menos de 24 horas; pueden aparecer otros en diferentes zonas.' }
        ]
      },
      {
        title: '¿En qué se diferencia la UCE de otros tipos de urticaria?',
        intro: 'Los síntomas pueden tener distintas causas. Esta tabla es una orientación general y no permite identificar por sí sola qué tipo tienes.',
        table: {
          headers: ['Criterio', 'Urticaria crónica espontánea', 'Urticaria aguda', 'Urticaria inducible'],
          rows: [
            ['Detonante', 'Puede aparecer sin un estímulo externo identificable.', 'Puede relacionarse con un desencadenante específico.', 'Puede asociarse con estímulos como frío, calor, fricción o presión.'],
            ['Duración', 'Se presenta durante más de seis semanas, con brotes recurrentes.', 'Suele durar menos de seis semanas.', 'Puede aparecer tras el estímulo y variar según la persona.'],
            ['Evaluación', 'Un profesional determina el diagnóstico y el manejo.', 'La evaluación considera el contexto y los posibles desencadenantes.', 'La evaluación considera el estímulo y los síntomas observados.']
          ]
        }
      },
      {
        title: 'Guía visual: signos que puedes describir en consulta',
        cards: [
          { title: 'Habones y ronchas', text: 'Pueden aparecer en distintas partes del cuerpo y variar de tamaño.' },
          { title: 'Angioedema o hinchazón', text: 'La inflamación puede afectar zonas como párpados, labios, manos o pies. La hinchazón de lengua o garganta o la dificultad para respirar requiere atención urgente.' },
          { title: 'Reacción al roce', text: 'Algunas personas notan ronchas después de rascarse o de la presión sobre la piel.' }
        ]
      },
      {
        title: 'Síntomas en distintas etapas y perfiles',
        cards: [
          { title: 'Mujeres', text: 'Los cambios y experiencias pueden variar entre personas. Anota cualquier patrón que quieras conversar con un profesional.' },
          { title: 'Niños', text: 'Si los brotes persisten o te preocupan, consulta con un profesional de la salud que pueda valorar al menor.' },
          { title: 'Hombres', text: 'Registra si notas cambios relacionados con tus actividades, ropa, presión o rutina para comentarlos en consulta.' }
        ]
      },
      {
        title: 'Preguntas frecuentes sobre los síntomas',
        faqs: [
          { question: '¿Por qué la comezón empeora por la noche?', answer: 'La experiencia varía entre personas. Registra cuándo aparece y cómo afecta tu descanso para comentarlo con un profesional.' },
          { question: '¿El estrés puede causar los brotes?', answer: 'El estrés puede coincidir con cambios en los síntomas, pero no permite establecer por sí solo la causa. Coméntalo con un profesional.' },
          { question: '¿Cuánto dura un brote?', answer: 'La duración puede variar. Anota cuánto permanece cada roncha y cuándo aparecen otras.' },
          { question: '¿La urticaria deja cicatrices?', answer: 'Si una lesión persiste, deja marcas o te preocupa, pide una valoración profesional.' },
          { question: '¿Es contagiosa?', answer: 'La urticaria no se transmite por contacto entre personas.' }
        ]
      }
    ],
    closing: { title: 'Lleva un registro para tu próxima consulta', text: 'Anota cuándo aparecen los brotes, su intensidad y cómo afectan tu día a día.', cta: { label: 'Abrir el Diario de Síntomas', route: 'diario' } }
  },
  tratamiento: {
    ...pageMetadata.tratamiento,
    eyebrow: 'Información para tu próxima consulta',
    title: 'Tratamientos para la Urticaria Crónica Espontánea: Encuentra el Camino hacia el Alivio',
    intro: 'El tratamiento adecuado depende de cada persona y debe definirse con un profesional de la salud. Esta guía reúne preguntas e información para preparar esa conversación.',
    ctas: [{ label: 'Buscar Especialista', route: 'directorio-medico' }],
    sections: [
      {
        title: '¿Cómo se aborda la urticaria crónica?',
        paragraphs: [
          'La urticaria crónica espontánea no es necesariamente una alergia pasajera. Un profesional puede evaluar los síntomas, el historial y las opciones de manejo adecuadas para cada persona.',
          'El objetivo del tratamiento es controlar los síntomas y ayudar a recuperar el descanso y las actividades cotidianas. No empieces, cambies ni suspendas medicamentos sin hablar con tu médico.'
        ]
      },
      {
        title: '¿Qué ocurre durante un brote?',
        layout: 'steps',
        intro: 'El proceso puede incluir distintas respuestas en la piel. Tu equipo de salud puede explicarte cómo se relaciona con tus síntomas y tu tratamiento.',
        list: [
          'Algunas células de la piel, como los mastocitos, participan en la respuesta inflamatoria.',
          'En esa respuesta pueden liberarse histamina y otras sustancias.',
          'Estas respuestas pueden relacionarse con habones, hinchazón y comezón.',
          'El profesional de la salud determina qué tratamiento puede ser apropiado.'
        ]
      },
      {
        title: 'Opciones de medicamento: información general',
        cards: [
          { title: 'Antihistamínicos', text: 'Se utilizan en el manejo de la urticaria. El profesional puede indicar cuál usar y cómo tomarlo según tu caso.' },
          { title: 'Corticoides', text: 'Su uso y duración requieren indicación médica. Pregunta por los beneficios y riesgos en tu situación.' },
          { title: 'Otras opciones', text: 'Si los síntomas persisten, el especialista puede valorar otras alternativas de tratamiento.' },
          { title: 'Terapias dirigidas', text: 'Existen opciones que el especialista puede considerar según la respuesta a tratamientos previos y tu historial.' }
        ]
      },
      {
        title: 'Medidas cotidianas y remedios: qué conversar',
        intro: 'Antes de probar remedios o hacer cambios importantes en tu rutina o alimentación, consulta con un profesional.',
        table: {
          headers: ['Opción', 'Qué considerar'],
          rows: [
            ['Compresas frías o baños tibios', 'Pueden resultar reconfortantes para algunas personas. Evita temperaturas que te irriten y consulta si tienes dudas.'],
            ['Ropa holgada', 'Puede reducir el roce o la presión sobre la piel.'],
            ['Medicamentos sin receta o cremas', 'Consulta si son apropiados para ti y cómo usarlos.'],
            ['Remedios tópicos caseros', 'Consulta antes de aplicarlos; algunos productos pueden irritar la piel.'],
            ['Dietas restrictivas', 'No elimines grupos de alimentos sin una recomendación profesional.']
          ]
        }
      },
      {
        title: '¿Con qué especialista puedo hablar?',
        intro: 'Un dermatólogo o alergólogo puede valorar tus síntomas y orientarte sobre los siguientes pasos.',
        cards: [
          { title: 'Dermatología', text: 'Especialidad enfocada en la piel. Puede evaluar las lesiones y otras condiciones cutáneas.' },
          { title: 'Alergología e inmunología', text: 'Especialidades que pueden valorar respuestas alérgicas e inmunitarias cuando resulte pertinente.' }
        ]
      },
      {
        title: 'Preguntas frecuentes sobre tratamiento',
        faqs: [
          { question: '¿Puedo tomar antihistamínicos sin consultar?', answer: 'Pregunta a un profesional o farmacéutico si son apropiados para ti, especialmente si tienes otras condiciones o tomas otros medicamentos.' },
          { question: '¿Cuánto tiempo debo tomar el medicamento?', answer: 'Sigue las indicaciones de quien te lo prescribió y consulta antes de cambiar o suspender el tratamiento.' },
          { question: '¿Por qué debo conversar sobre los corticoides?', answer: 'El uso, duración y posibles riesgos dependen de cada persona. Pide a tu médico que te explique el plan indicado para ti.' }
        ]
      }
    ],
    closing: { title: 'Da el siguiente paso con acompañamiento médico', text: 'Prepara tus preguntas y conversa con un profesional de la salud sobre las opciones para ti.', cta: { label: 'Buscar Especialista', route: 'directorio-medico' } }
  },
  testimonios: {
    ...pageMetadata.testimonios,
    eyebrow: 'Experiencias para compartir',
    title: 'Historias sobre urticaria crónica espontánea',
    intro: 'Aquí reuniremos experiencias compartidas con autorización. Los siguientes relatos de muestra ilustran cómo podría verse esta sección.',
    ctas: [{ label: 'Conoce nuestros recursos', route: 'recursos-herramientas' }],
    sections: [
      {
        title: 'Así se verá un relato',
        intro: 'Ejemplos de los temas y el formato que podrían tener las historias compartidas en este espacio.',
        cards: [
          { title: 'Lo que observo', sampleQuote: '“Quiero contar cuándo aparecen las molestias y qué cambios noto durante el día.”' },
          { title: 'Cómo lo converso', sampleQuote: '“Estoy preparando algunas notas para explicar en consulta cómo me siento.”' },
          { title: 'Lo que quiero preguntar', sampleQuote: '“Anoté mis dudas para hablar sobre ellas con un profesional de la salud.”' }
        ]
      },
      {
        title: 'Un espacio para historias autorizadas',
        paragraphs: ['Las historias reales se publicarán únicamente con autorización de las personas participantes y cuidando su privacidad. Cada experiencia es personal y no sustituye la orientación de un profesional de la salud.']
      },
      {
        title: 'Preguntas frecuentes sobre las historias',
        faqs: [
          { question: '¿Puedo compartir mi testimonio de forma anónima?', answer: 'Sí. Sabemos que la salud cutánea es un tema muy personal. Si deseas compartir tu historia para inspirar a otros pero prefieres resguardar tu identidad, podemos usar un seudónimo.' },
          { question: '¿Cómo puedo ponerme en contacto con un especialista?', answer: 'Puedes acceder directamente a nuestro Directorio Médico para ubicar dermatólogos y alergólogos certificados cerca de tu localidad.' }
        ]
      }
    ],
    closing: { title: 'Mientras tanto, consulta los recursos disponibles', text: 'Explora herramientas para reconocer y registrar tus síntomas.', cta: { label: 'Ir a Recursos', route: 'recursos-herramientas' } }
  },
  diario: {
    ...pageMetadata.diario,
    eyebrow: 'Una herramienta para preparar tu consulta',
    title: 'Diario de Síntomas: Registra tus Brotes y Toma el Control',
    intro: 'Llevar un registro de tus síntomas puede ayudarte a comunicarte con un profesional de la salud. Usa esta hoja de trabajo en tu navegador o imprímela para llevarla a tu consulta.',
    ctas: [{ label: 'Usar el diario', href: '#registro' }, { label: 'Imprimir o guardar como PDF', action: 'print' }],
    sections: [
      {
        title: '¿Qué es el Diario de Síntomas y cómo te ayuda?',
        paragraphs: [
          'El Diario de Síntomas es una bitácora para anotar la intensidad de las ronchas, el nivel de picazón y cómo afectan tu descanso.',
          'Llevar tus notas a la cita puede ayudarte a describir lo que has observado. El registro no diagnostica ni recomienda cambios de tratamiento.'
        ]
      },
      {
        title: '¿Cómo evaluar tus síntomas día a día?',
        layout: 'steps',
        intro: 'Registra tus observaciones en una escala sencilla de 0 a 3. Usa los campos como notas y conversa con tu profesional sobre cómo interpretar la información.',
        cards: [
          { title: '1. Habones o ronchas', text: 'Anota si no observaste ronchas, si fueron pocas, moderadas o numerosas, usando la escala de 0 a 3.' },
          { title: '2. Picazón', text: 'Registra la intensidad y si interfirió con el sueño o las actividades.' },
          { title: '3. Revisa tus notas', text: 'Lleva el registro a tu consulta para comentarlo con tu profesional de la salud.' }
        ]
      },
      {
        title: 'Preguntas frecuentes sobre el Diario',
        faqs: [
          { question: '¿El diario guarda mis datos?', answer: 'Esta versión no crea una cuenta ni envía ni guarda tus respuestas. Los datos permanecen en la página abierta y se borran al recargarla o cerrarla.' },
          { question: '¿Con qué frecuencia debo llenarlo?', answer: 'Puedes registrar tus observaciones a diario durante los días previos a tu consulta. Confirma con tu profesional qué registro es adecuado para ti.' },
          { question: '¿Puedo usar la versión impresa?', answer: 'Sí. Usa el botón “Imprimir o guardar como PDF” para imprimir la hoja o guardarla como PDF desde el diálogo del navegador.' }
        ]
      }
    ],
    diaryTool: true,
    closing: { title: '¿Listo para tu próxima consulta?', text: 'Lleva tus observaciones y preguntas para conversar con un profesional de la salud.', cta: { label: 'Buscar Especialista', route: 'directorio-medico' } }
  },
  test: {
    ...pageMetadata.test,
    eyebrow: 'Una guía orientativa',
    title: 'Test orientativo sobre urticaria crónica espontánea',
    intro: 'Responde unas preguntas para ordenar lo que has observado y preparar una conversación con un profesional de la salud.',
    ctas: [{ label: 'Iniciar Test de Síntomas', action: 'quiz' }],
    sections: [
      {
        title: 'Antes de comenzar',
        list: ['Toma menos de 5 minutos.', 'No requiere registro previo.', 'Tus respuestas no sustituyen una evaluación médica.'],
        notice: 'Este test es una herramienta de orientación informativa y educativa. No constituye un diagnóstico médico ni sustituye la consulta con un dermatólogo, alergólogo u otro profesional de la salud.'
      },
      {
        title: '¿Qué pasa después?',
        paragraphs: ['Al terminar, podrás revisar un resumen de tus respuestas y preparar preguntas para tu próxima consulta. Si sientes dificultad para respirar o hinchazón en lengua o garganta, busca atención de urgencia.']
      }
    ]
  },
  blog: {
    ...pageMetadata.blog,
    eyebrow: 'Información para seguir aprendiendo',
    title: 'Temas sobre urticaria crónica espontánea',
    intro: 'Estamos preparando artículos informativos sobre urticaria crónica espontánea. Estos son algunos de los temas propuestos; todavía no son artículos publicados.',
    sections: [
      {
        title: 'Temas propuestos',
        cards: [
          { title: '¿La urticaria empeora con el estrés?', text: 'Un tema para explorar cómo las emociones y los síntomas pueden relacionarse.' },
          { title: 'Guía para preparar tu consulta con dermatología', text: 'Preguntas y datos que puedes llevar a una cita médica.' },
          { title: 'Mitos comunes sobre las dietas restrictivas en UCE', text: 'Un tema para aclarar dudas sobre alimentación y urticaria crónica.' }
        ],
        notice: 'Los artículos completos se publicarán cuando su contenido haya pasado por revisión editorial y médica.'
      }
    ],
    closing: { title: '¿Quieres ordenar tus dudas?', text: 'Usa el test orientativo para preparar una conversación con un profesional.', cta: { label: 'Ir al Test', route: 'test' } }
  },
  'directorio-medico': {
    ...pageMetadata['directorio-medico'],
    eyebrow: 'Directorio médico',
    title: 'Médicos especialistas en urticaria crónica espontánea',
    intro: 'Encuentra dermatólogos, alergólogos e inmunólogos cerca de ti. Un médico especialista en urticaria puede valorar tus síntomas y conversar contigo sobre los siguientes pasos.',
    directoryTool: true,
    sections: [
      {
        title: '¿Qué especialista en urticaria crónica puedo consultar?',
        cards: [
          { title: 'Dermatología', text: 'El directorio de dermatólogos reúne especialistas en la piel que pueden valorar ronchas, habones y comezón persistente.' },
          { title: 'Alergología', text: 'Un alergólogo especialista en urticaria puede ayudarte a distinguir entre una reacción alérgica y una urticaria crónica.' },
          { title: 'Inmunología clínica', text: 'Valora cómo responde el sistema inmunitario cuando los brotes se repiten durante más de seis semanas.' }
        ]
      },
      {
        title: 'Cómo usar el directorio de médicos y clínicas',
        list: [
          'Filtra por especialidad o escribe tu código postal para ver médicos y clínicas cercanas.',
          'Usa tu ubicación para ordenar la lista por distancia.',
          'Lleva a la consulta tu resumen del test o tu Diario de Síntomas.'
        ],
        notice: 'Este directorio es informativo. La elección del especialista y cualquier tratamiento se definen en consulta con un profesional de la salud.'
      }
    ],
    closing: { title: 'Prepara tu consulta', text: 'Ordena lo que has observado antes de hablar con un especialista.', cta: { label: 'Ir al Test de Síntomas', route: 'test' } }
  },
  'recursos-herramientas': {
    ...pageMetadata['recursos-herramientas'],
    eyebrow: 'Recursos y herramientas',
    title: 'Recursos para entender y registrar tus síntomas',
    intro: 'Explora recursos informativos para preparar una conversación con un profesional de la salud.',
    sections: [
      {
        title: '¿Por dónde quieres empezar?', layout: 'featured',
        cards: [
          { title: 'Test de orientación', text: 'Ordena lo que has observado y prepara preguntas para tu consulta.', route: 'test', linkLabel: 'Conocer el test' },
          { title: 'Diario de Síntomas', text: 'Registra tus observaciones y llévalas a una consulta.', route: 'diario', linkLabel: 'Abrir el diario' },
          { title: 'Biblioteca visual', text: 'Explora imágenes educativas por tono de piel y prepara preguntas para un profesional.', anchor: '#biblioteca', linkLabel: 'Ver la biblioteca' }
        ]
      }
    ]
  }
}

export const homeArticles = [
  { slug: 'estres-y-observaciones', title: '¿La urticaria empeora con el estrés?', text: 'Analizamos cómo las emociones influyen en los brotes y qué estrategias de alivio puedes aplicar.' },
  { slug: 'preparar-consulta', title: 'Guía para preparar tu consulta con el dermatólogo', text: 'Qué preguntas hacer y qué datos llevar para aprovechar al máximo tu cita médica.' },
  { slug: 'dietas-restrictivas-uce', title: 'Mitos comunes sobre las dietas restrictivas en UCE', text: 'Descubre por qué suspender alimentos sin diagnóstico alérgico no frena la urticaria crónica.' }
]
