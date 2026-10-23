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
