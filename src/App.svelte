<script>
  import { onMount } from 'svelte'
  import Hero from './lib/Hero.svelte'
  import QuizModal from './lib/QuizModal.svelte'
  import Icon from './lib/Icon.svelte'
  import PhotoLibrary from './lib/PhotoLibrary.svelte'
  import Community from './lib/Community.svelte'
  import { themes, copies } from './lib/campaign.js'
  import { ORDER, LABELS, DARK, SOLID, resolveContext, forcedFromUrl, previewEnabled, formatTimeGreeting } from './lib/context.js'
  import { detectGeoAndWeather } from './lib/geo.js'

  let forced = forcedFromUrl()
  let preview = previewEnabled()
  let quizOpen = false
  let word = 'los brotes'
  let quizTrigger = null
  let videosMode = typeof window !== 'undefined' && window.location.pathname.replace(/\/$/, '').endsWith('/videos')
  let viewOpen = false
  let geoData = null
  let now = new Date()

  $: autoCtx = resolveContext(now, geoData)
  $: ctx = forced || autoCtx
  $: theme = themes[ctx]
  $: dark = DARK.has(ctx)
  $: rawCopy = copies[ctx]
  $: dynamicKicker = formatTimeGreeting(ctx, geoData?.city, now)
  $: copy = [dynamicKicker, ...rawCopy.slice(1)]
  $: displayWord = ctx === 'dia' ? word : copy[2]
  $: css = Object.entries(theme).map(([k, v]) => `--${k}:${v}`).join(';') + `;--bg-solid:${SOLID[ctx]}`
  let quizInitialPhase = 'quiz'
  $: target = dark ? 18 : 1240

  function openQuiz(e, phase = 'quiz') {
    quizTrigger = e?.currentTarget || null
    quizInitialPhase = phase
    quizOpen = true
  }
  function closeQuiz() {
    quizOpen = false
    queueMicrotask(() => quizTrigger?.focus?.())
  }
  function setView(k) {
    forced = k
    viewOpen = false
    const url = new URL(window.location.href)
    if (k) url.searchParams.set('vista', k); else url.searchParams.delete('vista')
    history.replaceState(history.state, '', url)
  }

  function handleAnchorClick(event) {
    const link = event.target.closest?.('a[href^="#"]')
    if (!link) return
    const id = link.getAttribute('href')?.slice(1)
    if (id === 'consulta') {
      event.preventDefault()
      openQuiz(null, 'map')
      return
    }
    const section = id && document.getElementById(id)
    if (!section) return
    event.preventDefault()
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    section.classList.remove('section-arrive')
    requestAnimationFrame(() => section.classList.add('section-arrive'))
    window.setTimeout(() => section.classList.remove('section-arrive'), 900)
  }

  function handleDocumentClick(event) {
    viewOpen = false
    handleAnchorClick(event)
  }

  onMount(() => {
    if (window.location.hash === '#consulta') {
      openQuiz(null, 'map')
    }

    // Detección automática y no bloqueante de ciudad y clima
    detectGeoAndWeather().then(data => {
      if (data) geoData = data
    })

    // Actualización de reloj cada 30 segundos
    const clockTimer = setInterval(() => { now = new Date() }, 30000)

    const words = ['los brotes', 'la comezón', 'el insomnio', 'la incertidumbre']
    const timer = setInterval(() => { if (ctx === 'dia' && !quizOpen) word = words[(words.indexOf(word) + 1) % words.length] }, 2900)
    return () => {
      clearInterval(timer)
      clearInterval(clockTimer)
    }
  })
</script>

<svelte:window on:click={handleDocumentClick} />

<main class="shell" class:dark style={css}>
  <header class="brand">
    <a class="brand-link" href={import.meta.env.BASE_URL} aria-label="Inicio">
      <span>tuvidaesmásgrande.org</span>
    </a>
    {#if preview}
      <div class="view-select">
        <span>Vista</span>
        <div class="view-dropdown">
          <button class="view-trigger" type="button" aria-haspopup="listbox" aria-expanded={viewOpen} on:click|stopPropagation={() => viewOpen = !viewOpen}>
            <span>{forced ? LABELS[forced] : 'Auto'}</span><i aria-hidden="true">⌄</i>
          </button>
          {#if viewOpen}
            <div class="view-menu" role="listbox" aria-label="Seleccionar vista">
              <button type="button" role="option" class:active={!forced} aria-selected={!forced} on:click={() => setView(null)}><span>Auto</span><small>Según la hora</small></button>
              {#each ORDER as k}
                <button type="button" role="option" class:active={forced === k} aria-selected={forced === k} on:click={() => setView(k)}><span>{LABELS[k]}</span><small>{k === 'dia' ? 'Luz natural' : k === 'calor' ? 'Ambiente cálido' : k === 'frio' ? 'Aire frío' : k === 'madrugada' ? 'De madrugada' : 'Noche cálida'}</small></button>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </header>

  <Hero {copy} {target} word={displayWord} {ctx} {videosMode} autoVideo={!forced} onQuiz={openQuiz} />

  <section class="cards" aria-labelledby="cards-title">
    <p id="cards-title" class="eyebrow">Tres formas de empezar</p>
    <div class="cards-grid">
      <button class="card card-quiz" on:click={openQuiz}>
        <i><Icon name="quiz" size={22} /></i>
        <h3>¿Será urticaria?</h3>
        <span>Reconoce las señales y distingue lo agudo de lo crónico: más de 6 semanas, sin un detonante claro.</span>
        <b>Hacer el quiz <Icon name="arrow_forward" size={18} /></b>
      </button>
      <a class="card card-community" href="#comunidad">
        <i><Icon name="groups" size={22} /></i>
        <h3>No lo estás imaginando</h3>
        <span>Otras personas la viven y aprendieron que su vida es más grande que los síntomas.</span>
        <b>Leer a la comunidad <Icon name="arrow_forward" size={18} /></b>
      </a>
      <button class="card card-consult" type="button" on:click={(e) => openQuiz(e, 'map')}>
        <i><Icon name="stethoscope" size={22} /></i>
        <h3>Hay algo más que puedes hacer</h3>
        <span>Lleva a tu próxima consulta las palabras justas para empezar la conversación.</span>
        <b>Preparar mi consulta <Icon name="arrow_forward" size={18} /></b>
      </button>
    </div>
  </section>

  <PhotoLibrary />

  <Community />

  <footer class="site-footer">
    <em>Tu vida es más grande que los brotes de urticaria crónica espontánea.</em>
    <small>Este contenido es solo información general y no sustituye el consejo médico. Si tienes síntomas, habla con un profesional de la salud.</small>
  </footer>

  {#if quizOpen}<QuizModal {ctx} initialPhase={quizInitialPhase} onClose={closeQuiz} />{/if}
</main>
