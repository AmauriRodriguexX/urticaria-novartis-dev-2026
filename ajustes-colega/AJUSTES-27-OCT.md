# Ajustes del 27 de octubre de 2026

Cambios en el sitio según los comentarios de [Novartis | Cambios Ronda 1](https://docs.google.com/spreadsheets/d/1GlH549rTqEKALDKiB8tv6fWJud1QdnFHfZ27KQqSHtc/edit?gid=0#gid=0). Entre paréntesis va la fila de la hoja.

Para revisar:
- Local: http://localhost:5173/
- Sitio de prueba: https://amaurirodriguexx.github.io/urticaria-novartis-dev-2026/ (se verá hasta que se suban los cambios)

## Home

Los puntos van en el orden en que aparecen en la página, de arriba hacia abajo.

### 1. Banner principal (fila 2)

Se pusieron los títulos del documento. Solo se corrigieron mayúsculas, y en "Noche y calor" decía "Haz de las Ronchas", que quedó como "Haz de la urticaria", igual que los demás. El texto de abajo del título no cambió.

| Momento | Título | Liga local |
|---|---|---|
| Mañana | Empieza tu día libre de comezón: Haz de la urticaria la parte más pequeña de tu vida | http://localhost:5173/?hora=9&temp=20 |
| Mañana y calor | Afronta el calor de la mañana sin ronchas: Haz de la urticaria la parte más pequeña de tu vida | http://localhost:5173/?hora=9&temp=32 |
| Mañana y frío | ¿Mañanas frías y piel irritada? Haz de la urticaria la parte más pequeña de tu vida | http://localhost:5173/?hora=9&temp=10 |
| Tarde | Recupera tu tarde y para la comezón: Haz de la urticaria la parte más pequeña de tu vida | http://localhost:5173/?hora=15&temp=20 |
| Tarde y calor | Que ni el calor ni la comezón detengan tu día: Haz de la urticaria la parte más pequeña de tu vida | http://localhost:5173/?hora=15&temp=32 |
| Tarde y frío | ¿Frío y comezón?: Haz de la urticaria la parte más pequeña de tu vida | http://localhost:5173/?hora=15&temp=10 |
| Noche | ¿La comezón no te deja dormir? Haz de la urticaria la parte más pequeña de tu vida | http://localhost:5173/?hora=23&temp=20 |
| Noche y calor | ¿El calor y la comezón no te dejan dormir? Haz de la urticaria la parte más pequeña de tu vida | http://localhost:5173/?hora=23&temp=30 |
| Noche y frío | ¿El frío y la comezón interrumpen tu sueño?: Haz de la urticaria la parte más pequeña de tu vida | http://localhost:5173/?hora=23&temp=8 |

En el sitio de prueba es la misma terminación, por ejemplo https://amaurirodriguexx.github.io/urticaria-novartis-dev-2026/?hora=9&temp=20

Si el título no cambia al abrir otra liga, hay que recargar con Ctrl+F5: el navegador guarda la ciudad y el clima por 30 minutos.

También quedaron cargados el título por defecto ("Que la comezón no te detenga: Haz de la urticaria la parte más pequeña de tu vida") y el de ubicación ("Ponle un alto a la comezón. Haz de la urticaria la parte más pequeña de tu vida en [ciudad]"). Hoy no se ven: el sitio siempre detecta la hora y muestra una de las nueve opciones de arriba. Falta definir cuándo sale el de ubicación.

### 2. Ciudad en español (fila 2)

La ciudad ya no sale en inglés: "Mexico City" ahora es "Ciudad de México", y Mérida, Querétaro, León o Cancún llevan acento. Se ve en el Directorio médico:
http://localhost:5173/directorio-medico/?ciudad=Mexico%20City

### 3. "¿Qué es la Urticaria Crónica Espontánea?" (fila 3)

Se quitó la cita de MedlinePlus. El párrafo queda solo con la [1].

### 4. "No es contagiosa ni es tu culpa" (fila 4)

- Antes: "Se trata de una respuesta interna del sistema inmune que hoy en día puede tratarse con éxito si acudes con un alergólogo o dermatólogo."
- Ahora: "Se trata de un padecimiento que hoy en día puede tratarse con éxito si acudes con un alergólogo o dermatólogo."

### 5. Dato "Sí tiene tratamiento" (fila 6)

Se quitó la cita.

### 6. Dibujo de la piel: "Urticaria pasajera / Urticaria crónica" (fila 5)

La cita [2] ahora es Yadav y Bajaj (2009). Antes era MedlinePlus.

### 7. Testimonios: "Miles de mexicanos…" (fila 7)

Se queda igual, como en la opción 1 del documento. No se puso el 3.4 %: "miles de mexicanos" se entiende mejor que un porcentaje.

### 8. Blog (fila 8)

- Antes: "Temas informativos de muestra para responder a tus dudas diarias:"
- Ahora: "Conoce más acerca de la urticaria crónica y cómo recuperar tu vida diaria con consejos prácticos."

Las tarjetas siguen diciendo "Artículo de muestra" porque los artículos todavía son borradores.

### 9. "Conoce a la comunidad 'Más que Urticaria'" (fila 9)

- Antes: "Somos una asociación creada por y para personas que conviven con la urticaria crónica en México."
- Ahora: "Somos un sitio informativo sobre la urticaria crónica espontánea en México."

El resto del párrafo sigue igual.

### 10. Referencias (fila 10)

Se quitó MedlinePlus. Quedan:
1. Tbakhi et al. (2025)
2. Yadav y Bajaj (2009)

El artículo nuevo que se sugirió (Revista Alergia México, `ram-818`) se agrega cuando se revise el PDF.

### 11. Letras de "Más que Urticaria" y similares (fila 11)

Se agrandaron en todo el sitio las etiquetas en mayúsculas que van arriba de los títulos:
- Etiquetas de sección ("Más que Urticaria", "Testimonios", "Tres pasos para empezar", etc.): de 12 a 15 px.
- Etiqueta arriba del título del banner: de 12 a 14 px en celular y de 13 a 15 px en computadora.
- "En esta página", el índice de Síntomas, Tratamientos y otras páginas: de 12 a 15 px.

Para verlo: http://localhost:5173/ y http://localhost:5173/sintomas/

### 12. Cierre "Da hoy el primer paso" (fila 12)

- Antes: "…Explora nuestras herramientas o encuentra a un alergólogo o dermatólogo hoy mismo."
- Ahora: "…Explora nuestras herramientas o encuentra a un especialista médico hoy mismo."

### Pendiente del Home

- Definir cuándo se muestra el título con ubicación.
- Agregar la fuente `ram-818` después de revisarla.

## Síntomas

Página: http://localhost:5173/sintomas/

### 1. Banner (fila 2)

Ahora solo cambia por momento del día; ya no hay versiones por calor o frío. Se corrigió "Uricaria" y las mayúsculas.

| Momento | Título | Liga local |
|---|---|---|
| Mañana | ¿Inicias tu mañana con comezón? Reconoce los síntomas de la urticaria crónica y recupera el control | http://localhost:5173/sintomas/?hora=9 |
| Tarde | Aprovecha la tarde. Reconoce los síntomas de la urticaria crónica y recupera el control | http://localhost:5173/sintomas/?hora=15 |
| Noche | Que la comezón no te quite el sueño. Reconoce los síntomas de la urticaria crónica y recupera el control | http://localhost:5173/sintomas/?hora=23 |

Título por defecto: "Síntomas de la urticaria crónica espontánea: Reconoce los brotes y recupera el control" (igual que en el Home, hoy no se ve porque siempre hay hora).

### 2. Tarjeta "Habones (ronchas)" (fila 5)

- Antes: "Elevaciones rojizas o rosadas en la piel que dan comezón."
- Ahora: "Elevaciones rojizas o rosadas en la piel, que provocan comezón."

### 3. Referencias cambiadas a la [4] Sachdeva et al. (filas 6, 9, 10 y 12)

- Tarjeta "Hinchazón (angioedema)" de la primera sección.
- "Guía visual": tarjetas de habones y de hinchazón.
- Pregunta "¿Cuánto dura un brote?".

### 4. "Dato clave" (fila 8)

Se quitó la referencia [1]; queda solo la [2].

### 5. "Reacción al roce" (fila 11)

Se eliminó la tarjeta.

### 6. "¿Cuánto dura un brote?" (fila 12)

- Antes: "La duración puede variar. Anota cuánto permanece cada roncha y cuándo aparecen otras."
- Ahora: "La duración puede variar. Las ronchas duran hasta 24 horas, mientras que la hinchazón (angioedema) puede durar hasta 72 horas. Anota cuánto permanece cada roncha y cuándo aparecen otras."

### 7. Uso de "UCE" (filas 3, 4, 13 y 14)

Se acordó escribir siempre "urticaria crónica espontánea (UCE)", nunca "UCE" sola.

**Subtítulo del banner (fila 3)**
- Antes: "Conocer los signos te ayuda a conversarlos con un profesional de la salud."
- Ahora: "Conoce los síntomas característicos de la urticaria crónica espontánea (UCE) y coméntalos con un profesional de la salud."

**Intro de "¿Cuáles son los síntomas…?" (fila 4)**
- Antes: "La urticaria crónica espontánea se caracteriza por habones (ronchas), comezón, hinchazón (angioedema) o ardor, que reaparecen durante más de seis semanas sin un desencadenante identificable. Solo un profesional de la salud puede diagnosticarla."
- Ahora: "Aprende a reconocer los síntomas de la urticaria crónica espontánea (UCE) y acércate a un profesional de la salud para encontrar un tratamiento adecuado:"

**Pregunta de cicatrices (fila 13)**
- Antes: "¿La urticaria deja cicatrices? Si una lesión persiste, deja marcas o te preocupa, pide una valoración profesional."
- Ahora: "¿Los brotes de urticaria crónica dejan cicatrices? Regularmente las ronchas de la urticaria crónica espontánea (UCE) no dejan cicatrices. Si una lesión persiste, deja marcas o te preocupa, pide una valoración profesional."

**Pregunta de contagio (fila 14)**
- Antes: "¿Es contagiosa? La urticaria no se transmite por contacto entre personas."
- Ahora: "¿La urticaria crónica es contagiosa? No. La urticaria crónica espontánea (UCE) no se transmite por contacto entre personas."

### 8. Animación "Qué pasa en la piel" (fila 7)

Se deja como está, pendiente de valoración médica. El equipo no encontró en las fuentes el proceso tal como lo explica la animación (líquido en la dermis, mastocitos, histamina) y le preocupa que parezca que la enfermedad tiene una sola causa. Las duraciones de ronchas y angioedema sí están citadas.

Ni Amauri ni Ben tenemos la certeza de que la explicación sea precisa, así que la dejamos para que la revise un médico. La opinión de Amauri es mantenerla, porque ayuda como referencia visual de lo que sucede en la piel.

Para verla: http://localhost:5173/sintomas/ (sección "¿Cuáles son los síntomas…?", corte de la piel con línea de tiempo).

## Tratamientos

Página: http://localhost:5173/tratamiento/

### 1. Banner (fila 2)

Ahora solo cambia por momento del día; ya no hay versiones por calor o frío.

| Momento | Título | Liga local |
|---|---|---|
| Mañana | Despierta sin comezón: Encuentra el tratamiento para la urticaria crónica espontánea | http://localhost:5173/tratamiento/?hora=9 |
| Tarde | ¿La comezón de la tarde interfiere con tus actividades? Habla con tu médico sobre tu tratamiento | http://localhost:5173/tratamiento/?hora=15 |
| Noche | Duerme sin ronchas ni comezón: Habla con tu médico sobre el tratamiento de la urticaria crónica espontánea | http://localhost:5173/tratamiento/?hora=23 |

También quedaron cargados el título por defecto ("Tratamientos para la urticaria crónica espontánea: Encuentra el camino hacia el alivio") y el de ubicación ("Tratamiento para la urticaria crónica espontánea en [ciudad]: Habla con tu médico hoy"). Igual que en el Home, falta definir cuándo sale el de ubicación.

### 2. Subtítulo del banner (fila 3)

- Antes: "…Un profesional de la salud puede valorar tu caso y orientarte sobre el tratamiento."
- Ahora: "…Un profesional de la salud puede valorar tu caso y orientarte sobre el tratamiento más adecuado para ti."

### 3. Botón "Buscar Especialista" (fila 4)

Ahora dice "Encuentra un especialista", en el banner y en el cierre de la página.

### 4. "¿Cómo se aborda la urticaria crónica?" (fila 5)

Se agregaron las dos fuentes que pidió el equipo al párrafo "La urticaria crónica espontánea no es una alergia pasajera…". Las referencias de la página quedan:
1. Tbakhi et al. (2025)
2. Hsieh y Lee (2017)
3. Sachdeva et al. (2011)

### 5. "¿Qué ocurre durante un brote?" (fila 6)

Se deja como está, pendiente de valoración médica. El equipo no pudo corroborar el proceso en la fuente (solo confirma que se libera histamina) y lo ve muy técnico.

No vamos a buscar más información ni a redactar otra explicación: esta parte necesita la revisión de un médico, igual que la animación de Síntomas.

Para verla: http://localhost:5173/tratamiento/ (segunda sección).

## Recursos

Página: http://localhost:5173/recursos-herramientas/

### 1. Tarjeta "Test de orientación" (fila 2)

- Antes: "Ordena lo que has observado y prepara preguntas para tu consulta."
- Ahora: "Realiza un test de menos de 5 minutos y conoce la intensidad de tus síntomas antes de consultar a un profesional de la salud."

Se ajustaron dos cosas del texto sugerido: "5 minutos" quedó como "menos de 5 minutos", igual que en el resto del sitio, y "evalúa la gravedad" quedó como "conoce la intensidad", porque el test es orientativo y no mide la gravedad.

### 2. Tarjeta "Diario de Síntomas" (fila 3)

- Antes: "Registra tus observaciones y llévalas a una consulta."
- Ahora: "Registra tus brotes diarios y lleva esta información a tu consulta médica."

## Directorio médico

Página: http://localhost:5173/directorio-medico/

### 1. Título con ubicación (fila 2)

Cuando el sitio detecta la ciudad, el título dice "Directorio de alergólogos y dermatólogos en [ciudad]". Si no la detecta, queda "Directorio de alergólogos y dermatólogos".

Para verlo: http://localhost:5173/directorio-medico/?ciudad=Monterrey

### 2. Texto bajo "Alergólogos y dermatólogos cerca de ti" (fila 3)

- Antes: "Los especialistas que valoran la urticaria crónica espontánea son alergólogos y dermatólogos. Llévale tu resumen a uno de ellos."
- Ahora: "Los especialistas que valoran la urticaria crónica espontánea son alergólogos y dermatólogos certificados. Para facilitar la consulta, lleva los resultados de tu test informativo y el registro de tu diario de síntomas."

"test informativo" y "diario de síntomas" llevan liga a sus páginas.

### 3. Recuadro "¿Qué llevar a tu consulta?" (fila 4)

Se eliminó. Estaba debajo del mapa.

### 4. "Lleva a la consulta tu resumen del test o tu Diario de Síntomas" (fila 5)

Se agregaron ligas en "resumen del test" y "Diario de Síntomas". Está en la sección "Cómo usar el directorio de médicos y clínicas".

## Nombre del test en todo el sitio

A partir de "test informativo" (hoja "directorio", fila 3) se homologó el nombre del test en todo el sitio. Antes se usaban varios: "test orientativo", "test de orientación", "Test de Síntomas" y "Test de Autoevaluación". Ahora todos dicen "test informativo".

| Dónde | Antes | Ahora |
|---|---|---|
| Home, botón del banner | Hacer Test de Autoevaluación | Hacer el test informativo |
| Home, "Tres pasos para empezar" | …realizando nuestro test de orientación… | …realizando nuestro test informativo… |
| Home, botón del cierre | Ir al Test de Síntomas | Ir al test informativo |
| Nota bajo el botón del banner | Este test es orientativo, no es un diagnóstico… | Este test es informativo, no es un diagnóstico… |
| Síntomas, botón del banner | Comenzar Test de Síntomas | Comenzar el test informativo |
| Síntomas, pregunta de contagio | Hacer el test orientativo | Hacer el test informativo |
| Página del test, título | Test orientativo sobre urticaria crónica espontánea | Test informativo sobre urticaria crónica espontánea |
| Página del test, botón | Iniciar Test de Síntomas | Iniciar el test informativo |
| Página del test, banner por hora | …Haz el test orientativo | …Haz el test informativo |
| Recursos, tarjeta | Test de orientación | Test informativo |
| Recursos, cierre | Usa el test orientativo para preparar… | Usa el test informativo para preparar… |
| Directorio, botón del cierre | Ir al Test de Síntomas | Ir al test informativo |
| Acerca de, sección 03 | Usa el test de orientación y el Diario… | Usa el test informativo y el Diario… |
| Título y descripción para buscadores (Google) | test orientativo | test informativo |

No se cambiaron las frases que describen el resultado, como "Este resultado es solo orientativo y no es un diagnóstico", ni el resumen en PDF: ahí no se nombra el test, se aclara que el resultado no es un diagnóstico.

## Acerca de

Página: http://localhost:5173/sobre-nosotros/

### 1. Título de la sección 02 (fila 2)

- Antes: "Cómo se guía este sitio"
- Ahora: "Nuestros principios"

### 2. Tarjetas de principios (filas 3 a 6)

| Antes | Ahora |
|---|---|
| **Claro.** Explicamos cada término médico con palabras sencillas. | **Claridad.** Buscamos explicar los términos médicos relacionados con la urticaria crónica espontánea (UCE) de manera simple y fácil de entender. |
| **Responsable.** Información general, no un diagnóstico. | **Informativos.** Buscamos informar sobre la urticaria crónica espontánea (UCE) y acercar a las personas a especialistas que puedan diagnosticarla. |
| **Privado.** Tu diario se guarda solo en tu navegador. | Sin cambio. |
| **Transparente.** Te avisamos lo que aún está en preparación. | **Empáticos.** Sabemos por lo que pasas. Ofrecemos recursos que pueden ayudarte. |

"UCE" se escribió como "urticaria crónica espontánea (UCE)", y "diagnosticarlos" quedó como "diagnosticarla" (la enfermedad). Se cambiaron los íconos de "Informativos" y "Empáticos" para que correspondan al nuevo texto.

### 3. Pregunta "¿Tiene algún costo acceder a los recursos de la web?" (fila 8)

- Antes: "Los recursos informativos disponibles en este sitio no requieren registro."
- Ahora: "No. Todos los recursos de la web son completamente gratuitos, con fines informativos."

### 4. Sección 03 "¿Qué puedes hacer en el sitio?" (fila 7)

Se eliminó, como sugiere el equipo, porque no va con el objetivo de la página. Tenía las tres imágenes de síntomas y las tarjetas "Preparar la consulta" y "Encuentra a un especialista cerca de ti". Las preguntas frecuentes ahora son la sección 03.

Nota: esta sección se había rehecho el 23 de octubre a partir de una captura del cliente. Si el cliente pregunta, se puede recuperar del respaldo `respaldo/src-2026-10-27-antes-acerca-de.zip`.
