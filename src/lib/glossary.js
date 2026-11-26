// Glosario con ayuda emergente (tooltip) para términos médicos.
// Cualquier aparición de un término de GLOSSARY en el texto del sitio (páginas, diario, test, textos que se agreguen después)
// se convierte sola en un término con ayuda: no hay que marcarlo a mano. Para excluir una zona, usar data-no-glossary.
// Para agregar otro término, basta con sumarlo aquí.

export const GLOSSARY = {
  UAS7: {
    title: '¿Qué es el UAS7?',
    text: 'Es la escala que usan los médicos para medir la actividad de la urticaria crónica durante 7 días consecutivos (Urticaria Activity Score). Cada día se califican las ronchas (0 a 3) y la comezón (0 a 3); la suma de los 7 días da un puntaje de 0 a 42. Entre más alto, más activa está la urticaria.'
  }
}

// Dentro de una liga no cabe un botón (el toque abriría la liga): ahí el término solo va en negritas.
const IN_LINK = 'a'
const SKIP = 'button, summary, select, option, textarea, input, label, script, style, noscript, svg, title, [contenteditable], [data-no-glossary], .glossary-tip'
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const PATTERN = new RegExp(`\\b(${Object.keys(GLOSSARY).map(escape).join('|')})\\b`, 'g')
const TIP_ID = 'glossary-tip'

export function initGlossary(root = document.body) {
  const added = new WeakMap() // nodo de texto original -> nodos que se insertaron después de él

  const termButton = word => {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'glossary-term'
    b.dataset.term = word
    b.setAttribute('aria-describedby', TIP_ID)
    b.setAttribute('aria-expanded', 'false')
    b.textContent = word
    return b
  }

  const plainTerm = word => {
    const s = document.createElement('strong')
    s.className = 'glossary-term-plain'
    s.textContent = word
    return s
  }

  // El nodo original se conserva (con el texto previo al término) para no romper las actualizaciones de Svelte.
  const processText = node => {
    const text = node.data
    PATTERN.lastIndex = 0
    if (!PATTERN.test(text)) return
    const parent = node.parentElement
    if (!parent || parent.closest(SKIP) || parent.closest('.glossary-term-plain')) return
    const inLink = Boolean(parent.closest(IN_LINK))
    const pieces = []
    let last = 0
    text.replace(PATTERN, (match, word, index) => {
      if (index > last) pieces.push(document.createTextNode(text.slice(last, index)))
      pieces.push(inLink ? plainTerm(word) : termButton(word))
      last = index + match.length
      return match
    })
    if (last < text.length) pieces.push(document.createTextNode(text.slice(last)))
    // el primer trozo de texto se queda en el nodo original
    const first = pieces[0].nodeType === 3 ? pieces.shift().data : ''
    node.data = first
    let ref = node
    for (const p of pieces) { ref.after(p); ref = p }
    added.set(node, pieces)
  }

  const scan = el => {
    if (el.nodeType === 3) return processText(el)
    if (el.nodeType !== 1 || el.closest?.(SKIP)) return
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const nodes = []
    while (walker.nextNode()) nodes.push(walker.currentNode)
    nodes.forEach(processText)
  }

  const observer = new MutationObserver(records => {
    for (const r of records) {
      if (r.type === 'characterData' && added.has(r.target)) {
        // Svelte cambió el texto: se quitan los trozos anteriores y se vuelve a procesar
        added.get(r.target).forEach(n => n.remove())
        added.delete(r.target)
        processText(r.target)
      } else if (r.type === 'characterData') {
        processText(r.target)
      } else {
        r.addedNodes.forEach(n => { if (!(n.classList && n.classList.contains('glossary-term'))) scan(n) })
      }
    }
    observer.takeRecords() // descarta los cambios hechos por el propio glosario
  })

  // Ayuda emergente única, compartida por todos los términos
  const tip = document.createElement('div')
  tip.id = TIP_ID
  tip.className = 'glossary-tip'
  tip.setAttribute('role', 'tooltip')
  tip.hidden = true
  document.body.appendChild(tip)

  let current = null
  let hideTimer = 0
  let shownTop = 0
  const place = btn => {
    const r = btn.getBoundingClientRect()
    const gutter = 16
    tip.style.maxWidth = `${Math.min(320, window.innerWidth - gutter * 2)}px`
    const w = tip.offsetWidth
    const h = tip.offsetHeight
    const left = Math.max(gutter, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - gutter))
    const below = r.bottom + 10 + h <= window.innerHeight - gutter
    tip.style.left = `${left}px`
    tip.style.top = `${below ? r.bottom + 10 : Math.max(gutter, r.top - h - 10)}px`
    tip.dataset.side = below ? 'below' : 'above'
  }
  const show = btn => {
    clearTimeout(hideTimer)
    const entry = GLOSSARY[btn.dataset.term]
    if (!entry) return
    if (current && current !== btn) current.setAttribute('aria-expanded', 'false')
    current = btn
    tip.innerHTML = ''
    const strong = document.createElement('strong')
    strong.textContent = entry.title
    const p = document.createElement('p')
    p.textContent = entry.text
    tip.append(strong, p)
    // los colores del sitio viven en el contenedor de la app (no en :root): se copian del término
    const cs = getComputedStyle(btn)
    for (const v of ['--ink', '--bg-solid', '--accent', '--font-barlow']) tip.style.setProperty(v, cs.getPropertyValue(v))
    tip.hidden = false
    btn.setAttribute('aria-expanded', 'true')
    place(btn)
    shownTop = btn.getBoundingClientRect().top
  }
  const hide = () => {
    tip.hidden = true
    if (current) current.setAttribute('aria-expanded', 'false')
    current = null
  }
  const hideSoon = () => { clearTimeout(hideTimer); hideTimer = setTimeout(hide, 150) }

  // En celular no hay "pasar el mouse": la ayuda se abre y se cierra con un toque
  const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const termOf = e => e.target instanceof Element ? e.target.closest('.glossary-term') : null
  const onOver = e => {
    if (!canHover()) return
    const b = termOf(e)
    if (b) show(b)
    else if (e.target instanceof Element && e.target.closest('.glossary-tip')) clearTimeout(hideTimer)
  }
  const onOut = e => { if (canHover() && (termOf(e) || (e.target instanceof Element && e.target.closest('.glossary-tip')))) hideSoon() }
  const onClick = e => {
    const b = termOf(e)
    if (b) { e.preventDefault(); e.stopPropagation(); !canHover() && current === b && !tip.hidden ? hide() : show(b) }
    else if (!(e.target instanceof Element && e.target.closest('.glossary-tip'))) hide()
  }
  // El foco abre la ayuda solo con teclado; con mouse o dedo la abre el clic/toque
  let pointerDown = false
  const onPointerDown = () => { pointerDown = true; setTimeout(() => { pointerDown = false }, 600) }
  const onFocusIn = e => { const b = termOf(e); if (b && !pointerDown) show(b) }
  const onFocusOut = e => { if (termOf(e)) hideSoon() }
  // Al tocar en celular el navegador puede mover un poco la página: solo se cierra con un scroll real
  const onScroll = () => {
    if (!current) return
    if (Math.abs(current.getBoundingClientRect().top - shownTop) > 40) hide()
    else place(current)
  }
  const onKey = e => { if (e.key === 'Escape' && current) { const b = current; hide(); b.focus() } }

  document.addEventListener('mouseover', onOver)
  document.addEventListener('mouseout', onOut)
  document.addEventListener('click', onClick, true)
  document.addEventListener('pointerdown', onPointerDown, true)
  document.addEventListener('focusin', onFocusIn)
  document.addEventListener('focusout', onFocusOut)
  document.addEventListener('keydown', onKey)
  document.addEventListener('scroll', onScroll, { capture: true, passive: true }) // también el scroll dentro del test
  window.addEventListener('resize', hide)

  scan(root)
  observer.observe(root, { childList: true, subtree: true, characterData: true })

  return () => {
    observer.disconnect()
    document.removeEventListener('mouseover', onOver)
    document.removeEventListener('mouseout', onOut)
    document.removeEventListener('click', onClick, true)
    document.removeEventListener('pointerdown', onPointerDown, true)
    document.removeEventListener('focusin', onFocusIn)
    document.removeEventListener('focusout', onFocusOut)
    document.removeEventListener('keydown', onKey)
    document.removeEventListener('scroll', onScroll, { capture: true })
    window.removeEventListener('resize', hide)
    tip.remove()
  }
}
