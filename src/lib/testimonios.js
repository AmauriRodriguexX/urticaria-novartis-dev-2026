// Casos del Excel ("testimonios" y "Hoja 5"). Son personas ficticias aprobadas como ejemplo
// para el lanzamiento; el texto queda sujeto a la revisión médica de Novartis.
// photo: ruta dentro de public/ (ej. 'assets/img/testimonios/mariana.jpg'). Sin foto se muestran las iniciales.
export const casos = [
  {
    id: 'mariana',
    name: 'Mariana S.',
    detail: '34 años (CDMX)',
    title: 'Pensé que era alergia a la comida',
    story: 'Durante casi un año dejé de comer de todo porque creía que las ronchas eran por intoxicación. Nadie me daba respuestas hasta que llegué con un dermatólogo que me diagnosticó Urticaria Crónica Espontánea. Entender que no era mi culpa ni algo que comí me devolvió la paz. Hoy, con el tratamiento adecuado, mi piel está limpia y volví a disfrutar de mis salidas con amigos.',
    homeQuote: 'Pensé que era alergia a la comida durante un año. Entender qué es la UCE y dar con el especialista correcto me devolvió mi tranquilidad.',
    photo: null
  },
  {
    id: 'carlos',
    name: 'Carlos M.',
    detail: '42 años (Monterrey)',
    title: 'El dolor y la picazón no me dejaban trabajar',
    story: 'Los brotes me daban más fuerte en las noches y en las manos por el trabajo. Pasé meses sin dormir bien y con mucho estrés. Encontrar al especialista correcto y un tratamiento continuo cambió todo. Ahora puedo concentrarme en mi trabajo y mi familia. Tu vida es mucho más grande que las ronchas.',
    homeQuote: 'La picazón nocturna no me dejaba trabajar. Con el tratamiento adecuado volvieron mis noches de descanso.',
    photo: null
  },
  {
    id: 'elena-mateo',
    name: 'Elena y su hijo Mateo',
    detail: '8 años (Guadalajara)',
    title: 'La tranquilidad que necesitábamos como familia',
    story: 'Ver a mi hijo despertar en las madrugadas llorando por la comezón era angustiante. Los remedios caseros no funcionaban. El alergólogo nos guió con mucha paciencia para encontrar el tratamiento seguro para su edad. Hoy Mateo juega fútbol sin molestia alguna y como mamá volví a dormir tranquila.',
    photo: null
  }
]

export const iniciales = name => name.split(/\s+/).filter(w => /^[A-ZÁÉÍÓÚÑ]/.test(w)).slice(0, 2).map(w => w[0]).join('')
