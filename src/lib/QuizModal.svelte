<script>
  import { onMount, tick } from 'svelte'
  import { questions } from './campaign.js'
  import { construirFlujo, esUrgencia, leerResultado, construirResumen, ESCALACION, PREGUNTA_CLAVE, mostrarPreguntaClave } from './cuestionario.js'
  import { DARK } from './context.js'
  import Icon from './Icon.svelte'
  import Directorio from './Directorio.svelte'
  import UasGauge from './UasGauge.svelte'
  import ScaleSelect from './ScaleSelect.svelte'
  export let ctx
  export let onClose
  export let initialPhase = 'quiz'

  let phase = initialPhase, step = 0, answers = {}, copied = false, downloaded = false
  let dialog, heading
  let indice = 0           // posición del modal dentro del historial; viaja DENTRO del estado
  // Identificador de esta apertura del modal. Sin él, una entrada de historial
  // sobrante de una apertura anterior (o de antes de recargar la página) revivía
  // el modal en una pantalla que ya no correspondía.
  const sesion = Math.random().toString(36).slice(2)
  let cerrado = false
  let limpiarAlVolver = false
  let temporizadorCierre

  $: dark = DARK.has(ctx)
  $: flow = construirFlujo(answers, ctx)
  $: id = flow[step]
  $: q = questions[id]
  // Habones y comezón (UAS7): la persona coloca la flecha en una escala de colores y luego continúa
  $: isScale = id === 'q3' || id === 'q4'
  // Q1 y Q1b llevan un espacio de imagen por opción (las imágenes las entrega Novartis); ver ajustes-colega/imagenes/INDICE.md
  $: conImagen = id === 'q1b' || id === 'q1'
  // Mitos sobre la causa que la persona ha escuchado (Q12), sin contar "Nadie me ha dicho nada"
  $: mitos = (answers.q12 || []).filter(v => v !== 'sin_patron')
  $: lectura = leerResultado(answers)
  $: rows = construirResumen(answers, ctx, questions)
  $: escalacion = ESCALACION.cuando(answers)
  $: preguntaClave = mostrarPreguntaClave(answers) ? PREGUNTA_CLAVE : null


  // ---------- flujo ----------
  function select(value) {
    if (q[0] === 'multi') {
      const old = answers[id] || []
      let updated = []
      // La opción "ninguno" desmarca las demás; elegir otra quita "ninguno"
      const exclusiva = { q1: 'ninguno', q12: 'sin_patron' }[id]
      if (exclusiva) {
        if (value === exclusiva) {
          updated = old.includes(exclusiva) ? [] : [exclusiva]
        } else {
          const filtered = old.filter(x => x !== exclusiva)
          updated = filtered.includes(value) ? filtered.filter(x => x !== value) : [...filtered, value]
        }
      } else {
        updated = old.includes(value) ? old.filter(x => x !== value) : [...old, value]
      }
      answers = { ...answers, [id]: updated }
      return
    }

    const next = { ...answers, [id]: value }
    if (id === 'q1' && !next.q1?.includes('hinchazon')) delete next.q1b
    answers = next
    if (esUrgencia(id, value)) { go('urgent', step); return }
    advance()
  }

  function handleTextInput(e) {
    answers = { ...answers, [id]: e.target.value }
  }
  function advance() {
    const siguiente = construirFlujo(answers, ctx)
    if (step + 1 >= siguiente.length) go('result', step); else go('quiz', step + 1)
  }
  function back() { history.back() }

  // Empezar de nuevo vuelve a la PRIMERA pantalla del quiz en lugar de apilar otra
  // entrada; si no, el historial acumulaba el recorrido viejo y "atrás" paseaba por
  // pantallas ya abandonadas.
  function restart() {
    if (indice > 0) { limpiarAlVolver = true; history.go(-indice) }
    else { answers = {}; aplicar('quiz', 0) }
  }

  // ---------- historial ----------
  // Cada pantalla del modal es una entrada. El índice viaja dentro del propio estado,
  // así que no puede desincronizarse: para cerrar siempre basta con retroceder
  // indice + 1 posiciones, sea cual sea el camino que haya seguido la persona.
  function aplicar(nuevaFase, nuevoPaso) { phase = nuevaFase; step = nuevoPaso; enfocarTitulo() }

  function go(nuevaFase, nuevoPaso) {
    aplicar(nuevaFase, nuevoPaso)
    indice += 1
    history.pushState({ quiz: { phase, step, i: indice, s: sesion } }, '')
  }

  let isClosing = false

  function handleBackdrop(e) {
    if (e.target === dialog) close()
  }

  function onPop(e) {
    const s = e.state?.quiz
    if (s && s.s === sesion) {
      indice = s.i
      aplicar(s.phase, s.step)
      if (limpiarAlVolver) { limpiarAlVolver = false; answers = {} }
      return
    }
    // Salimos del modal por el botón atrás del navegador con animación suave
    if (!isClosing) {
      isClosing = true
      setTimeout(cerrarYa, 280)
    } else {
      cerrarYa()
    }
  }

  function close() {
    if (cerrado || isClosing) return
    isClosing = true
    setTimeout(() => {
      if (cerrado) return
      history.go(-(indice + 1))
      temporizadorCierre = setTimeout(cerrarYa, 350)
    }, 280)
  }

  function cerrarYa() {
    if (cerrado) return
    cerrado = true
    clearTimeout(temporizadorCierre)
    onClose()
  }

  async function enfocarTitulo() { await tick(); heading?.focus?.() }

  // ---------- resultado ----------
  function summary() {
    return `RESUMEN PARA MI MÉDICO — Autochequeo de urticaria\n(Orientativo. Mi médico confirma.)\n\n${lectura.titulo}\n\n${rows.map(r => `• ${r.etiqueta}: ${r.valor}`).join('\n')}${preguntaClave ? `\n\nMi pregunta clave: ${preguntaClave}` : ''}`
  }
  let downloading = false
  async function download() {
    if (downloading) return
    downloading = true
    try {
      const { descargarResumen } = await import('./pdf/resumen.js')
      await descargarResumen({
        lectura,
        rows,
        pregunta: preguntaClave,
        escalacion: escalacion ? ESCALACION.enPdf : null
      })
      downloaded = true
      setTimeout(() => { downloaded = false }, 2500)
    } catch (err) {
      console.error('Error al generar PDF:', err)
    } finally {
      downloading = false
    }
  }
  // El portapapeles moderno falla en contextos no seguros, sin foco o en navegadores
  // viejos; sin respaldo el botón no hacía nada y no avisaba.
  async function copy() {
    const texto = summary()
    let ok = false
    try {
      await navigator.clipboard.writeText(texto)
      ok = true
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = texto
        ta.setAttribute('readonly', '')
        ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0'
        document.body.appendChild(ta)
        ta.select()
        ok = document.execCommand('copy')
        ta.remove()
      } catch { ok = false }
    }
    if (ok) { copied = true; setTimeout(() => copied = false, 2200) }
  }

  // ---------- foco y scroll ----------
  function trapTab(e) {
    if (e.key !== 'Tab' || !dialog) return
    const f = [...dialog.querySelectorAll('button:not([disabled]),a[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null)
    if (!f.length) return
    const first = f[0], last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
  onMount(() => {
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    window.addEventListener('popstate', onPop)
    indice = 0
    // Si la entrada actual arrastra un estado de modal (por ejemplo, tras recargar
    // con el quiz abierto), lo limpiamos antes de empezar.
    if (history.state?.quiz) history.replaceState({}, '')
    history.pushState({ quiz: { phase: initialPhase, step: 0, i: 0, s: sesion } }, '')
    return () => {
      cerrado = true
      clearTimeout(temporizadorCierre)
      document.body.style.overflow = ''
      window.removeEventListener('popstate', onPop)
      window.scrollTo(0, scrollY)
    }
  })
</script>

<svelte:window on:keydown={(e) => { if (e.key === 'Escape') close(); trapTab(e) }} />

<div
  class="modal"
  class:is-closing={isClosing}
  role="dialog"
  aria-modal="true"
  tabindex="-1"
  aria-label="Orientación médica y autochequeo"
  bind:this={dialog}
  on:click={handleBackdrop}
  on:keydown={(e) => { if (e.key === 'Escape') close() }}
>
  <div class="modal-inner" class:is-wide={phase === 'map'}>
    <header class="modal-head">
      <span class="mini-glass" aria-hidden="true"></span>
      <b>{phase === 'map' ? 'Especialistas y Consulta' : 'Tu vida es más grande · 1 min'}</b>
      <button class="close" aria-label="Cerrar" on:click={close}><Icon name="close" size={22} /></button>
    </header>

    {#if phase === 'quiz'}
      <div class="quiz">
        <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax={flow.length} aria-valuenow={step + 1}><i style={`width:${((step + 1) / flow.length) * 100}%`}></i></div>
        <p class="step">Paso {step + 1}</p>
        <h2 tabindex="-1" bind:this={heading}>{q[1]}</h2>
        {#if q[2]}<p class="sub">{q[2]}</p>{/if}
        {#if id === 'q2'}
          <div class="weeks" aria-label="Línea de tiempo de 0 a 12 semanas, con la marca de 6 semanas">
            <div class="weeks-track" aria-hidden="true">
              <span class="weeks-short"></span><span class="weeks-long"></span>
              <span class="weeks-mark"><em>6 semanas</em></span>
            </div>
            <div class="weeks-axis" aria-hidden="true"><span>0</span><span>12 semanas o más</span></div>
            <p class="weeks-note">La urticaria crónica espontánea se identifica cuando los síntomas se presentan durante <strong>6 semanas o más</strong>. <a href="https://medlineplus.gov/spanish/ency/article/000845.htm" target="_blank" rel="noopener">Fuente [1]<span class="sr-only"> (se abre en otra pestaña)</span></a></p>
          </div>
        {/if}
        {#if q[0] === 'text'}
          <div class="input-row" style="margin: 1.5rem 0;">
            <input
              type="text"
              class="text-input"
              placeholder="Escribe tu nombre o déjalo en blanco"
              value={answers[id] || ''}
              on:input={handleTextInput}
              on:keydown={(e) => { if (e.key === 'Enter') advance() }}
              style="width: 100%; padding: 0.85rem 1.1rem; border-radius: 12px; border: 1px solid var(--line, #dcd8c9); background: var(--card, #fff); font-size: 1.05rem; color: var(--ink, #22383f);"
            />
          </div>
        {:else if isScale}
          <ScaleSelect options={q[3]} value={answers[id]} nombre={q[1]} onchange={(v) => (answers = { ...answers, [id]: v })} />
        {:else}
          <div class="options" class:options-grid={q[3] && q[3].length >= 4 && !conImagen} class:options-media={conImagen} class:options-q1={id === 'q1'} role={q[0] === 'multi' ? 'group' : 'radiogroup'}>
            {#each q[3] as o}
              {@const on = q[0] === 'multi' ? (answers[id] || []).includes(o[0]) : answers[id] === o[0]}
              <button class:chosen={on} class:opt-none={o[0] === 'ninguno'} role={q[0] === 'multi' ? 'checkbox' : 'radio'} aria-checked={on} on:click={() => select(o[0])}>
                {#if conImagen && o[0] !== 'ninguno'}<span class="opt-media" aria-hidden="true"><em>Imagen por definir</em></span>{/if}
                <span class="opt-row"><i aria-hidden="true">{#if on}<Icon name="check" size={14} />{/if}</i>
                <span><strong>{o[1]}</strong>{#if o[2]}<small>{o[2]}</small>{/if}</span></span>
              </button>
            {/each}
          </div>
        {/if}
        <div class="quiz-nav" class:has-next={q[0] === 'multi' || q[0] === 'text' || isScale}>
          <button class="nav-back" on:click={step ? back : close}>
            {#if step}<Icon name="arrow_back" size={18} /><span>Atrás</span>{:else}<span>Cancelar</span>{/if}
          </button>
          {#if q[0] === 'multi' || q[0] === 'text' || isScale}
            <button class="button nav-next" on:click={advance} disabled={isScale && answers[id] == null}><span>Continuar</span><Icon name="arrow_forward" size={20} /></button>
          {/if}
        </div>
      </div>

    {:else if phase === 'urgent'}
      <div class="urgent">
        <div class="warning" aria-hidden="true"><Icon name="emergency" size={34} /></div>
        <h2 tabindex="-1" bind:this={heading}>Esto puede ser una urgencia.</h2>
        <p>La hinchazón de labios, lengua o garganta — o la dificultad para respirar — necesita atención médica ahora. No esperes: busca ayuda o llama a emergencias de inmediato.</p>
        <a class="button" href="tel:911"><Icon name="call" size={20} /><span>Llamar a emergencias (911)</span></a>
        <button class="text" on:click={() => go('map', step)}><Icon name="location_on" size={18} /> Ver especialistas</button>
        <p class="urgent-note"><small>Esta pantalla no es un diagnóstico. Únicamente un profesional de la salud puede determinar la enfermedad y sugerir un tratamiento específico.</small></p>
      </div>

    {:else if phase === 'result'}
      <div class="result">
        <p class="eyebrow accent">Ya diste el primer paso para ponerla en su lugar.</p>
        <h2 tabindex="-1" bind:this={heading}>{lectura.titulo}</h2>
        <p class="sub">{lectura.detalle}</p>
        <p class="sub quiz-legal-note"><small>Este resultado es solo orientativo y no es un diagnóstico. Recuerda: únicamente un profesional de la salud puede hacer un diagnóstico de esta enfermedad y sugerir un tratamiento específico.</small></p>

        {#if answers.q3 != null || answers.q4 != null}
          <UasGauge total={((parseInt(answers.q3, 10) || 0) + (parseInt(answers.q4, 10) || 0)) * 7} titulo="Estimación de tu actividad semanal (UAS7)" aviso="Calculada con tus respuestas sobre habones (ronchas) y comezón en la última semana. Es una estimación orientativa, no un puntaje clínico ni un diagnóstico: solo un alergólogo o dermatólogo puede evaluarte. En el Diario de Síntomas puedes llevar el cálculo de los 7 días." fuenteUrl="https://pmc.ncbi.nlm.nih.gov/articles/PMC10219198/" />
        {/if}

        {#if mitos.length}
          <aside class="myth-card" role="note">
            <strong>Has escuchado {mitos.length === 1 ? 'un comentario' : `${mitos.length} comentarios`} sobre la causa de tus ronchas.</strong>
            <span>En la urticaria crónica espontánea las ronchas aparecen sin un desencadenante externo identificable{mitos.includes('estres') ? '; el estrés suele ser una consecuencia, no la causa' : ''}. Conversarlo con un alergólogo o dermatólogo ayuda a aclararlo.
              <a href="https://doi.org/10.4168/aair.2025.17.5.531" target="_blank" rel="noopener">Fuente<span class="sr-only"> (se abre en otra pestaña)</span></a></span>
          </aside>
        {/if}

        {#if lectura.reporte && [2, 3, 4, 5, 6].some(n => lectura.reporte[`seccion${n}`])}
          <div class="report-box" style="margin: 1.5rem 0; padding: 1.25rem; background: var(--card, #fff); border-radius: 14px; border: 1px solid var(--border, #e6e2d4); line-height: 1.6; font-size: 0.98rem; text-align: left;">
            {#if lectura.reporte.seccion2}<p style="margin-bottom: 0.75rem;"><strong>Síntomas:</strong> {lectura.reporte.seccion2}</p>{/if}
            {#if lectura.reporte.seccion3}<p style="margin-bottom: 0.75rem;"><strong>Impacto diario:</strong> {lectura.reporte.seccion3}</p>{/if}
            {#if lectura.reporte.seccion4}<p style="margin-bottom: 0.75rem;"><strong>Comentarios sobre la causa:</strong> {lectura.reporte.seccion4}</p>{/if}
            {#if lectura.reporte.seccion5}<p style="margin-bottom: 0.75rem;"><strong>Historial médico:</strong> {lectura.reporte.seccion5}</p>{/if}
            {#if lectura.reporte.seccion6}<p style="margin-bottom: 0; color: var(--accent, #e0584d); font-weight: 600;">{lectura.reporte.seccion6}</p>{/if}
          </div>
        {/if}

        {#if escalacion}<p class="escalation">{ESCALACION.enPantalla}</p>{/if}
        <div class="summary">
          <header><strong>Tu resumen para el médico</strong><small>Orientativo</small></header>
          {#each rows as row}<p><b>{row.etiqueta}</b><span class:vacio={row.sinResponder}>{row.valor}</span></p>{/each}
          {#if preguntaClave}<footer><small>La pregunta que abre la conversación</small><strong>{preguntaClave}</strong></footer>{/if}
          <div class="summary-actions">
            <button class="button" on:click={download} disabled={downloading}><Icon name={downloaded ? 'check' : 'download'} size={20} /><span>{downloaded ? 'Descargado' : downloading ? 'Generando\u2026' : 'Descargar resumen'}</span></button>
            <button class="ghost" on:click={copy}><Icon name={copied ? 'check' : 'content_copy'} size={18} /><span>{copied ? 'Copiado' : 'Copiar'}</span></button>
          </div>
        </div>

        {#if answers.q19 !== '3'}
          <div class="result-banner-cta">
            <span class="banner-badge"><Icon name="stethoscope" size={15} /> Alergólogos y dermatólogos</span>
            <div class="banner-body">
              <h3>¿Buscas un alergólogo o dermatólogo que valore tus síntomas?</h3>
              <p>Encuentra médicos dermatólogos y alergólogos certificados cerca de ti para dar el siguiente paso.</p>
            </div>
            <button class="button banner-action" on:click={() => go('map', step)}>
              <span>Mira nuestro directorio médico</span>
              <Icon name="arrow_forward" size={18} />
            </button>
          </div>
        {/if}

        <div class="result-next" class:has-banner={answers.q19 !== '3'}>
          {#if answers.q19 === '3'}
            <button class="outline" on:click={() => go('map', step)}>
              <Icon name="location_on" size={20} />
              <span>Ver directorio médico</span>
            </button>
          {/if}
          <button class="text quiet" on:click={restart}>
            <Icon name="refresh" size={16} /> Empezar de nuevo
          </button>
        </div>
      </div>

    {:else}
      <Directorio {ctx} onBack={back} />
    {/if}
  </div>
</div>
