import pageMetadata from './pageMetadata.json'
import { heroVariation } from './heroVariations.js'
import { NOTA_TEST } from './site.js'

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

// Referencias de Inicio (numeración propia de la página).
export const homeSources = [
  { n: 1, short: 'Tbakhi et al. (2025)', text: 'B. Tbakhi, K. Ware, H.-S. Park, J. S. Bernstein, and J. A. Bernstein, &ldquo;An overview of chronic spontaneous urticaria: Diagnosis, management, and treatment,&rdquo; <em>Allergy Asthma Immunol. Res.</em>, vol. 17, no. 5, 2025, doi: 10.4168/aair.2025.17.5.531.', url: 'https://doi.org/10.4168/aair.2025.17.5.531' },
  { n: 2, short: 'MedlinePlus (2025)', text: 'MedlinePlus, &ldquo;Urticaria,&rdquo; U.S. National Library of Medicine (NIH), rev. Apr. 1, 2025.', url: 'https://medlineplus.gov/spanish/ency/article/000845.htm' },
  { n: 3, short: 'Yadav y Bajaj (2009)', text: 'S. Yadav and A. K. Bajaj, &ldquo;Management of difficult urticaria,&rdquo; <em>Indian J. Dermatol.</em>, vol. 54, no. 3, pp. 275&ndash;279, 2009, doi: 10.4103/0019-5154.55641.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2810698/' }
]

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
    intro: variation?.intro || "Vivir con comezón constante, habones (ronchas) e hinchazón (angioedema) inesperada puede sentirse abrumador. En 'Más que Urticaria' te acompañamos para que entiendas tu diagnóstico, encuentres la atención médica adecuada y recuerdes que tu vida es mucho más grande que tus síntomas.",
    primaryCta: 'Hacer Test de Autoevaluación',
    secondaryCta: 'Buscar Especialista',
    note: NOTA_TEST
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
          '“Más que Urticaria” es un sitio informativo sobre urticaria crónica espontánea. Aquí puedes explorar explicaciones en lenguaje claro, registrar lo que observas y preparar preguntas para una consulta.',
          'El contenido del sitio no ofrece diagnóstico ni atención médica. Un profesional de la salud puede valorar tus síntomas y conversar contigo sobre los siguientes pasos.',
        ]
      },
      {
        title: 'Cómo se guía este sitio',
        cardsRow: 4,
        cards: [
          { icon: 'check', title: 'Claro', text: 'Explicamos cada término médico con palabras sencillas.' },
          { icon: 'shield', title: 'Responsable', text: 'Información general, no un diagnóstico.' },
          { icon: 'lock', title: 'Privado', text: 'Tu diario se guarda solo en tu navegador.' },
          { icon: 'visibility', title: 'Transparente', text: 'Te avisamos lo que aún está en preparación.' }
        ]
      },
      {
        title: '¿Qué puedes hacer en el sitio?',
        // Los síntomas se muestran con imagen y su nombre debajo (las imágenes las entrega Novartis); cada uno lleva a Síntomas
        visuals: { route: 'sintomas', items: ['Habones (ronchas)', 'Hinchazón (angioedema)', 'Comezón'] },
        cards: [
          { title: 'Preparar la consulta', text: 'Usa el test de orientación y el Diario de Síntomas para ordenar tus observaciones.', route: 'recursos-herramientas', linkLabel: 'Explorar recursos' },
          { title: 'Encuentra a un especialista cerca de ti', route: 'directorio-medico', linkLabel: 'Ir al directorio médico' }
        ]
      },
      {
        title: 'Preguntas frecuentes sobre el sitio',
        faqs: [
          { question: '¿Más que Urticaria ofrece consultas médicas directas?', answer: 'No. Este es un sitio informativo; no ofrece consultas médicas ni reemplaza la valoración de un profesional de la salud.', cta: { label: 'Encuentra a un especialista cerca de ti', route: 'directorio-medico' } },
          { question: '¿Tiene algún costo acceder a los recursos de la web?', answer: 'Los recursos informativos disponibles en este sitio no requieren registro.', cta: { label: 'Ir a Recursos', route: 'recursos-herramientas' } }
        ]
      }
    ],
    closing: { title: 'Recuerda: tu vida es más que urticaria.', text: 'Explora los recursos disponibles o prepara una conversación con un profesional de la salud.', cta: { label: 'Ir a Recursos', route: 'recursos-herramientas' } }
  },
  sintomas: {
    ...pageMetadata.sintomas,
    eyebrow: 'Reconoce lo que pasa en tu piel',
    title: 'Síntomas de la Urticaria Crónica Espontánea: Reconoce las Ronchas y Recupera el Control',
    intro: 'Vivir con comezón constante, habones (ronchas) e hinchazón (angioedema) inesperada puede ser desgastante. Identificar lo que le pasa a tu piel puede ayudarte a preparar una conversación con un profesional de la salud.',
    ctas: [{ label: 'Comenzar Test de Síntomas', action: 'quiz' }],
    // Referencias de toda la página: numeración continua por orden de aparición.
    // Cada afirmación científica cita su número (refs) y cada sección indica de dónde se adaptó (adaptadoDe).
    sources: [
      { n: 1, short: 'MedlinePlus (2025)', text: 'MedlinePlus, &ldquo;Urticaria,&rdquo; U.S. National Library of Medicine (NIH), rev. Apr. 1, 2025.', url: 'https://medlineplus.gov/spanish/ency/article/000845.htm' },
      { n: 2, short: 'Tbakhi et al. (2025)', text: 'B. Tbakhi, K. Ware, H.-S. Park, J. S. Bernstein, and J. A. Bernstein, &ldquo;An overview of chronic spontaneous urticaria: Diagnosis, management, and treatment,&rdquo; <em>Allergy Asthma Immunol. Res.</em>, vol. 17, no. 5, 2025, doi: 10.4168/aair.2025.17.5.531.', url: 'https://doi.org/10.4168/aair.2025.17.5.531' },
      { n: 3, short: 'Wasim et al. (2025)', text: 'A. U. Wasim, S. A. Miriyala, R. Haward, Z. Hammoud, <em>et al.</em>, &ldquo;Sleep disturbance and chronic urticaria: A narrative review of its relationship, treatment and evolving literature,&rdquo; <em>Health Sci. Rep.</em>, vol. 8, no. 5, p. e70777, 2025, doi: 10.1002/hsr2.70777.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12051439/' },
      { n: 4, short: 'Sachdeva et al. (2011)', text: 'S. Sachdeva, V. Gupta, S. S. Amin, and M. Tahseen, &ldquo;Chronic urticaria,&rdquo; <em>Indian J. Dermatol.</em>, vol. 56, no. 6, pp. 622&ndash;628, 2011, doi: 10.4103/0019-5154.91817.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3276885/' },
      { n: 5, short: 'Hsieh y Lee (2017)', text: 'J. Hsieh and J. K. Lee, &ldquo;Chronic spontaneous urticaria,&rdquo; <em>CMAJ</em>, vol. 189, no. 2, p. E77, 2017, doi: 10.1503/cmaj.150951.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5235931/' },
      { n: 6, short: 'Yadav y Bajaj (2009)', text: 'S. Yadav and A. K. Bajaj, &ldquo;Management of difficult urticaria,&rdquo; <em>Indian J. Dermatol.</em>, vol. 54, no. 3, pp. 275&ndash;279, 2009, doi: 10.4103/0019-5154.55641.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2810698/' }
    ],
    sections: [
      {
        title: '¿Cuáles son los síntomas de la urticaria crónica espontánea?',
        intro: 'La urticaria crónica espontánea se caracteriza por habones (ronchas), comezón, hinchazón (angioedema) o ardor, que reaparecen durante más de seis semanas sin un desencadenante identificable. Solo un profesional de la salud puede diagnosticarla.',
        highlight: 'Clave: los síntomas se repiten durante 6 semanas o más.',
        cards: [
          { title: 'Habones (ronchas)', text: 'Elevaciones rojizas o rosadas en la piel que dan comezón.', image: true },
          { title: 'Hinchazón (angioedema)', text: 'Puede aparecer en cualquier parte del cuerpo, como labios o párpados.', image: true, refs: 1 },
          { title: 'Comezón', text: 'Puede afectar las actividades diarias, el sueño y el trabajo.', image: true, refs: [2, 3] },
          { title: 'Ardor', text: 'Sensación de quemazón en la zona afectada.', image: true }
        ],
        // Corte de la piel con línea de tiempo (reemplaza el párrafo de duración): números de la lista de fuentes
        skinFigure: { sachdeva: 4, hsieh: 5 },
        adaptadoDe: [1, 2, 3, 4, 5]
      },
      {
        title: '¿En qué se diferencia la urticaria crónica espontánea de otros tipos de urticaria?',
        // Comparador interactivo. Las afirmaciones médicas citan la lista de referencias de la página.
        adaptadoDe: [1, 2],
        compare: {
          lead: 'Explora las principales diferencias. Selecciona un tema para comparar.',
          notice: 'Esta información es una orientación general y no sustituye la valoración de un profesional de la salud.',
          types: [
            { key: 'uce', name: 'Urticaria crónica espontánea', highlight: true },
            { key: 'aguda', name: 'Urticaria aguda' },
            { key: 'inducible', name: 'Urticaria inducible' }
          ],
          topics: [
            { icon: 'auto_awesome', label: 'Qué la puede desencadenar', values: {
              uce: { text: 'Aparece sin un desencadenante identificable.', ref: 2 },
              aguda: 'Puede relacionarse con un desencadenante específico.',
              inducible: { text: 'Se provoca por un estímulo físico específico.', ref: 2 } } },
            { icon: 'calendar_month', label: 'Cuánto tiempo dura', values: {
              uce: { text: 'Las ronchas reaparecen durante más de seis semanas.', ref: 1, stat: '6 semanas o más' },
              aguda: { text: 'Los síntomas desaparecen antes de las seis semanas.', ref: 1, stat: 'Menos de 6 semanas' },
              inducible: 'Aparece tras el estímulo y puede variar según la persona.' } },
            { icon: 'stethoscope', label: 'Cómo se evalúa', values: {
              uce: 'Un profesional de la salud determina el diagnóstico y el manejo.',
              aguda: 'La evaluación considera el contexto y los posibles desencadenantes.',
              inducible: 'La evaluación considera el estímulo y los síntomas observados.' } }
          ],
          key: { text: 'La urticaria crónica espontánea aparece sin un desencadenante identificable y dura más de seis semanas.', ref: [1, 2] },
          badges: [
            { icon: 'menu_book', title: 'Información clara', text: 'Con fuentes científicas citadas' },
            { icon: 'forum', title: 'Para una mejor conversación', text: 'Con tu profesional de la salud' }
          ]
        }
      },
      {
        title: 'Guía visual: signos que puedes describir en consulta',
        cards: [
          { title: 'Habones (ronchas)', text: 'Pueden aparecer en distintas partes del cuerpo y variar de tamaño.', refs: 1 },
          { title: 'Hinchazón (angioedema)', text: 'La inflamación puede aparecer en cualquier parte del cuerpo, como labios o párpados. La hinchazón de lengua o garganta o la dificultad para respirar requiere atención urgente.', refs: 1 },
          { title: 'Reacción al roce', text: 'Algunas personas notan ronchas después de rascarse o de la presión sobre la piel.', refs: 1 }
        ],
        adaptadoDe: [1]
      },
      {
        title: 'Preguntas frecuentes sobre los síntomas',
        faqs: [
          { question: '¿Cuánto dura un brote?', answer: 'La duración puede variar. Anota cuánto permanece cada roncha y cuándo aparecen otras.', refs: 1, cta: { label: 'Registrar mis brotes en el diario', route: 'diario' } },
          { question: '¿La urticaria deja cicatrices?', answer: 'Si una lesión persiste, deja marcas o te preocupa, pide una valoración profesional.', refs: 5, cta: { label: 'Encuentra a un especialista cerca de ti', route: 'directorio-medico' } },
          { question: '¿Es contagiosa?', answer: 'La urticaria no se transmite por contacto entre personas.', refs: 6, cta: { label: 'Hacer el test orientativo', action: 'quiz' } }
        ],
        adaptadoDe: [1, 5, 6]
      }
    ],
    closing: { title: 'Lleva un registro para tu próxima consulta', text: 'Anota cuándo aparecen las ronchas, su intensidad y cómo afectan tu día a día.', cta: { label: 'Abrir el Diario de Síntomas', route: 'diario' } }
  },
  tratamiento: {
    ...pageMetadata.tratamiento,
    eyebrow: 'Información para tu próxima consulta',
    title: 'Tratamientos para la Urticaria Crónica Espontánea: Encuentra el Camino hacia el Alivio',
    intro: 'El tratamiento adecuado depende de cada persona y debe definirse con un profesional de la salud. Esta guía reúne preguntas e información para preparar esa conversación.',
    ctas: [{ label: 'Buscar Especialista', route: 'directorio-medico' }],
    sources: [
      { n: 1, short: 'Tbakhi et al. (2025)', text: 'B. Tbakhi, K. Ware, H.-S. Park, J. S. Bernstein, and J. A. Bernstein, &ldquo;An overview of chronic spontaneous urticaria: Diagnosis, management, and treatment,&rdquo; <em>Allergy Asthma Immunol. Res.</em>, vol. 17, no. 5, 2025, doi: 10.4168/aair.2025.17.5.531.', url: 'https://doi.org/10.4168/aair.2025.17.5.531' }
    ],
    sections: [
      {
        title: '¿Cómo se aborda la urticaria crónica?',
        paragraphs: [
          'La urticaria crónica espontánea no es una alergia pasajera. Un profesional puede evaluar los síntomas, el historial y las opciones de manejo adecuadas para cada persona.'
        ]
      },
      {
        title: '¿Qué ocurre durante un brote?',
        layout: 'steps',
        intro: 'El proceso puede incluir distintas respuestas en la piel. Tu equipo de salud puede explicarte cómo se relaciona con tus síntomas y tu tratamiento.',
        list: [
          { text: 'Algunas células de la piel, como los mastocitos, participan en la respuesta inflamatoria.', refs: 1 },
          { text: 'En esa respuesta pueden liberarse histamina y otras sustancias.', refs: 1 },
          { text: 'Estas respuestas pueden relacionarse con habones (ronchas), hinchazón (angioedema) y comezón.', refs: 1 },
          'El profesional de la salud determina qué tratamiento puede ser apropiado.'
        ],
        adaptadoDe: [1]
      },
      {
        title: '¿Con qué especialista puedo hablar?',
        intro: 'Un alergólogo o dermatólogo certificado puede valorar tus síntomas y orientarte sobre los siguientes pasos.',
        cards: [
          { title: 'Encuentra a un especialista cerca de ti', text: 'Busca alergólogos y dermatólogos certificados en tu localidad.', route: 'directorio-medico', linkLabel: 'Ir al directorio médico' }
        ]
      },
      {
        title: 'Preguntas frecuentes sobre tratamiento',
        faqs: [
          { question: '¿Puedo cambiar o suspender mi tratamiento?', answer: 'No lo cambies ni lo suspendas por tu cuenta: consúltalo con el alergólogo o dermatólogo que te lo indicó.', cta: { label: 'Encuentra a un especialista cerca de ti', route: 'directorio-medico' } }
        ]
      }
    ],
    closing: { title: 'Da el siguiente paso con acompañamiento médico', cta: { label: 'Buscar Especialista', route: 'directorio-medico' } }
  },
  testimonios: {
    ...pageMetadata.testimonios,
    eyebrow: 'Experiencias para compartir',
    title: 'Historias sobre urticaria crónica espontánea',
    intro: 'Aquí reuniremos experiencias compartidas de forma anónima. Los siguientes relatos de muestra ilustran cómo podría verse esta sección.',
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
        paragraphs: ['Todas las historias son 100 % anónimas: no se publican nombres, edades ni ciudades. Cada experiencia es personal y no sustituye la orientación de un profesional de la salud.']
      },
      {
        title: 'Preguntas frecuentes sobre las historias',
        faqs: [
          { question: '¿Puedo compartir mi testimonio de forma anónima?', answer: 'Sí. Todas las historias se publican de forma anónima, sin nombre, edad ni ciudad.' },
          { question: '¿Cómo puedo ponerme en contacto con un especialista?', answer: 'Puedes acceder directamente a nuestro Directorio Médico para ubicar dermatólogos y alergólogos certificados cerca de tu localidad.', cta: { label: 'Ir al directorio médico', route: 'directorio-medico' } }
        ]
      }
    ],
    closing: { title: 'Mientras tanto, consulta los recursos disponibles', text: 'Explora herramientas para reconocer y registrar tus síntomas.', cta: { label: 'Ir a Recursos', route: 'recursos-herramientas' } }
  },
  diario: {
    ...pageMetadata.diario,
    eyebrow: 'Una herramienta para preparar tu consulta',
    title: 'Diario de Síntomas: Registra tus Ronchas y Toma el Control',
    intro: 'Llevar un registro de tus síntomas puede ayudarte a comunicarte con un profesional de la salud. Usa esta hoja de trabajo en tu navegador o imprímela para llevarla a tu consulta.',
    ctas: [{ label: 'Usar el diario', href: '#registro' }, { label: 'Imprimir o guardar como PDF', action: 'print' }],
    sections: [
      {
        title: '¿Qué es el Diario de Síntomas y cómo te ayuda?',
        paragraphs: [
          'El Diario de Síntomas es una bitácora para anotar la intensidad de las ronchas, el nivel de comezón y cómo afectan tu descanso.',
          'Llevar tus notas a la cita puede ayudarte a describir lo que has observado. El registro no diagnostica ni recomienda cambios de tratamiento.'
        ]
      },
      {
        title: '¿Cómo evaluar tus síntomas día a día?',
        layout: 'steps',
        intro: 'Registra tus observaciones en una escala sencilla de 0 a 3. Usa los campos como notas y conversa con tu profesional sobre cómo interpretar la información.',
        cards: [
          { title: '1. Habones (ronchas)', text: 'Anota si no observaste ronchas, si fueron pocas, moderadas o numerosas, usando la escala de 0 a 3.' },
          { title: '2. Comezón', text: 'Registra la intensidad y si interfirió con el sueño o las actividades.' },
          { title: '3. Revisa tus notas', text: 'Lleva el registro a tu consulta para comentarlo con tu profesional de la salud.' }
        ]
      },
      {
        title: 'Preguntas frecuentes sobre el Diario',
        faqs: [
          { question: '¿El diario guarda mis datos?', answer: 'Tus registros son anónimos y se guardan únicamente en el almacenamiento local de tu navegador. No se envían a ningún servidor ni se crea una cuenta. Puedes borrarlos cuando quieras con el botón “Borrar este registro”.' },
          { question: '¿Con qué frecuencia debo llenarlo?', answer: 'Puedes registrar tus observaciones a diario durante los días previos a tu consulta. Confirma con tu profesional qué registro es adecuado para ti.' },
          { question: '¿Puedo usar la versión impresa?', answer: 'Sí. Usa el botón “Imprimir o guardar como PDF” para imprimir la hoja o guardarla como PDF desde el diálogo del navegador.' }
        ]
      }
    ],
    diaryTool: true,
    diaryRef: 1,
    // Referencias de la página (numeración propia), estilo IEEE
    sources: [
      { n: 1, short: 'Bernstein et al. (2023)', text: 'J. A. Bernstein, A. Gim&eacute;nez-Arnau, M. Maurer, <em>et al.</em>, &ldquo;Why a complete response is the treatment aim in chronic spontaneous urticaria,&rdquo; <em>J. Clin. Med.</em>, vol. 12, no. 10, Art. no. 3561, 2023, doi: 10.3390/jcm12103561.', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10219198/' }
    ],
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
          { title: 'Mitos comunes sobre las dietas restrictivas en urticaria crónica espontánea', text: 'Un tema para aclarar dudas sobre alimentación y urticaria crónica.' }
        ],
        notice: 'Los artículos completos se publicarán cuando su contenido haya pasado por revisión editorial y médica.'
      }
    ],
    closing: { title: '¿Quieres ordenar tus dudas?', text: 'Usa el test orientativo para preparar una conversación con un profesional.', cta: { label: 'Ir al Test', route: 'test' } }
  },
  'directorio-medico': {
    ...pageMetadata['directorio-medico'],
    eyebrow: 'Directorio médico',
    title: 'Directorio de alergólogos y dermatólogos',
    intro: 'No existen especialistas exclusivos en urticaria crónica espontánea: la valoración corresponde a alergólogos o dermatólogos certificados. Encuéntralos cerca de ti para conversar sobre tus síntomas y los siguientes pasos.',
    directoryTool: true,
    sections: [
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
  { slug: 'dietas-restrictivas-uce', title: 'Mitos comunes sobre las dietas restrictivas en urticaria crónica espontánea', text: 'Descubre por qué suspender alimentos sin diagnóstico alérgico no frena la urticaria crónica.' }
]
