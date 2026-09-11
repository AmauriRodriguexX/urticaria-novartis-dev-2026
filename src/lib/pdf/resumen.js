// Genera el PDF del resumen para el médico.
// Todo se carga bajo demanda: jsPDF y las fuentes solo llegan cuando la persona descarga.

const COLORS = {
  ink: [34, 56, 63],
  soft: [90, 106, 109],
  faint: [139, 150, 152],
  coral: [238, 112, 103],
  coralSoft: [253, 232, 230],
  cerulean: [0, 129, 168],
  alabaster: [240, 238, 230],
  card: [255, 253, 248],
  line: [220, 216, 201],
  white: [255, 255, 255]
}

const PAGE = { w: 216, h: 279 }          // Carta, en mm
const M = 18                              // margen
const CONTENT = PAGE.w - M * 2

export async function construirPdf({ lectura, rows, pregunta, escalacion }) {
  const [{ jsPDF }, bold, regular] = await Promise.all([
    import('jspdf'),
    import('./barlow-bold.js'),
    import('./barlow-regular.js')
  ])

  const doc = new jsPDF({ unit: 'mm', format: [PAGE.w, PAGE.h], compress: true })
  doc.addFileToVFS('Barlow-Bold.ttf', bold.default)
  doc.addFont('Barlow-Bold.ttf', 'Barlow', 'bold')
  doc.addFileToVFS('Barlow-Regular.ttf', regular.default)
  doc.addFont('Barlow-Regular.ttf', 'Barlow', 'normal')

  const set = (weight, size, color) => {
    doc.setFont('Barlow', weight)
    doc.setFontSize(size)
    doc.setTextColor(...color)
  }
  const fill = (c) => doc.setFillColor(...c)

  // ---------- fondo ----------
  fill(COLORS.alabaster)
  doc.rect(0, 0, PAGE.w, PAGE.h, 'F')

  // ---------- cabecera ----------
  fill(COLORS.coral)
  doc.rect(0, 0, PAGE.w, 34, 'F')

  set('bold', 10, COLORS.white)
  doc.text('RESUMEN PARA MI MÉDICO', M, 15.5)
  set('normal', 8.5, COLORS.white)
  doc.text('Autochequeo orientativo de urticaria', M, 20.5)

  const fecha = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
  set('normal', 8.5, COLORS.white)
  doc.text(fecha, PAGE.w - M, 20.5, { align: 'right' })

  let y = 50

  // ---------- lectura orientativa ----------
  set('bold', 8, COLORS.coral)
  doc.text('LECTURA ORIENTATIVA Y PERFIL CLÍNICO', M, y)
  y += 7

  set('bold', 15, COLORS.ink)
  const titulo = doc.splitTextToSize(lectura.titulo, CONTENT)
  doc.text(titulo, M, y)
  y += titulo.length * 6.8 + 2

  set('normal', 9.5, COLORS.soft)
  const detalle = doc.splitTextToSize(lectura.detalle, CONTENT)
  doc.text(detalle, M, y)
  y += detalle.length * 4.8 + 8

  // ---------- secciones clínicas de Ben (si están disponibles) ----------
  if (lectura.reporte) {
    const rep = lectura.reporte
    const bloques = []
    if (rep.seccion2) bloques.push(['SÍNTOMAS REPORTADOS', rep.seccion2])
    if (rep.seccion3) bloques.push(['CALIDAD DE VIDA', rep.seccion3])
    if (rep.seccion4) bloques.push(['DETONANTES', rep.seccion4])
    if (rep.seccion5) bloques.push(['HISTORIAL DE TRATAMIENTO', rep.seccion5])

    if (bloques.length > 0) {
      bloques.forEach(([etq, txt]) => {
        set('bold', 7, COLORS.cerulean)
        doc.text(etq, M, y)
        y += 4.2
        set('normal', 8.5, COLORS.ink)
        const t = doc.splitTextToSize(txt, CONTENT)
        doc.text(t, M, y)
        y += t.length * 4.2 + 4.5
      })
      y += 2
    }
  }

  // ---------- tabla ----------
  set('bold', 8, COLORS.faint)
  doc.text('DETALLE DE RESPUESTAS', M, y)
  y += 5

  // La tabla se ajusta al número de preguntas: el cuestionario cambia según el
  // contexto y contenidos puede agregar más, así que nada va a medida fija.
  const reservado = 46 + (escalacion ? 22 : 0)   // bloque de pregunta y, si aplica, escalación
  const espacioLibre = PAGE.h - 40 - y - reservado
  const rowH = Math.max(9, Math.min(13, espacioLibre / Math.max(rows.length, 1)))
  const compacta = rowH < 12
  const tableTop = y
  fill(COLORS.card)
  doc.roundedRect(M, y, CONTENT, rowH * rows.length, 3, 3, 'F')

  rows.forEach((row, i) => {
    const top = tableTop + i * rowH
    if (i > 0) {
      doc.setDrawColor(...COLORS.line)
      doc.setLineWidth(0.2)
      doc.line(M + 6, top, M + CONTENT - 6, top)
    }
    if (compacta) {
      // etiqueta a la izquierda y respuesta a la derecha, como en pantalla
      set('bold', 7, COLORS.faint)
      doc.text(String(row.etiqueta).toUpperCase(), M + 6, top + rowH / 2 + 1.2)
      set('normal', 9.5, COLORS.ink)
      const valor = doc.splitTextToSize(String(row.valor), CONTENT - 82)
      doc.text(valor[0], M + CONTENT - 6, top + rowH / 2 + 1.2, { align: 'right' })
    } else {
      set('bold', 7.5, COLORS.faint)
      doc.text(String(row.etiqueta).toUpperCase(), M + 6, top + 5.4)
      set('normal', 11, COLORS.ink)
      const valor = doc.splitTextToSize(String(row.valor), CONTENT - 12)
      doc.text(valor[0], M + 6, top + 10.4)
    }
  })
  y = tableTop + rowH * rows.length + 12

  // ---------- escalación, solo si aplica ----------
  if (escalacion) {
    const texto = doc.splitTextToSize(escalacion, CONTENT - 14)
    const h = texto.length * 4.8 + 10
    fill(COLORS.coralSoft)
    doc.roundedRect(M, y, CONTENT, h, 3, 3, 'F')
    fill(COLORS.coral)
    doc.rect(M, y, 1.6, h, 'F')
    set('normal', 9.5, COLORS.ink)
    doc.text(texto, M + 8, y + 7)
    y += h + 12
  }

  // ---------- la pregunta ----------
  fill(COLORS.cerulean)
  const qH = 26
  doc.roundedRect(M, y, CONTENT, qH, 3, 3, 'F')
  set('normal', 8.5, COLORS.white)
  doc.text('LA PREGUNTA QUE ABRE LA CONVERSACIÓN', M + 8, y + 9)
  set('bold', 14, COLORS.white)
  doc.text(pregunta, M + 8, y + 19)
  y += qH + 14

  // ---------- espacio para el médico, solo si sobra hoja ----------
  const notasFin = PAGE.h - 38
  if (notasFin - y > 22) {
    set('bold', 8, COLORS.faint)
    doc.text('NOTAS DE MI MÉDICO', M, y)
    y += 6
    doc.setDrawColor(...COLORS.line)
    doc.setLineWidth(0.2)
    const nLineas = Math.max(2, Math.floor((notasFin - y) / 9))
    const paso = (notasFin - y) / nLineas
    for (let i = 1; i <= nLineas; i++) doc.line(M, y + i * paso, M + CONTENT, y + i * paso)
  }

  // ---------- pie ----------
  const footTop = PAGE.h - 30
  doc.setDrawColor(...COLORS.line)
  doc.setLineWidth(0.3)
  doc.line(M, footTop, M + CONTENT, footTop)

  set('normal', 7.5, COLORS.faint)
  const legal = doc.splitTextToSize(
    'Este resumen es orientativo y no constituye un diagnóstico. Fue generado a partir de respuestas propias en un autochequeo informativo. Solo un profesional de la salud puede valorar el caso.',
    CONTENT
  )
  doc.text(legal, M, footTop + 6)

  return doc
}

export async function descargarResumen(datos) {
  const doc = await construirPdf(datos)
  doc.save('resumen-para-mi-medico.pdf')
}
