// Genera el PDF del resumen para el médico.
// Todo se carga bajo demanda: jsPDF y las fuentes solo llegan cuando la persona descarga.
import { SITE_DOMAIN, SITE_NAME } from '../site.js'

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
    if (rep.seccion4) bloques.push(['COMENTARIOS SOBRE LA CAUSA', rep.seccion4])
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

  // ---------- paginación: si algo no cabe, sigue en otra hoja con el mismo fondo ----------
  const footTop = PAGE.h - 30
  const limite = footTop - 6
  const nuevaPagina = () => {
    doc.addPage([PAGE.w, PAGE.h])
    fill(COLORS.alabaster); doc.rect(0, 0, PAGE.w, PAGE.h, 'F')
    fill(COLORS.coral); doc.rect(0, 0, PAGE.w, 10, 'F')
    y = 24
  }
  const asegurar = h => { if (y + h > limite) nuevaPagina() }

  // ---------- tabla de respuestas ----------
  const tableRows = rows.slice(0, 14) // respuestas clínicas más relevantes
  const rowH = 7.5
  asegurar(5 + rowH * 2)
  set('bold', 8, COLORS.faint)
  doc.text('DETALLE DE RESPUESTAS', M, y)
  y += 5
  let primeraEnHoja = true
  tableRows.forEach(row => {
    if (y + rowH > limite) { nuevaPagina(); primeraEnHoja = true }
    fill(COLORS.card)
    doc.rect(M, y, CONTENT, rowH, 'F')
    if (!primeraEnHoja) {
      doc.setDrawColor(...COLORS.line)
      doc.setLineWidth(0.2)
      doc.line(M + 4, y, M + CONTENT - 4, y)
    }
    set('bold', 6.5, COLORS.faint)
    doc.text(String(row.etiqueta).toUpperCase(), M + 5, y + rowH / 2 + 1)
    set('normal', 8, COLORS.ink)
    const valor = doc.splitTextToSize(String(row.valor), CONTENT - 75)
    doc.text(valor[0], M + CONTENT - 5, y + rowH / 2 + 1, { align: 'right' })
    y += rowH
    primeraEnHoja = false
  })
  y += 8

  // ---------- escalación, solo si aplica ----------
  if (escalacion) {
    const texto = doc.splitTextToSize(escalacion, CONTENT - 14)
    const h = texto.length * 4.2 + 8
    asegurar(h)
    fill(COLORS.coralSoft)
    doc.roundedRect(M, y, CONTENT, h, 2.5, 2.5, 'F')
    fill(COLORS.coral)
    doc.rect(M, y, 1.6, h, 'F')
    set('normal', 8.5, COLORS.ink)
    doc.text(texto, M + 6, y + 5.5)
    y += h + 8
  }

  // ---------- la pregunta, solo si ya lleva tratamiento ----------
  if (pregunta) {
    const qH = 22
    asegurar(qH)
    fill(COLORS.cerulean)
    doc.roundedRect(M, y, CONTENT, qH, 2.5, 2.5, 'F')
    set('normal', 7.5, COLORS.white)
    doc.text('LA PREGUNTA QUE ABRE LA CONVERSACIÓN', M + 8, y + 7)
    set('bold', 12.5, COLORS.white)
    doc.text(pregunta, M + 8, y + 16)
    y += qH + 8
  }

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

  // ---------- pie en todas las hojas ----------
  const total = doc.getNumberOfPages()
  for (let n = 1; n <= total; n++) {
    doc.setPage(n)
    doc.setDrawColor(...COLORS.line)
    doc.setLineWidth(0.3)
    doc.line(M, footTop, M + CONTENT, footTop)
    set('normal', 7.5, COLORS.faint)
    const legal = doc.splitTextToSize(
      'Este resumen es orientativo y no constituye un diagnóstico. Fue generado a partir de respuestas propias en un autochequeo informativo. Únicamente un profesional de la salud puede hacer un diagnóstico de esta enfermedad y sugerir un tratamiento específico.',
      CONTENT
    )
    doc.text(legal, M, footTop + 6)
    set('bold', 8, COLORS.ink)
    doc.text(SITE_NAME, M, PAGE.h - 10)
    if (total > 1) { set('normal', 8, COLORS.faint); doc.text(`Hoja ${n} de ${total}`, PAGE.w / 2, PAGE.h - 10, { align: 'center' }) }
    set('bold', 8, COLORS.coral)
    doc.text(SITE_DOMAIN, M + CONTENT, PAGE.h - 10, { align: 'right' })
  }

  return doc
}

export async function descargarResumen(datos) {
  const doc = await construirPdf(datos)
  doc.save('resumen-para-mi-medico.pdf')
}
