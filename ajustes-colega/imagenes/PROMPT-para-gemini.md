# Prompt para Gemini (búsqueda profunda de imágenes)

Copia todo lo que está dentro del recuadro y pégalo en Gemini.

```
Necesito que hagas una búsqueda profunda de IMÁGENES REALES (fotografías) para un sitio web informativo sobre urticaria crónica espontánea (UCE) patrocinado por una farmacéutica. El sitio está en español y se dirige a pacientes.

OBJETIVO
Encontrar hasta 10 candidatas por cada una de estas 4 tarjetas, para que podamos elegir la mejor de cada una. Cada tarjeta muestra una imagen en formato horizontal 16:9 arriba del texto.

TARJETA 1 · RONCHAS (habones)
Texto que acompaña: «Elevaciones rojizas o rosadas en la piel que dan comezón.»
Qué mostrar: ronchas en la piel (brazo, torso, espalda), con forma y tamaño variables, bien visibles.

TARJETA 2 · HINCHAZÓN (angioedema)
Texto que acompaña: «Puede aparecer en párpados, labios, manos o pies.»
Qué mostrar: hinchazón de párpados, labios, manos o pies. Imágenes de párpados o labios son las más útiles.

TARJETA 3 · COMEZÓN
Texto que acompaña: «Puede afectar las actividades diarias, el sueño y el trabajo.»
Qué mostrar: una persona rascándose la piel (brazo, antebrazo, cuello). No hace falta que se vea una lesión.

TARJETA 4 · ARDOR
Texto que acompaña: «Sensación de quemazón en la zona afectada.»
Qué mostrar: piel con enrojecimiento y sensación de ardor, o una persona tocándose la zona con molestia.
IMPORTANTE: NO uses imágenes de quemadura de sol, de exposición al sol o al calor, ni de playa. Sugieren que el sol o el calor causan la enfermedad, y eso es falso: los médicos de la farmacéutica aclararon que el clima NO es causa de la urticaria crónica espontánea.

REGLAS QUE NO SE PUEDEN SALTAR
1. Solo FOTOGRAFÍAS REALES. Nada generado por inteligencia artificial (política de la farmacéutica). Si tienes duda del origen, descártala.
2. Licencia que permita USO COMERCIAL: dominio público, CC0 o CC BY. NO uses CC BY-NC (no comercial) ni CC BY-ND (sin derivadas). CC BY-SA solo como último recurso y avisándome, porque obliga a compartir igual.
3. Verifica la licencia en la página de cada imagen, no en los resultados de búsqueda.
4. Resolución mínima de 1200 píxeles de ancho.
5. Muestra distintos tonos de piel (claro, medio y oscuro) dentro de cada tarjeta.
6. Solo imágenes de ronchas, hinchazón, etc. que sean compatibles con urticaria crónica espontánea. Evita las de urticaria por frío, por calor, por presión o colinérgica, porque son otros tipos. Evita también las asociadas a otras enfermedades (cáncer, infecciones, quemaduras, eccema).
7. Sin rostros identificables de menores de edad.
8. Sin marcas, logotipos, texto encima ni barras que tapen los ojos.
9. Prefiero pocas imágenes buenas a muchas dudosas. Si no encuentras 10 buenas, entrégame las que sí cumplan.

DÓNDE BUSCAR
Wikimedia Commons (categorías Urticaria y Angioedema), NIH/NIAID, Wellcome Collection, Unsplash, Pexels y bancos de stock con licencia comercial y modelos con permiso firmado.

CÓMO ENTREGARME EL RESULTADO
Una tabla por tarjeta, con estas columnas: número (01 a 10), liga directa de la página de la imagen, qué muestra, tono de piel, licencia exacta, autor, resolución, y si es foto de una persona real (sí/no). Al final, dime cuál recomiendas por tarjeta y por qué, y cuáles son dudosas.
```

## Cómo guardar lo que entregue
1. Las imágenes se descargan en la carpeta de cada tarjeta, con estos nombres: `ronchas-01.jpg` … `ronchas-10.jpg` (igual para `hinchazon-`, `comezon-` y `ardor-`). Todas están dentro de `ajustes-colega\imagenes\`.
2. Los datos de cada una se anotan en `CREDITOS.md`.
3. Cuando se elija la mejor de cada tarjeta, se copia a `elegidas\` como `ronchas.jpg`, `hinchazon.jpg`, `comezon.jpg` o `ardor.jpg`. El archivo `INDICE.md` dice dónde va cada una en el sitio.
