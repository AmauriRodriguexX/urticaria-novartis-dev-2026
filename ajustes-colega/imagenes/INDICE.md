# Índice de imágenes del sitio

Cada carpeta corresponde a **una tarjeta del sitio**. Se buscan hasta 10 imágenes por carpeta para poder elegir la mejor. La elegida se copia a `elegidas/` con el nombre de la tarjeta, y así sé exactamente dónde va.

| Carpeta | Tarjeta del sitio | Página y sección | Texto de la tarjeta | Texto alternativo (accesibilidad) |
|---|---|---|---|---|
| `1-ronchas` | **Ronchas (habones)** | Síntomas, sección 01 | «Elevaciones rojizas o rosadas en la piel que dan comezón.» | «Ronchas rojizas en la piel» |
| `2-hinchazon` | **Hinchazón (angioedema)** | Síntomas, sección 01 | «Puede aparecer en párpados, labios, manos o pies.» | «Hinchazón en párpados o labios» |
| `3-comezon` | **Comezón** | Síntomas, sección 01 | «Puede afectar las actividades diarias, el sueño y el trabajo.» | «Persona rascándose el antebrazo» |
| `4-ardor` | **Ardor** | Síntomas, sección 01 | «Sensación de quemazón en la zona afectada.» | «Piel con sensación de ardor» |

Dirección de la página: `/sintomas/`. Cada tarjeta se muestra con la imagen arriba en formato 16:9.

## Dónde más se reutiliza la imagen elegida
- **Ronchas** → Síntomas sección 03 «Guía visual», pregunta Q1 del quiz, ejemplos del diario.
- **Hinchazón** → Síntomas sección 03, preguntas Q1 y Q1b del quiz (descarte de urgencia), ejemplos del diario.
- **Comezón** → pregunta Q1 del quiz.
- **Ardor** → pregunta Q1 del quiz.

## Cómo se nombran los archivos
- Candidatas: `ronchas-01.jpg`, `ronchas-02.jpg` … hasta `ronchas-10.jpg`. Igual para `hinchazon-`, `comezon-` y `ardor-`. Si es PNG, `.png`.
- Elegidas: `elegidas/ronchas.jpg`, `elegidas/hinchazon.jpg`, `elegidas/comezon.jpg`, `elegidas/ardor.jpg`.

## Estado
| Tarjeta | Candidatas | Elegida (recomendación pre-copiada en `elegidas/`) |
|---|---|---|
| Ronchas | 10 (`ronchas-01.jpg` a `ronchas-10.jpg`) | `elegidas/ronchas.jpg` (copia de `ronchas-03.jpg` · CC0 · 4608×3456) |
| Hinchazón | 5 (`hinchazon-01.jpg` a `hinchazon-05.jpg`) | `elegidas/hinchazon.jpg` (copia de `hinchazon-01.jpg` · CC BY 3.0 de · 1891×2363) |
| Comezón | 9 (`comezon-01.jpg` a `comezon-09.jpg`) | `elegidas/comezon.jpg` (copia de `comezon-02.jpg` · Pexels License · 4592×3064) |
| Ardor | 10 (`ardor-01.jpg` a `ardor-10.jpg`) | `elegidas/ardor.jpg` (copia de `ardor-01.jpg` · Pexels License · 5184×2920) |

## Ficha de cada candidata (se llena en `CREDITOS.md`)
Archivo, qué muestra, tono de piel, licencia, autor y liga de la página original. Marcar si es foto de una persona real.

## Espacios de imagen del test (esperan imágenes de Novartis)
| Dónde | Espacio | Qué debe mostrar | Estado |
|---|---|---|---|
| Test, Q1b "¿La hinchazón es en labios, lengua o garganta, o te cuesta respirar?" | Opción 1: "Sí — labios, lengua, garganta, o me cuesta respirar" | Hinchazón en labios, lengua o garganta (imagen ilustrativa; evitar fotos alarmantes de personas reales) | "Imagen por definir" |
| Test, Q1b | Opción 2: "No — es en párpados, manos o pies" | Hinchazón en párpados, manos o pies | "Imagen por definir" |

Ambos espacios son 16:9 y se rellenan en `QuizModal.svelte` (variable `conImagen`, clase `.opt-media`). Si Novartis entrega las imágenes, se muestran dentro de esos recuadros con texto alternativo; las que ya existan para la hinchazón de Síntomas se pueden reutilizar.

| Test, Q1 "¿Has presentado alguno de los siguientes síntomas?" | Habones (ronchas) en la piel | Las mismas imágenes de habones de Síntomas sección 01 | "Imagen por definir" |
| Test, Q1 | Comezón intensa | La imagen de comezón de Síntomas sección 01 | "Imagen por definir" |
| Test, Q1 | Hinchazón (angioedema) | La imagen de hinchazón de Síntomas sección 01 | "Imagen por definir" |

En Q1, "Ninguno de estos" no lleva imagen y ocupa una fila completa debajo de las tres opciones con imagen.

| Acerca de, sección 03 | Habones (ronchas), Hinchazón (angioedema) y Comezón | Las mismas imágenes de Síntomas sección 01 (recuadros 4:3) | "Imagen por definir" |
