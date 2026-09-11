<script>
  import { onMount, tick } from 'svelte'
  import { questions } from './campaign.js'
  import { construirFlujo, esUrgencia, leerResultado, construirResumen, ESCALACION, PREGUNTA_CLAVE } from './cuestionario.js'
  import { DARK } from './context.js'
  import Icon from './Icon.svelte'
  import Directorio from './Directorio.svelte'
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
  $: lectura = leerResultado(answers)
  $: rows = construirResumen(answers, ctx, questions)
  $: escalacion = ESCALACION.cuando(answers)


  // ---------- flujo ----------
  function select(value) {
    if (q[0] === 'multi') {
      const old = answers[id] || []
      answers = { ...answers, [id]: old.includes(value) ? old.filter(x => x !== value) : [...old, value] }
      return
    }
    const next = { ...answers, [id]: value }
    if (id === 'p1' && value !== 'hinchazon') delete next.p1b
    answers = next
    if (esUrgencia(id, value)) { go('urgent', step); return }
    advance()
  }
  function advance() { if (step + 1 >= flow.length) go('result', step); else go('quiz', step + 1) }
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
    return `RESUMEN PARA MI MÉDICO — Autochequeo de urticaria\n(Orientativo. Mi médico confirma.)\n\n${lectura.titulo}\n\n${rows.map(r => `• ${r.etiqueta}: ${r.valor}`).join('\n')}\n\nMi pregunta clave: ${PREGUNTA_CLAVE}`
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
        pregunta: PREGUNTA_CLAVE,
        escalacion: escalacion ? ESCALACION.enPdf : null
      })
      downloaded = true; setTimeout(() => downloaded = false, 2500)
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
        <p class="step">Paso {step + 1} de {flow.length}</p>
        <h2 tabindex="-1" bind:this={heading}>{q[1]}</h2>
        {#if q[2]}<p class="sub">{q[2]}</p>{/if}
        <div class="options" class:options-grid={q[3] && q[3].length >= 4} role={q[0] === 'multi' ? 'group' : 'radiogroup'}>
          {#each q[3] as o}
            {@const on = q[0] === 'multi' ? (answers[id] || []).includes(o[0]) : answers[id] === o[0]}
            <button class:chosen={on} role={q[0] === 'multi' ? 'checkbox' : 'radio'} aria-checked={on} on:click={() => select(o[0])}>
              <i aria-hidden="true">{#if on}<Icon name="check" size={14} />{/if}</i>
              <span><strong>{o[1]}</strong>{#if o[2]}<small>{o[2]}</small>{/if}</span>
            </button>
          {/each}
        </div>
        <div class="quiz-nav" class:has-next={q[0] === 'multi'}>
          <button class="nav-back" on:click={step ? back : close}>
            {#if step}<Icon name="arrow_back" size={18} /><span>Atrás</span>{:else}<span>Cancelar</span>{/if}
          </button>
          {#if q[0] === 'multi'}
            <button class="button nav-next" on:click={advance}><span>Continuar</span><Icon name="arrow_forward" size={20} /></button>
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
      </div>

    {:else if phase === 'result'}
      <div class="result">
        <p class="eyebrow accent">Ya diste el primer paso para ponerla en su lugar.</p>
        <h2 tabindex="-1" bind:this={heading}>{lectura.titulo}</h2>
        <p class="sub">{lectura.detalle}</p>
        {#if escalacion}<p class="escalation">{ESCALACION.enPantalla}</p>{/if}
        <div class="summary">
          <header><strong>Tu resumen para el médico</strong><small>Orientativo</small></header>
          {#each rows as row}<p><b>{row.etiqueta}</b><span class:vacio={row.sinResponder}>{row.valor}</span></p>{/each}
          <footer><small>La pregunta que abre la conversación</small><strong>{PREGUNTA_CLAVE}</strong></footer>
          <div class="summary-actions">
            <button class="button" on:click={download} disabled={downloading}><Icon name={downloaded ? 'check' : 'download'} size={20} /><span>{downloaded ? 'Descargado' : downloading ? 'Generando\u2026' : 'Descargar resumen'}</span></button>
            <button class="ghost" on:click={copy}><Icon name={copied ? 'check' : 'content_copy'} size={18} /><span>{copied ? 'Copiado' : 'Copiar'}</span></button>
          </div>
        </div>
        <div class="result-next">
          <button class="outline" on:click={() => go('map', step)}><Icon name="location_on" size={20} /><span>Ver especialistas cerca</span></button>
          <button class="text quiet" on:click={restart}><Icon name="refresh" size={16} /> Empezar de nuevo</button>
        </div>
      </div>

    {:else}
      <Directorio {ctx} onBack={back} />
    {/if}
  </div>
</div>
