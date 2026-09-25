// Variaciones del hero por momento del día y clima (Excel "Estructura, KWs y copy", columnas F–P).
// Erratas del Excel corregidas aquí: "epsecialista", "tratamieentos", "si tus síntomas te acercará", doble espacio.
import { getSimulatedDate, isNight } from './context.js'

// Umbrales de temperatura (°C). De noche el calor se siente antes.
const HOT_DAY = 27
const HOT_NIGHT = 24
const COLD = 15

// Columnas "Calor y lugar" / "Frío y lugar" ([LUGAR] = ciudad). Pendiente definir cuándo se usan.
export const LUGAR_SLOTS = ['calor-lugar', 'frio-lugar']

const variations = {
  '': {
    manana: {
      title: 'Empieza tu Día Libre de Comezón: Haz de la Urticaria la Parte Más Pequeña de tu Vida',
      intro: 'Comenzar la mañana con ronchas o picazón altera todo tu día. Encuentra hoy la orientación médica que necesitas para recuperar tus mañanas y hacer de la urticaria algo insignificante.'
    },
    'manana-calor': {
      title: 'Afronta el Calor de la Mañana Sin Ronchas: Haz de la Urticaria la Parte Más Pequeña de tu Vida',
      intro: 'Si las altas temperaturas matutinas ya están detonando ardor o molestia en tu piel, no lo dejes pasar. Obtén las herramientas e información médica para tomar el control desde temprano.'
    },
    'manana-frio': {
      title: '¿Mañanas Frías y Piel Sensible? Haz de la Urticaria la Parte Más Pequeña de tu Vida',
      intro: 'Despertar con la piel resentida por las bajas temperaturas es agotador. Te orientamos para identificar si tus brotes matutinos son Urticaria Crónica y cómo tratarlos.'
    },
    tarde: {
      title: 'Recupera tu Tarde y para la Picazón: Haz de la Urticaria la Parte Más Pequeña de tu Vida',
      intro: 'Si la comezón acumulada a mitad del día interfiere con tu trabajo o rutina diaria, estamos aquí para ayudarte a encontrar el tratamiento adecuado que te devuelva la tranquilidad.'
    },
    'tarde-calor': {
      title: 'Que el Calor de la Tarde No Detenga tu Día: Haz de la Urticaria la Parte Más Pequeña de tu Vida',
      intro: 'El calor sofocante de la tarde suele empeorar la hinchazón y las ronchas. Aprende a gestionar tus síntomas e identifica al especialista ideal para ti.'
    },
    'tarde-frio': {
      title: 'Protégete del Frío de la Tarde: Haz de la Urticaria la Parte Más Pequeña de tu Vida',
      intro: 'Cuando baja la temperatura por la tarde, la piel sensible puede reaccionar con mayor ardor. Descubre opciones de tratamiento médico aprobadas para mantener tu piel bajo control.'
    },
    noche: {
      title: '¿La Picazón No Te Deja Dormir? Haz de la Urticaria la Parte Más Pequeña de tu Vida',
      intro: 'La picazón nocturna que no te deja dormir desgasta tu energía y bienestar. Descubre cómo controlar la liberación de histamina por la noche y vuelve a descansar plenamente.'
    },
    'noche-calor': {
      title: '¿El calor de la noche y la comezón no te dejan dormir? Haz de las Ronchas la Parte Más Pequeña de tu Vida',
      intro: 'Las noches calurosas pueden hacer que las ronchas intensifiquen la molestia al intentar dormir. Te guiamos hacia el tratamiento especializado para recuperar el sueño.'
    },
    'noche-frio': {
      title: 'Noches Frías y Picazón Cutánea: Haz de la Urticaria la Parte Más Pequeña de tu Vida',
      intro: 'Las bajas temperaturas nocturnas pueden aumentar la sensibilidad en tu piel y desencadenar picazón. Te acompañamos a encontrar una solución médica efectiva para que descanses tranquilo.'
    },
    'calor-lugar': {
      title: '¿Brotes de Urticaria Crónica por el Calor en [LUGAR]? Haz de las Ronchas la Parte Más Pequeña de tu Vida',
      intro: 'El aumento de temperatura y el sudor en [LUGAR] pueden intensificar la picazón y los habones. Te acompañamos a comprender tus brotes por calor, conectar con especialistas y recordar que tu vida es más que urticaria.'
    },
    'frio-lugar': {
      title: '¿Reacciones y Ronchas por el Frío en [LUGAR]? Haz de la Urticaria la Parte Más Pequeña de tu Vida',
      intro: 'El viento frío y los cambios bruscos de clima en [LUGAR] pueden reactivar las ronchas y el ardor. Te ayudamos a entender la respuesta de tu piel y a encontrar la atención médica adecuada.'
    }
  },
  sintomas: {
    manana: {
      title: '¿Despiertas con comezón? Entiende los síntomas matutinos y toma el control de tu día',
      intro: 'Iniciar la jornada sintiendo ardor o hinchazón desgasta tu energía antes de empezar. Conoce las señales de tu piel para que retomes el control desde temprano.'
    },
    'manana-calor': {
      title: 'Mañanas calurosas y piel irritada: Aprende a identificar tus síntomas desde temprano',
      intro: 'Cuando el calor matutino provoca brotes repentinos, la frustración puede acompañarte todo el día. Aprender a identificar tus síntomas es el primer paso para volver a disfrutar tu rutina.'
    },
    'manana-frio': {
      title: '¿Mañanas frías y sensibilidad en la piel? Reconoce los síntomas y evita la incertidumbre',
      intro: 'Sentir la piel inflamada o con urticaria por el frío matutino puede ser desconcertante. Te guiamos paso a paso para que comprendas tus síntomas y puedas actuar ante ellos.'
    },
    tarde: {
      title: '¿Picazón por la tarde? Conoce los síntomas y sus causas',
      intro: 'Llegar a la tarde con la piel resentida o picazón acumulada dificulta concentrarte en tus actividades. Identifica los signos característicos y descubre que sí hay un camino hacia el bienestar.'
    },
    'tarde-calor': {
      title: 'Tardes calurosas y brotes de ronchas: Identifica tus síntomas y recupera tu ritmo',
      intro: 'El sol y el calor de la tarde suelen acentuar la inflamación y los habones. Saber identificar tus síntomas te acercará al diagnóstico correcto con un especialista.'
    },
    'tarde-frio': {
      title: 'Tardes frías y piel irritada: Aprende a reconocer los síntomas',
      intro: 'Si notas que la piel se te inflama o aparecen ronchas tras exponerte al frío de la tarde, es momento de prestarle atención. Reconoce los síntomas y acércate a un especialista.'
    },
    noche: {
      title: '¿La comezón nocturna no te deja descansar? Entiende tus síntomas y vuelve a dormir en paz',
      intro: 'No poder dormir por la comezón nocturna afecta profundamente tu salud y tu estado de ánimo. Durante la noche, la baja de cortisol aumenta la histamina; entender este proceso es clave para volver a descansar.'
    },
    'noche-calor': {
      title: 'Noches calurosas y ardor en la piel: Identifica los síntomas de urticaria y recupera tu descanso',
      intro: 'Las noches calurosas intensifican el calor en la piel y hacen que los habones piquen con mayor fuerza. Aprende a registrar estos episodios para que tu médico ajuste el tratamiento que necesitas.'
    },
    'noche-frio': {
      title: 'Noches frías e inflamación inesperada: Aprende a leer los síntomas de tu piel',
      intro: 'El contraste del frío nocturno puede detonar brotes molestos justo cuando buscas relajarte. No te acostumbres a vivir con incomodidad: identifica tus síntomas y recuerda que tu bienestar va primero.'
    },
    'calor-lugar': {
      title: '¿El calor en [LUGAR] te detona picazón y ronchas? Reconoce los síntomas y recupera tu tranquilidad',
      intro: 'El clima cálido y el sudor en [LUGAR] pueden hacer que la picazón se vuelva insoportable durante el día. Entender que no es una simple irritación pasajera te ayudará a comunicarte mejor con tu médico y a buscar el alivio que mereces.'
    },
    'frio-lugar': {
      title: '¿El frío en [LUGAR] altera tu piel? Identifica tus síntomas y vuelve a sentirte bien',
      intro: 'Las bajas temperaturas o las corrientes de aire en [LUGAR] pueden poner tu piel al límite. Reconocer si estas reacciones son parte de la Urticaria Crónica Espontánea te dará la claridad que necesitas para recuperar tu tranquilidad.'
    }
  },
  tratamiento: {
    manana: {
      title: '¿Buscas alivio para empezar tu día? Explora tratamientos médicos para frenar la picazón matutina',
      intro: 'Comenzar la mañana aplicando remedios improvisados solo retrasa la solución real. Conoce los esquemas de tratamiento escalonado que te ayudarán a despertar libre de molestias.'
    },
    'manana-calor': {
      title: 'Mañanas calurosas sin ronchas: Encuentra el tratamiento adecuado para iniciar tu jornada con tranquilidad',
      intro: 'Si las altas temperaturas matutinas activan tus habones, no te resignes a vivir con ardor. Descubre cómo los tratamientos de primera y última generación pueden devolverte mañanas tranquilas.'
    },
    'manana-frio': {
      title: 'Mañanas frías y piel bajo control: Descubre alternativas médicas para prevenir los brotes al despertar',
      intro: 'El aire frío de la mañana no tiene que ser sinónimo de inflamación en la piel. Conoce los tratamientos disponibles, encuentra el adecuado para ti y deja atrás las molestias de la urticaria.'
    },
    tarde: {
      title: '¿La picazón de la tarde interfiere con tus actividades? Opciones de tratamiento para mantener el control',
      intro: 'Llegar a la tarde frustrado por la picazón acumulada resta calidad a tu vida personal y laboral. Conoce las opciones de tratamiento disponibles que te devolverán la concentración que buscas.'
    },
    'tarde-calor': {
      title: 'Afronta las tardes calurosas sin molestias: Conoce los medicamentos que ayudan a detener la histamina',
      intro: 'El calor vespertino suele exacerbar la vasodilatación y el ardor. Aprende cómo actúan las terapias médicas especializadas para frenar la reacción inmunitaria desde su origen.'
    },
    'tarde-frio': {
      title: 'Protege tu piel del viento frío de la tarde: Descubre terapias médicas efectivas contra la urticaria',
      intro: 'Cuando el frío de la tarde provoca molestias en tu piel, aplicar cremas comerciales no siempre es suficiente. Conoce las opciones de tratamiento supervisado que sí ofrecen un alivio sostenido.'
    },
    noche: {
      title: '¿La comezón nocturna no te deja dormir? Encuentra el tratamiento para recuperar tus noches de descanso',
      intro: 'El agotamiento por no poder dormir debido a la picazón nocturna afecta directamente tu salud física y emocional. Conoce los tratamientos para ayudarte a controlar la histamina por la noche y volver a descansar.'
    },
    'noche-calor': {
      title: 'Noches calurosas y brotes intensos: Descubre cómo frenar la picazón y volver a dormir tranquilo',
      intro: 'Las temperaturas elevadas pueden hacer que las ronchas se sientan insoportables al acostarte. Conoce los tratamientos para apagar los síntomas de UCE y dormir profundamente.'
    },
    'noche-frio': {
      title: 'Noches frías e inflamación en la piel: Tratamientos para un descanso continuo y sin molestias',
      intro: 'El frío nocturno puede desencadenar episodios severos de urticaria mientras intentas relajarte. Explora los tratamientos creados para brindarte noches de verdadero descanso.'
    },
    'calor-lugar': {
      title: '¿El calor en [LUGAR] intensifica tus brotes? Descubre las opciones de tratamiento para recuperar tu bienestar',
      intro: 'El clima cálido de [LUGAR] no tiene por qué condicionar tu día a día. Aunque el calor aumente la circulación y la comezón, existen medicamentos de vanguardia diseñados para bloquear la histamina y devolverte la comodidad que necesitas.'
    },
    'frio-lugar': {
      title: '¿El frío en [LUGAR] enrojece tu piel? Conoce cómo tratar la urticaria y volver a sentirte cómodo',
      intro: 'Las bajas temperaturas en [LUGAR] pueden hacer que tu piel reaccione con mayor sensibilidad. Conoce los tratamientos disponibles para la urticaria y prevén los brotes por frío.'
    }
  },
  // El Excel no trae variación de subtítulo para el Test: se conserva el texto base.
  test: {
    manana: { title: '¿Despiertas con comezón o brotes? Descubre si tus síntomas coinciden con UCE' },
    'manana-calor': { title: 'Mañanas calurosas e irritación en la piel: Evalúa tus síntomas con este Test' },
    'manana-frio': { title: 'Mañanas frías e hinchazón inesperada: Averigua si tus síntomas coinciden con UCE' },
    tarde: { title: '¿La picazón de la tarde afecta tu jornada? Realiza nuestro Test de Autoevaluación' },
    'tarde-calor': { title: 'Tardes calurosas y brotes de ronchas: Descubre si tus síntomas son Urticaria Crónica' },
    'tarde-frio': { title: 'Tardes frías y urticaria en la piel: Evalúa tus síntomas en menos de 5 minutos' },
    noche: { title: '¿La comezón nocturna altera tu descanso? Realiza este Test de Orientación de Síntomas' },
    'noche-calor': { title: 'Noches calurosas y ardor en la piel: Averigua si tus brotes nocturnos son UCE' },
    'noche-frio': { title: 'Noches frías y ronchas persistentes: Descubre si tus síntomas corresponden a UCE' },
    'calor-lugar': { title: '¿El calor en [LUGAR] te provoca ronchas? Realiza este Test de Síntomas' },
    'frio-lugar': { title: '¿Sufres de picazón por el frío en [LUGAR]? Evalúa tus síntomas en 5 minutos' }
  }
}

// Momento del día + sensación térmica. Con temperatura real manda la temperatura;
// sin ella (o con ?vista= forzada) se usa el contexto visual para que texto y foto coincidan.
export function heroSlot(ctx, now = new Date(), temp = null) {
  const d = getSimulatedDate(now)
  const h = d.getHours()
  const night = isNight(d)
  const moment = night ? 'noche' : h < 12 ? 'manana' : 'tarde'

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
