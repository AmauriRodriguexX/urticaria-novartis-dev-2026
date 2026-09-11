export const themes = {
  dia: { bg: 'radial-gradient(1100px 680px at 78% -8%, rgba(97,195,217,.30), transparent 60%), radial-gradient(900px 560px at 6% 108%, rgba(253,217,183,.55), transparent 58%), #f0eee6', ink:'#22383f', soft:'#5a6a6d', faint:'#8b9698', accent:'#ee7067', accentSoft:'rgba(238,112,103,.16)', line:'#dcd8c9', card:'#fffdf8', border:'#e6e2d4', glow:'rgba(97,195,217,.5)', bloom:'rgba(238,112,103,.22)', person:'#2c5560', rim:'rgba(255,255,255,.7)', shade:'rgba(120,150,160,.28)', shadow:'rgba(80,110,120,.22)' },
  calor: { bg: 'radial-gradient(1000px 640px at 82% -6%, rgba(252,215,105,.55), transparent 58%), radial-gradient(900px 560px at 4% 106%, rgba(238,112,103,.38), transparent 56%), #fbf2e6', ink:'#4a2a22', soft:'#7a5448', faint:'#a98a7c', accent:'#e0584d', accentSoft:'rgba(224,88,77,.16)', line:'#ecd9c4', card:'#fffaf2', border:'#f0dcc6', glow:'rgba(252,215,105,.6)', bloom:'rgba(238,112,103,.26)', person:'#6e3a2c', rim:'rgba(255,255,255,.72)', shade:'rgba(180,120,80,.26)', shadow:'rgba(150,90,50,.2)' },
  frio: { bg: 'radial-gradient(1000px 640px at 80% -8%, rgba(97,195,217,.42), transparent 58%), radial-gradient(900px 560px at 4% 108%, rgba(255,255,255,.85), transparent 56%), #eaf1f3', ink:'#1c3b44', soft:'#4f6970', faint:'#85999e', accent:'#0081a8', accentSoft:'rgba(0,129,168,.14)', line:'#d3e0e3', card:'#fbfdfe', border:'#dde9eb', glow:'rgba(97,195,217,.55)', bloom:'rgba(97,195,217,.28)', person:'#1e4b58', rim:'rgba(255,255,255,.85)', shade:'rgba(90,140,155,.26)', shadow:'rgba(60,110,125,.2)' },
  madrugada: { bg:'radial-gradient(820px 620px at 76% 14%, rgba(252,215,105,.18), transparent 56%), radial-gradient(700px 540px at 70% 8%, rgba(238,112,103,.10), transparent 60%), #15151b', ink:'#ece4d7', soft:'#a59c8e', faint:'#8f887c', accent:'#f0c24f', accentSoft:'rgba(240,194,79,.16)', line:'rgba(255,255,255,.10)', card:'rgba(255,255,255,.045)', border:'rgba(255,255,255,.10)', glow:'rgba(252,215,105,.32)', bloom:'rgba(240,194,79,.10)', person:'#f0c24f', rim:'rgba(255,240,210,.5)', shade:'rgba(0,0,0,.4)', shadow:'rgba(0,0,0,.5)' },
  'noche-calor': { bg:'radial-gradient(840px 640px at 74% 12%, rgba(238,112,103,.22), transparent 56%), radial-gradient(680px 520px at 72% 6%, rgba(252,215,105,.14), transparent 60%), #1a1418', ink:'#f0e5db', soft:'#ad9d92', faint:'#958479', accent:'#f08a72', accentSoft:'rgba(240,138,114,.18)', line:'rgba(255,255,255,.10)', card:'rgba(255,255,255,.05)', border:'rgba(255,255,255,.11)', glow:'rgba(238,112,103,.34)', bloom:'rgba(240,138,114,.12)', person:'#f08a72', rim:'rgba(255,225,205,.5)', shade:'rgba(0,0,0,.42)', shadow:'rgba(0,0,0,.5)' }
}

export const copies = {
  dia: ['Buenos días','Tu vida es más grande que ','los brotes',' de urticaria crónica espontánea.','Entender qué te pasa es el primer paso para retomar el control. Te acompañamos a preparar tu próxima consulta médica.','Descúbrelo en 1 minuto','Un quiz que te orienta. No reemplaza a tu médico.'],
  calor: ['En Mérida, ahora mismo','En Mérida el calor está fuerte. Y el calor puede subir ','los brotes','.','No es tu imaginación: el calor y la humedad despiertan la piel. Esto puede ayudarte hoy a entender qué te pasa.','Esto puede ayudarte hoy','Un quiz que te orienta. No reemplaza a tu médico.'],
  frio: ['Con el frío de esta temporada','Con el frío, a algunas personas la piel se les ','brota','.','Sí, existe la urticaria por frío, y el aire seco del invierno irrita la piel. Esto ayuda a entender qué te pasa.','Entiende qué te pasa','Un quiz que te orienta. No reemplaza a tu médico.'],
  madrugada: ['Son las 3:15 a.m.','¿No puedes ','dormir','?','La comezón aparece justo cuando todo se queda en silencio. Respira: no estás solo/a, y esto pasa. Quédate, te acompañamos.','Quédate un momento','Sin prisa. Cuando amanezca, esto puede ayudarte a entender qué pasa.'],
  'noche-calor': ['Son las 9:00 p.m.','La noche está calurosa, y la comezón no te deja ','dormir','.','El calor de esta noche aviva la piel. Respira: no estás solo/a, y esto pasa. Quédate, te acompañamos.','Quédate un momento','Sin prisa. Cuando amanezca, esto puede ayudarte a entender qué pasa.']
}

export const questions = {
  // --- Preguntas de Ben (Novartis CSU Cuestionario) ---
  q0: ['text', '¿Cuál es tu nombre? (Opcional)', 'Para personalizar tu resumen médico orientativo.', []],

  q1: ['multi', '¿Has presentado alguno de los siguientes síntomas?', 'Marca todos los que hayas notado en tu piel.', [
    ['ninguno', 'Ninguno de estos', ''],
    ['ronchas', 'Ronchas en la piel', 'Marcas rojizas o elevadas que aparecen y desaparecen'],
    ['picazon', 'Comezón intensa', 'Sensación constante o incómoda de querer rascarte'],
    ['hinchazon', 'Hinchazón', 'En labios, párpados, manos o pies']
  ]],

  q1b: ['single', '¿La hinchazón es en labios, lengua o garganta, o te cuesta respirar?', 'Esto es importante: ayuda a descartar una urgencia.', [
    ['urgente', 'Sí — labios, lengua, garganta, o me cuesta respirar', ''],
    ['no_urgente', 'No — es en párpados, manos o pies', '']
  ]],

  q2: ['single', '¿Cuánto tiempo llevas con estos síntomas?', 'El tiempo ayuda a distinguir entre un brote pasajero o crónico.', [
    ['0', 'Menos de 1 semana', 'Empezó hace unos días'],
    ['1', 'De 1 semana a 1 mes', 'Lleva varias semanas'],
    ['2', 'De 1 mes a 6 meses', 'Varios meses continuos o intermitentes'],
    ['3', 'Más de 6 meses', 'Llevo bastante tiempo con brotes']
  ]],

  q3: ['single', 'En la última semana, ¿cómo calificas la cantidad de ronchas que has tenido?', 'Aproximadamente en un periodo de 24 horas.', [
    ['0', 'Ninguna', 'No he tenido ronchas visibles'],
    ['1', 'Leve (Menos de 20 ronchas)', 'Aparecen pocas y aisladas'],
    ['2', 'Moderada (De 20 a 50 ronchas)', 'Brote notorio en varias partes'],
    ['3', 'Alta (+ de 50 ronchas)', 'Grandes áreas de ronchas que se unen']
  ]],

  q4: ['single', 'En la última semana, ¿qué tan intensa ha sido la comezón?', '¿Qué tanto te ha molestado en tu día a día?', [
    ['0', 'Ninguna', 'Sin comezón'],
    ['1', 'Leve', 'Presente pero no molesta'],
    ['2', 'Moderada', 'Molesta pero no interfiere con tus actividades o sueño'],
    ['3', 'Alta / Severa', 'Comezón intensa que interfiere con tu día o el sueño']
  ]],

  q5: ['single', 'En la última semana, ¿cómo ha sido la hinchazón en tu cuerpo?', 'Hinchazón debajo de la piel en labios, párpados, manos o pies.', [
    ['0', 'Ninguna', 'No he tenido hinchazón'],
    ['1', 'Leve', 'Hinchazón ligera en una zona, cede rápido sin dolor'],
    ['2', 'Moderada', 'Notoria, limita ligeramente o causa molestia'],
    ['3', 'Intensa', 'Severa, dolorosa o que dificulta el movimiento']
  ]],

  q6: ['multi', '¿Qué áreas de tu vida se han visto afectadas por tus síntomas?', 'Marca todas las que apliquen.', [
    ['actividades', 'Actividades diarias', 'Compras, limpieza, tareas del hogar'],
    ['sociales', 'Vida social y relaciones', 'Pareja, familia o reuniones con amigos'],
    ['vestimenta', 'Elección de vestimenta', 'Evitar telas, texturas o ropa ajustada'],
    ['trabajo', 'Trabajo o estudios', 'Concentración y rendimiento'],
    ['sueno', 'Calidad de sueño', 'Despertares nocturnos o insomnio']
  ]],

  q7: ['single', 'En la última semana, ¿qué tanto han interferido los síntomas con tus actividades diarias?', '', [
    ['0', 'Nada', ''], ['1', 'Un poco', ''], ['2', 'Medianamente', ''], ['3', 'Mucho', '']
  ]],

  q8: ['single', 'En la última semana, ¿qué tanto han afectado a tus relaciones familiares, sociales o de pareja?', '', [
    ['0', 'Nada', ''], ['1', 'Un poco', ''], ['2', 'Medianamente', ''], ['3', 'Mucho', '']
  ]],

  q9: ['single', 'En la última semana, ¿qué tanto han condicionado los síntomas la ropa que usas?', 'Por ejemplo, evitar ciertas telas, texturas o prendas ajustadas.', [
    ['0', 'Nada', ''], ['1', 'Un poco', ''], ['2', 'Medianamente', ''], ['3', 'Mucho', '']
  ]],

  q10: ['single', 'En la última semana, ¿qué tanto han afectado a tu trabajo o estudios?', '', [
    ['0', 'Nada', ''], ['1', 'Un poco', ''], ['2', 'Medianamente', ''], ['3', 'Mucho', '']
  ]],

  q11: ['single', 'En la última semana, ¿qué tanto han afectado tu calidad de sueño?', '', [
    ['0', 'Nada', ''], ['1', 'Un poco', ''], ['2', 'Medianamente', ''], ['3', 'Mucho', '']
  ]],

  q12: ['multi', '¿Consideras que alguno de estos eventos desencadena o intensifica tus síntomas?', 'Marca todos los factores que notes.', [
    ['calor', 'Clima caliente, sol o duchas calientes', ''],
    ['frio', 'Clima frío, aire helado o agua fría', ''],
    ['estres', 'Estrés emocional o tensión', ''],
    ['sudor', 'Sudor o ejercicio físico', ''],
    ['ropa', 'Ropa ajustada o roce constante', ''],
    ['sin_patron', 'No identifico ningún detonante claro', 'Aparecen de manera espontánea']
  ]],

  q13: ['single', '¿Sueles presentar más brotes en algún momento del día?', '¿Notas algún horario en particular?', [
    ['manana', 'Por la mañana', ''],
    ['tarde', 'Por la tarde', ''],
    ['noche', 'Por la noche o madrugada', ''],
    ['sin_patron', 'Sin importar el momento del día', '']
  ]],

  q14: ['single', '¿Has consultado previamente a un médico sobre estos síntomas?', '', [
    ['0', 'No', 'Aún no he ido a consulta médica'],
    ['1', 'Sí', 'Ya he tenido consultas']
  ]],

  q15: ['single', '¿Con qué frecuencia has consultado?', '', [
    ['1', 'Pocas veces', '1 o 2 veces con médico general'],
    ['2', 'Frecuentemente', 'Al menos una vez al mes'],
    ['3', 'Seguimiento continuo', 'En control continuo con especialista']
  ]],

  q16: ['multi', '¿Qué tipo de especialista has consultado?', 'Marca todos los que apliquen.', [
    ['general', 'Médico general', ''],
    ['dermatologo', 'Dermatólogo/a', ''],
    ['alergologo', 'Alergólogo/a', '']
  ]],

  q17: ['single', '¿Has tomado o aplicado algún tratamiento para estos síntomas?', 'Medicamentos recetados, de venta libre o remedios.', [
    ['0', 'No', 'No he tomado ni aplicado nada'],
    ['1', 'Sí', 'He tomado o aplicado tratamientos']
  ]],

  q18: ['multi', '¿Qué tipo de tratamiento has utilizado?', 'Selecciona los que hayas probado.', [
    ['1', 'Básico', 'Antihistamínicos de venta libre, pomadas o remedios caseros'],
    ['2', 'Intermedio', 'Antihistamínicos recetados a dosis continuas o corticoides'],
    ['3', 'Avanzado', 'Dosis altas, tratamientos específicos o seguimiento estrecho']
  ]],

  q19: ['single', '¿Qué tan efectivo ha sido tu tratamiento para controlar tus síntomas?', '', [
    ['0', 'Nada efectivo', 'Sigo con los mismos síntomas'],
    ['1', 'Poco efectivo', 'Apenas he notado alivio'],
    ['2', 'Medianamente efectivo', 'Me ayuda pero los brotes regresan'],
    ['3', 'Muy efectivo', 'Controla favorablemente mis síntomas']
  ]]
}
