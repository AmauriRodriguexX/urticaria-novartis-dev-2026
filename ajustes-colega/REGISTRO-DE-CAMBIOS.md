# Registro de cambios al sitio (ajustes de la reunión del 22 de octubre de 2026)

Todos los cambios están en el código local, **sin commit**. Se trabajó por pasos y cada paso se revisó con el usuario antes de pasar al siguiente. Esta lista dice qué se hizo, en qué archivo y en qué páginas se ve.

Páginas del sitio: Inicio (`/`), Recursos (`/recursos-herramientas/`), Síntomas (`/sintomas/`), Tratamientos (`/tratamiento/`), Directorio (`/directorio-medico/`), Testimonios (`/testimonios/`), Blog (`/blog/`), Acerca de (`/sobre-nosotros/`), Diario (`/diario/`) y Test (`/test/`).

---

## Paso 1. Terminología médica

**Acuerdo:** reemplazar "UCE" por "urticaria crónica espontánea" y usar "comezón" en lugar de "picazón".

| Qué cambió | Dónde |
|---|---|
| "UCE" por "urticaria crónica espontánea" en textos, títulos, etiquetas y descripciones | `siteContent.js`, `HomeLanding.svelte` (Inicio), `pageMetadata.json` (títulos y descripciones para buscadores), `Directorio.svelte` (etiqueta "Dermatología y UCE" ahora "Dermatología") |
| "Picazón" por "comezón" | `cuestionario.js` (preguntas y resultado del test), `testimonios.js`, `pageMetadata.json`, `siteContent.js` |
| Síntomas siempre como **"habones (ronchas)"** e **"hinchazón (angioedema)"** (antes "ronchas (habones)" y "angioedema (hinchazón)") | `HomeLanding.svelte` (definición, dato clave, ilustración), `siteContent.js` (Inicio, Síntomas, Tratamientos, Diario, Directorio), `SkinSamples.svelte`, `SkinTimeline.svelte`, `SymptomDiary.svelte`, `campaign.js` y `cuestionario.js` (test), `blogDrafts.js`, `pageMetadata.json`. Dentro de un mismo bloque corto (estados de la animación, aviso de urgencia del test) las menciones siguientes quedan como "roncha" o "hinchazón". |
| Direcciones del blog con "uce" renombradas | `blogDrafts.js` y `siteContent.js`: `/blog/que-significa-urticaria-cronica-espontanea/` y `/blog/dietas-restrictivas-urticaria-cronica-espontanea/`. Las direcciones viejas ya no existen. |

Verificado: no queda "UCE" en textos ni en direcciones del sitio. Las claves internas `uce` (comparador de Síntomas) y `uce_geo_ctx` (almacenamiento local) siguen igual porque el usuario no las ve.

---

## Paso 2. Pie de página

**Acuerdo:** logotipo de Novartis, "Consulte a su médico", ID de contenido y fecha de vigencia.

Archivos: `App.svelte` (pie en todas las páginas), `LogoNovartis.svelte`, `logos/novartis_logo.svg`, `site.js`, `app.css`.

Orden actual del pie:
1. Frase "Tu vida es más grande que los brotes de urticaria crónica espontánea."
2. Logo **NOVARTIS | Reimagining Medicine** (archivo entregado, recortado al área visible; en modo oscuro se invierte a blanco).
3. "Consulte a su médico. ID de contenido: … / Fecha de vigencia: …".
4. "Este contenido es solo información general y no sustituye el consejo médico…".
5. "Las imágenes empleadas no corresponden a pacientes reales. Las imágenes empleadas no corresponden a Profesionales de la Salud reales."
6. Domicilio de Novartis Farmacéutica, S.A. de C.V.
7. Enlaces: Términos y condiciones, Aviso de privacidad, Declaración de accesibilidad.
8. A la derecha: dominio y © del sitio.

**Pendiente de Novartis:** el ID real (`CONTENT_ID`) y la vigencia (`VIGENCIA`) siguen con valores de relleno en `site.js`. Los tres enlaces legales (`LEGAL_LINKS`, en `site.js`) apuntan a `#` hasta que entreguen los textos y las direcciones.

---

## Paso 3. Referencias científicas

**Acuerdo:** citar artículos de organizaciones oficiales (Instituto Nacional de Salud) para sustentar las afirmaciones técnicas.

Archivos: `siteContent.js`, `LandingPage.svelte`, `HomeLanding.svelte`, `BlogPage.svelte`, `blogDrafts.js`, `SymptomCompare.svelte`, `Cita.svelte` y `Fuentes.svelte` (los dos últimos son componentes nuevos compartidos).

**Formato IEEE** (comentario del cliente: "incluir referencias estilo IEEE"): citas numéricas entre corchetes en el texto, como [1] o [2], en negritas y subrayadas, que llevan a la referencia; lista titulada "Referencias" con autores con inicial primero, título entre comillas, revista en cursiva, volumen, número, año y DOI. Aplica en Inicio, Síntomas, Tratamientos y blog (`Cita.svelte`, `Fuentes.svelte`, `siteContent.js`, `blogDrafts.js`).

**Cómo funciona**
- **Una sola lista de referencias por página**, al final, con numeración continua. Cada fuente tiene un botón "Consultar fuente" con el dominio subrayado.
- **Citas numeradas** ([1], [2]…) junto a cada afirmación; al dar clic llevan a la referencia y la resaltan.
- **Línea "Adaptado de:"** al final de cada sección, con enlaces en negritas y subrayados que llevan a la referencia (por ejemplo, "MedlinePlus (2025) [1]").
- Antes de citar, se leyó la frase exacta en cada fuente.

**Síntomas** (`/sintomas/`)

| N.º | Fuente | Respalda | Dónde |
|---|---|---|---|
| 1 | MedlinePlus en español, Urticaria (NIH, abril 2025) | Habones cambian de forma, "inusual que un habón dure más de 48 horas", más de 6 semanas es crónica, angioedema "en cualquier parte del cuerpo", dermografismo, urgencia (garganta, lengua) | Secciones 01, 02, 03 y 04 |
| 2 | Tbakhi et al. (2025), *Allergy Asthma Immunol Res* (PMC) | Definición, 6 semanas, sin desencadenante identificable | Secciones 01 y 02 |
| 3 | Wasim et al. (2025), *Health Science Reports* (PMC12051439) | Efecto en el sueño | Sección 01 (tarjeta Comezón) |
| 4 | Sachdeva et al. (2011), *Indian J Dermatol* (PMC3276885) | Mastocitos liberan histamina; vasos más permeables; comezón y a veces ardor; roncha de 1 a 24 h; angioedema en dermis profunda y bajo la piel, a veces doloroso, hasta 72 h | Sección 01 (corte de piel) |
| 5 | Hsieh y Lee (2017), *CMAJ* (PMC5235931) | Las lesiones desaparecen en 24 h sin cicatrices; angioedema en 30 % a 50 % | Sección 01 (corte de piel) y 04 |
| 6 | Yadav y Bajaj (2009), *Indian J Dermatol* (PMC2810698) | No es contagiosa | Sección 04 (preguntas frecuentes) |

**Inicio** (`/`): 1 Tbakhi, 2 MedlinePlus, 3 Yadav y Bajaj. Respaldan "más de 6 semanas", "sin causa alérgica externa evidente", "no es contagiosa", "tiene tratamiento" y la línea de tiempo.

**Tratamientos** (`/tratamiento/`): 1 Tbakhi. Respalda el objetivo del tratamiento (control de síntomas) y los pasos del brote (mastocitos, histamina, habones y comezón).

**Blog:** el artículo "Qué es la urticaria crónica espontánea" lista Tbakhi, MedlinePlus y la guía EAACI/GA²LEN (2022); el de dietas restrictivas lista Tbakhi. El blog tenía fuentes en los datos pero **no se mostraban**; ahora se muestran al final del artículo. "Preparar consulta" no tiene afirmaciones científicas y "Estrés" conserva la guía EAACI.

**Cambio de texto por falta de respaldo:** "Puede aparecer en párpados, labios, manos o pies" pasó a "Puede aparecer en cualquier parte del cuerpo, como labios o párpados" (tarjeta Hinchazón y guía visual), porque MedlinePlus dice "cualquier parte del cuerpo" y no enumera zonas.

**Salvedades:** la afirmación "respuesta interna del sistema inmune" de Inicio se respalda con Tbakhi (trastorno mediado por mastocitos, con autoanticuerpos en parte de los casos). Las fuentes de contagio y cicatrices son de 2009 y 2017. Falta una guía mexicana vigente (la de 2014 está desactualizada).

---

## Paso 4. Visuales y componentes nuevos

| Qué | Dónde | Detalle |
|---|---|---|
| Comparador de tipos de urticaria | Síntomas, sección 02. `SymptomCompare.svelte` | Selector de tema, muestras de piel dibujadas en código, línea de tiempo con marca de 6 semanas, dato clave "6+ semanas", tabla completa con "Ver todas las diferencias". Sin causas de clima (acuerdo de la reunión). |
| Tarjetas de síntomas con imagen | Síntomas, sección 01 | Ronchas, Hinchazón, Comezón y Ardor, con marcador "Imagen por definir". Las imágenes candidatas están en `ajustes-colega/imagenes/` (ver `INDICE.md` y `PROMPT-para-gemini.md`). **Sin imágenes de IA.** |
| Leyenda en la imagen principal | Inicio (`Hero.svelte`) | "Imagen ilustrativa: no representa a una persona real." |
| Variantes de la imagen principal por hora, clima y ciudad | `heroVariations.js` | Inicio, Síntomas, Tratamientos y Test. Sin causas climáticas; texto genérico para calor, frío y ciudad. |
| Corte de la piel con línea de tiempo | Síntomas, sección 01. `SkinTimeline.svelte` | Epidermis, dermis (mastocitos, vasos, folículo) e hipodermis. Modo roncha y modo angioedema; deslizador de 0 a 72 h en pasos de 15 min, con puntos cada 24 h y banda de duración; texto de estado con citas. Reemplaza el párrafo de las 48 h. Dibujo hecho con código, sin fotos ni generador de imágenes. |
| Muestras de piel en volumen | Inicio, "¿Qué es la urticaria crónica espontánea?". `SkinSamples.svelte` | Dos bloques en corte (epidermis, dermis, hipodermis): sin ronchas y con ronchas (habones). Microanimación: las ronchas suben y bajan despacio y los gránulos titilan; sin movimiento si el sistema pide reducirlo. Reemplaza la ilustración plana anterior. |
| "Cómo se guía este sitio" más visual y corto | Acerca de, sección 02. `siteContent.js`, `LandingPage.svelte`, `app.css` | Cuatro tarjetas con ícono (Claro, Responsable, Privado, Transparente), una frase corta cada una, en lugar de 2 tarjetas y 4 viñetas con unas 120 palabras. 4 en fila en escritorio, 2 por fila en tablet y celular (comentario del cliente: "hacerlo más creativo, reducir texto"). Se quitó también el mensaje de patrocinio de la sección 01, porque la leyenda de Novartis va en el pie. |
| Se quitó la etiqueta "De esta trata el sitio" | Síntomas, sección 02 (comparador), tarjeta de urticaria crónica espontánea. `SymptomCompare.svelte` | La tarjeta conserva el borde destacado. |
| Quiz Q2 con línea de tiempo en semanas | Test, pregunta "¿Cuánto tiempo llevas con estos síntomas?". `campaign.js`, `QuizModal.svelte`, `app.css` | Opciones "Menos de 1 semana", "De 1 a 6 semanas", "De 6 semanas a 6 meses", "Más de 6 meses" (misma puntuación que antes) y una barra de 0 a 12 semanas con la marca de 6 semanas y el texto "La urticaria crónica espontánea se identifica cuando los síntomas se presentan durante 6 semanas o más", con enlace a la fuente. |
| Escala con flecha en habones y comezón del test | Test, preguntas de habones (ronchas) y de comezón (Q3 y Q4). `ScaleSelect.svelte`, `QuizModal.svelte`, `app.css` | La persona coloca la flecha en una escala de 4 tramos de color (verde, amarillo, naranja, rojo) tocando, arrastrando o con el teclado; debajo cambia la descripción del nivel y "Continuar" se habilita al elegir. Mismos textos y valores 0 a 3 de antes, así que el cálculo no cambia (comentario del cliente: "que ellos puedan dejar la flecha en el número de ronchas y en el color"). |
| Medidor UAS7 | Diario (suma de la semana) y resultado del test. `UasGauge.svelte`, `SymptomDiary.svelte`, `QuizModal.svelte` | Medidor dibujado en código, de 0 a 42, con flecha y niveles: sin actividad (respuesta completa), bien controlada (1-6), leve (7-15), moderada (16-27) y severa (28-42), según J. A. Bernstein et al. (2023), referencia [1] en IEEE en la página del Diario. En el Diario es la suma de habones y comezón de los 7 días. En el test es una **estimación** = (habones + comezón) x 7, marcada como orientativa, no clínica ni diagnóstico. |
| Q12 como "mitos que escuchan los pacientes" | Test, pregunta de posibles desencadenantes. `campaign.js`, `cuestionario.js`, `QuizModal.svelte`, `pdf/resumen.js`, `app.css` | Antes: "¿Consideras que alguno de estos eventos desencadena o intensifica tus síntomas?" con clima, estrés, sudor y ropa. Ahora: "Cuando te salen habones (ronchas), ¿cuáles de estos comentarios has recibido?" con "Es por estrés", "Es una alergia", "Es por el sudor", "Es por el clima", "Es por lo que comes", "Es por la ropa o el jabón" y "Nadie me ha dicho nada" (exclusiva). El resultado, el resumen y el PDF dejan de decir que esos factores influyen: muestran una tarjeta "Has escuchado N comentarios sobre la causa de tus brotes" que explica que en la urticaria crónica espontánea los brotes aparecen sin desencadenante externo identificable (Tbakhi et al., 2025) y que el estrés suele ser consecuencia, no causa. La fila del resumen pasa a "Comentarios que has recibido" y el bloque del PDF a "COMENTARIOS SOBRE LA CAUSA". Comentario del cliente: "en la UCE no existen desencadenantes". |
| "Ronchas" en lugar de "brotes" en el test | Test, pregunta de momento del día (Q13) y demás textos del quiz. `campaign.js`, `cuestionario.js`, `QuizModal.svelte` | "¿Sueles presentar más ronchas en algún momento del día?", "entre ronchas pasajeras y crónicas", "Llevo bastante tiempo con ronchas", "Me ayuda pero las ronchas regresan", y los textos del resumen y de la tarjeta de comentarios (comentario del cliente: "utilizar la palabra ronchas en vez de brotes"). La frase de la imagen principal "Tu vida es más grande que los brotes de urticaria crónica espontánea" no se tocó (no es del test). |
| Q18 "¿Qué tipo de tratamiento has utilizado?" por tipo, sin nombres | Test, después de contestar **Sí** en "¿Has tomado o aplicado algún tratamiento…?" (Q17). `campaign.js`, `cuestionario.js` | Opciones de selección múltiple: "Pastillas o jarabes", "Inyecciones", "Productos en la piel" y "Otro". No nombra productos ni fármacos, pero sí formas de tratamiento. El resumen dice, por ejemplo, "has usado pastillas o jarabes e inyecciones". **Sujeto a cambios:** el cliente pidió poner opciones de tratamiento (comentario de Q17), y esta es una versión intermedia entre las opciones neutras anteriores y los nombres de fármacos; la lista final la define Novartis, y puede chocar con la regla de no mencionar cremas o remedios. Si cambia, se edita `q18` en `campaign.js` y `TIPOS_TRAT` en `cuestionario.js`. |
| Espacios de imagen en Q1 (síntomas) y Q1b (descarte de urgencia) | Test. `QuizModal.svelte`, `app.css` | Q1: las tres opciones de síntoma (habones, comezón, hinchazón) llevan un recuadro "Imagen por definir" en una fila y "Ninguno de estos" va debajo, de ancho completo. Q1b, solo si marca hinchazón: cada opción lleva su recuadro 16:9. Las imágenes las entrega Novartis (comentario del cliente: "agregar imágenes" en ambas). Ver `imagenes/INDICE.md`. |
| Acerca de, sección 03 "¿Qué puedes hacer en el sitio?" | `/sobre-nosotros/`. `siteContent.js`, `LandingPage.svelte`, `app.css` | Los síntomas se muestran con imagen y su nombre debajo (Habones (ronchas), Hinchazón (angioedema), Comezón), cada uno enlazado a Síntomas; los recuadros dicen "Imagen por definir" hasta que Novartis entregue las imágenes. "Conocer opciones generales" se sustituyó por el enlace directo "Encuentra a un especialista cerca de ti" (sin texto explicativo). Comentarios del cliente: "mostrar los síntomas con imágenes y nombres debajo" y "tener el link directo al Encuentra a tu especialista". |
| Leyenda "Recuerda: únicamente un profesional de la salud puede hacer un diagnóstico de esta enfermedad y sugerir un tratamiento específico." | Ahora en **todas** las páginas: Inicio (al final, tras las referencias), Testimonios, Blog (lista y cada artículo) y las que ya la tenían. `LeyendaProfesional.svelte` (componente nuevo compartido) | Acuerdo de la reunión. |
| Botones de las preguntas frecuentes | Síntomas, Tratamientos, Testimonios y Acerca de | Cada respuesta lleva a la sección relacionada: diario, directorio, test o recursos. |
| Preguntas frecuentes | Todas las páginas | Solo la primera abierta; las demás cerradas. |
| Iconos nuevos | `src/lib/icons/` | auto_awesome, calendar_month, info, lightbulb, menu_book, forum, back_hand, open_in_new. |

---

## Paso 5. Descargos de responsabilidad y notas de seguridad

**Acuerdo:** una nota en cada diagnóstico o test orientativo que diga que solo un profesional de la salud puede determinar la enfermedad y sugerir un tratamiento.

| Dónde | Texto |
|---|---|
| Botones del test (Inicio, Síntomas, Test). `site.js` (`NOTA_TEST`) | "Este test es orientativo, no es un diagnóstico. Si tienes ronchas o comezón, conversa con un profesional de la salud." |
| Resultado del test. `QuizModal.svelte` | "Este resultado es solo orientativo y no es un diagnóstico. Recuerda: únicamente un profesional de la salud puede hacer un diagnóstico de esta enfermedad y sugerir un tratamiento específico." |
| Pantalla de urgencia del test. `QuizModal.svelte` | "Esta pantalla no es un diagnóstico. Únicamente un profesional de la salud puede determinar la enfermedad y sugerir un tratamiento específico." |
| PDF del resumen. `pdf/resumen.js` | Mismo texto largo en el pie de la hoja. |
| Diario de síntomas. `SymptomDiary.svelte` | Nota bajo la escala de 0 a 3. |
| Pie de las páginas de contenido. `LandingPage.svelte` | "Recuerda: únicamente un profesional de la salud puede hacer un diagnóstico de esta enfermedad y sugerir un tratamiento específico." |

---

## Paso 6. Contenido eliminado o cambiado por acuerdo

- **Quitado:** corticoides, remedios y perfiles de paciente; preguntas frecuentes de noche y estrés; causas climáticas.
- **Sin menciones de medicamentos, cremas ni remedios en todo el sitio** (no se recomienda nada que no indique un especialista). Cambios: test, pregunta de tratamiento y sus opciones ("Por mi cuenta", "Continuo", "Con seguimiento") en `campaign.js`; textos del resumen y del PDF en `cuestionario.js`; "Qué llevar a tu consulta" del directorio ("Lista de los tratamientos que ya has usado"); tarjeta "Encuentra tratamiento" de Inicio; pregunta frecuente de Tratamientos ("¿Puedo cambiar o suspender mi tratamiento?"); blog "Preparar consulta" ("lista de los tratamientos o productos que usas"). Se quitaron las tarjetas de detalle de especialidad ("Dermatología", "Alergología") en Tratamientos y en el directorio: no agregaban información (comentario del cliente); en Tratamientos queda el enlace "Encuentra a un especialista cerca de ti". La sección "Medidas cotidianas y remedios" y las tarjetas "Otras opciones" y "Terapias dirigidas" ya se habían quitado.
- **Testimonios 100 % anónimos** (`testimonios.js`, `Community.svelte`, `HomeLanding.svelte`): sin nombre, edad ni ciudad; el formulario ya no los pide. Los casos son de ejemplo (personas ficticias), sujetos a revisión médica de Novartis.
- **Diario con almacenamiento local** (`SymptomDiary.svelte`): los registros solo viven en el navegador, no se envían a ningún servidor.
- **Directorio: alergólogos o dermatólogos** (acuerdo "Ajustar directorio médico"). Título "Alergólogos y dermatólogos cerca de ti", descripción que dice que son los especialistas que valoran la urticaria crónica espontánea, sin inmunólogos (los 3 registros de "Inmunología Clínica" pasan a "Alergología e Inmunología Clínica" y se quita ese filtro). También en: título y descripción para buscadores (`pageMetadata.json`), aviso del resultado del test (`QuizModal.svelte`), textos del resumen del test (`cuestionario.js`), Inicio (dato clave, definición y cierre) y Testimonios. Los 20 registros del directorio ya **no tienen nombres de personas ni hospitales**: ahora dicen "Alergólogo/a · ejemplo" o "Dermatólogo/a · ejemplo" y "Consultorio por confirmar · ciudad" (`Directorio.svelte`). **Se necesitan datos reales:** si Novartis tiene un directorio de alergólogos y dermatólogos (nombre, cédula profesional, consultorio, teléfono, ubicación), se cargan en esa lista; si no existe, la página del directorio se oculta o se reemplaza antes de publicar.
- **Test:** nota de resultado y texto del PDF actualizados.

---

## Pendientes

> La lista vigente y ordenada está en `PENDIENTES-PARA-MANANA.md`.

1. Imágenes de las tarjetas de síntomas (revisar las candidatas de Gemini).
2. ID de contenido, fecha de vigencia y textos legales de Novartis.
3. Referencias en Recursos, Directorio, Testimonios, Diario y Acerca de (solo si el cliente las pide: tienen pocas afirmaciones científicas).
4. Fuente mexicana oficial y vigente (IMSS o Secretaría de Salud) para sumar a la lista.
5. Botones "Hacer Test de Autoevaluación" y "Buscar Especialista": propuesta de cambiar a "Hacer el test orientativo" y "Encuentra a un especialista cerca de ti".
6. Ciudad en inglés ("Mexico City") en la imagen principal.
7. Redirecciones de las direcciones viejas del blog, si ya estaban publicadas.
8. Retomar las capturas reales y actualizar la presentación de la propuesta.
9. Logo de Novartis: confirmar que el archivo entregado es el oficial.
10. Directorio médico: pedir a Novartis los datos reales de alergólogos y dermatólogos, si existen. Hoy son registros de ejemplo sin nombres.

---

## Dónde ver cada cambio y cómo llegar

El sitio corre en local con `pnpm dev`: **http://localhost:5173/**. Para ver otro momento del día o clima se agrega al final de cualquier dirección `?vista=<escenario>&hora=<hora>`. Ejemplos: `?vista=dia&hora=15` (tarde) y `?vista=madrugada&hora=3` (madrugada, tema oscuro).

| Qué | Dirección | Cómo llegar |
|---|---|---|
| Comparador de tipos de urticaria | `/sintomas/` | Sección 02; pestañas "Qué la puede desencadenar", "Cuánto tiempo dura" y "Cómo se evalúa". |
| Corte de piel con línea de tiempo | `/sintomas/` | Sección 01, debajo de las cuatro tarjetas. Arrastra el deslizador de horas o usa los botones Habón (roncha) y Hinchazón (angioedema). |
| Muestras de piel en volumen | `/` | Sección "¿Qué es la Urticaria Crónica Espontánea?", a la derecha del texto. |
| Referencias IEEE y "Adaptado de" | `/`, `/sintomas/`, `/tratamiento/`, artículos del blog | Al final de cada página, bloque "Referencias"; las citas [1], [2] llevan a él. |
| Pie de página con logo, ID y leyendas | cualquier página | Bajar hasta el final. |
| Directorio sin nombres | `/directorio-medico/` | Mapa y lista de ejemplo. |
| Acerca de, "Cómo se guía este sitio" | `/sobre-nosotros/` | Sección 02, cuatro tarjetas con ícono. |
| **Medidor UAS7 en el Diario** | `/diario/` | Llena los 7 días con habones y comezón (0 a 3 cada uno) en la tabla; el medidor está debajo de la tabla. |
| **Quiz: Q2 con línea de semanas** | cualquier página con el botón del test (por ejemplo `/test/`) | "Iniciar Test de Síntomas" > Continuar (sin nombre) > marca "Habones (ronchas) en la piel" y "Comezón intensa" > Continuar. Es la pregunta "¿Cuánto tiempo llevas con estos síntomas?". |
| **Quiz: escala con flecha (habones y comezón)** | igual que arriba | Los dos pasos siguientes a Q2: "…cantidad de ronchas…" y "…qué tan intensa ha sido la comezón?". |
| **Quiz: Q13 momento del día** | igual que arriba | Justo después de Q12 ("¿Sueles presentar más ronchas en algún momento del día?"). |
| **Quiz: Q12 mitos** | igual que arriba | Más adelante en el recorrido, después de las preguntas de impacto: "Cuando te salen habones (ronchas), ¿cuáles de estos comentarios has recibido?". |
| Acerca de, sección 03 | `/sobre-nosotros/` | Sección 03, tres imágenes con nombre y dos tarjetas. |
| Leyenda de profesional de la salud | `/`, `/testimonios/`, `/blog/` y cualquier artículo | Bajar hasta el final de la página. |
| **Quiz: Q1 con espacios de imagen** | igual que arriba | "Iniciar Test de Síntomas" > Continuar (sin nombre): es la primera pregunta, con tres tarjetas con recuadro de imagen. |
| **Quiz: Q1b con espacios de imagen** | igual que arriba | Paso 2: marca "Hinchazón (angioedema)" y Continuar: aparecen las dos opciones con su recuadro de imagen. |
| **Quiz: Q17 y Q18, tratamiento previo** | igual que arriba | Después de Q13 viene "¿Has consultado previamente a un médico?"; con **No** cae directo en Q17 "¿Has tomado o aplicado algún tratamiento…?"; con **Sí** primero salen frecuencia y especialista. Q17 > **Sí** lleva a Q18 (tipo de tratamiento) y luego a la efectividad. |
| **Quiz: resultado con medidor UAS7 y tarjeta de mitos** | igual que arriba | Al terminar todas las preguntas. Para ver ambos, marca habones y comezón en el paso 2 y al menos un comentario en Q12. |
| **PDF del resumen** | igual que arriba | En el resultado, botón "Descargar resumen". |
| Pantalla de urgencia del test | igual que arriba | Paso 2: marca "Hinchazón (angioedema)" y en el siguiente elige "Sí — labios, lengua, garganta…". |

---

## Presentación: mapa del quiz

Archivo: `ajustes-colega/Propuesta-textos_Home-Sintomas-Tratamientos_con-mapa-del-quiz.pptx` (la propuesta original más 2 láminas nuevas al final, 28 y 29, como anexo; el original no se tocó). Se hizo con formas nativas editables y los mismos colores y tipografía de la propuesta.
- **Lámina 28, "Recorrido del test orientativo":** 5 etapas (síntomas, impacto en tu vida, causa y momento, historial y resultado) con las 22 preguntas, cuáles aparecen solo según respuestas anteriores, cuáles se modificaron por los comentarios del cliente (cuadro azul) y las dos salidas (ninguno de estos y urgencia).
- **Lámina 29, "El recorrido cambia con las respuestas":** tres caminos de ejemplo (corto de 2 pasos, típico de 11, largo de 22).
- Si el quiz cambia (por ejemplo Q18), hay que actualizar estas láminas; el script que las genera está en el scratchpad de la sesión (`build_quiz_map.py`).
- Pendiente: subirla a Google Slides y revisarla ahí.
