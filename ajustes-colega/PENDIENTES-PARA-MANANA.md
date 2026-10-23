# Pendientes para continuar (corte del 22-oct-2026, noche)

Estado: todo el trabajo está **sin commit** en el árbol de trabajo. Respaldo comprimido de `src` en `ajustes-colega/respaldo/`. El detalle de lo ya hecho está en `REGISTRO-DE-CAMBIOS.md`.

## 1. Lo que sigue (aprobado por el usuario, se hace mañana)

**Quiz y Diario con escala UAS7** (comentarios del cliente en las capturas "Quiz orientativo: Q4" y "Q2")
1. **Q2 "Tiempo con síntomas"** (`src/lib/campaign.js`, pregunta `q2`): cambiar a "Menos de 1 semana", "De 1 a 6 semanas", "6 semanas o más"; barra de tiempo de 0 a 12 semanas con la marca de 6 semanas (como el comparador de Síntomas) y el texto "La urticaria crónica espontánea se identifica cuando los síntomas se presentan durante 6 semanas o más" con cita. Ajustar el cálculo en `src/lib/cuestionario.js` (líneas que hacen `parseInt(r.q2)`).
2. **Diario** (`src/lib/SymptomDiary.svelte`): la "Suma de la semana" de habones (0 a 3 por día) más comezón (0 a 3 por día) es exactamente el UAS7 (0 a 42). Mostrar el total, su banda y un medidor con flecha. Bandas confirmadas en NIH/PMC10219198: 0 libre de urticaria, 1-6 bien controlada, 7-15 leve, 16-27 moderada, 28-42 severa.
3. **Resultado del quiz** (`src/lib/QuizModal.svelte`): estimación = (Q3 ronchas + Q4 comezón) x 7, con el mismo medidor y la leyenda "estimación orientativa, no un diagnóstico ni un puntaje clínico" más la nota de que solo un profesional puede evaluarlo.
4. El medidor se **dibuja en código** (no usar el gráfico adjunto del cliente, que parece de terceros). Colores: verde, amarillo, naranja, rojo como el del cliente (pendiente confirmar si prefiere la paleta del sitio).
5. Citar en IEEE: J. A. Bernstein et al., "Why a complete response is the treatment aim in chronic spontaneous urticaria," *J. Clin. Med.*, vol. 12, p. 3561, 2023 (PMC10219198; verificar datos antes de citar).

**Acerca de, sección 03 "¿Qué puedes hacer en el sitio?"** (captura "Sobre nosotros 3 de 5")
- Sustituir "Entender los síntomas" por tres visuales con su nombre debajo (Habones (ronchas), Hinchazón (angioedema), Comezón), enlazadas a Síntomas, con las mismas imágenes de Síntomas sección 01 ("Imagen por definir" hasta que haya aprobadas).
- Sustituir "Conocer opciones generales" por el botón directo "Encuentra a un especialista cerca de ti".

**Leyenda** "Recuerda: únicamente un profesional de la salud puede hacer un diagnóstico de esta enfermedad y sugerir un tratamiento específico." Falta en Inicio, Testimonios y Blog (en las demás páginas ya está).

**Blog:** la tarjeta "¿La urticaria empeora con el estrés?" (en `homeArticles`, `siteContent.js`, y el artículo `estres-y-observaciones` en `blogDrafts.js`) choca con el acuerdo de que el estrés es consecuencia y no causa. Ajustar título y texto o quitarla (decisión pendiente).

## 2. Pendientes anteriores

- Imágenes de las tarjetas de síntomas (candidatas en `ajustes-colega/imagenes/`; prompt para Gemini en `PROMPT-para-gemini.md`).
- Confirmar con Novartis la política de imágenes: el corte de piel, las muestras de Inicio y el comparador son ilustraciones dibujadas en código (sin fotos ni generador de imágenes), pero hechas por una IA.
- Datos reales de Novartis: ID de contenido y fecha de vigencia (`site.js`), textos y enlaces legales (`LEGAL_LINKS`), logo oficial, y un directorio real de alergólogos y dermatólogos (hoy 20 registros de ejemplo sin nombres).
- Botones "Hacer Test de Autoevaluación" y "Buscar Especialista": propuesta "Hacer el test orientativo" y "Encuentra a un especialista cerca de ti".
- Ciudad en inglés ("Mexico City") en la imagen principal y el directorio.
- Redirecciones de las direcciones viejas del blog, si ya estaban publicadas.
- Referencias: una guía mexicana vigente (la de 2014 está desactualizada); Recursos, Directorio, Testimonios y Diario no tienen citas.
- Revisar los bloques del glosario máster que faltan (Recursos, Testimonios, Blog, Acerca de, resto del quiz).
- Al terminar: retomar capturas reales y actualizar la presentación de la propuesta (se edita en local con python-pptx; el usuario la sube).
- Decidir si se hace commit (el usuario no lo ha pedido).

## 3. Reglas del usuario (vigentes)

- Editar por partes y que él revise; no cambiar código sin que lo pida.
- Sin imágenes de IA (política de Novartis).
- Siempre "habones (ronchas)" y "hinchazón (angioedema)"; nunca "UCE"; "comezón"; "alergólogo o dermatólogo".
- Nada de medicamentos, cremas o remedios: solo lo que indique un especialista.
- Antes de editar en bloque, hacer respaldo y verificar con diferencias.
