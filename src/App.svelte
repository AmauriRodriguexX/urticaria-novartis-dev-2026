<script>
  import { onMount } from 'svelte'
  import Hero from './lib/Hero.svelte'
  import QuizModal from './lib/QuizModal.svelte'
  import Icon from './lib/Icon.svelte'
  import PhotoLibrary from './lib/PhotoLibrary.svelte'
  import HomeLanding from './lib/HomeLanding.svelte'
  import LandingPage from './lib/LandingPage.svelte'
  import BlogPage from './lib/BlogPage.svelte'
  import Community from './lib/Community.svelte'
  import { blogDrafts } from './lib/blogDrafts.js'
  import { themes } from './lib/campaign.js'
  import { ORDER, LABELS, DARK, SOLID, resolveContext, forcedFromUrl, previewEnabled } from './lib/context.js'
  import { detectGeoAndWeather } from './lib/geo.js'
  import { homeCopyFor, landingPages, navigation, routeFromPath, routeHref } from './lib/siteContent.js'
  import pageMetadata from './lib/pageMetadata.json'
  import { SITE_DOMAIN, SITE_NAME } from './lib/site.js'

  let route = routeFromPath()
  let forced = forcedFromUrl()
  let preview = previewEnabled()
  let quizOpen = false
  let quizTrigger = null
  let viewOpen = false
  let geoData = null
  let now = new Date()
  let quizInitialPhase = 'quiz'
  let modalCtx = 'dia'

  $: autoCtx = resolveContext(now, geoData)
  $: ctx = forced || autoCtx
  $: isHome = !route || route === 'videos'
  $: videosMode = route === 'videos'
  $: theme = isHome ? themes[ctx] : themes.dia
  $: dark = isHome && DARK.has(ctx)
  $: css = Object.entries(theme).map(([k, v]) => `--${k}:${v}`).join(';') + `;--bg-solid:${SOLID[isHome ? ctx : 'dia']}`
  $: copy = homeCopyFor(ctx, now, geoData?.city, geoData?.temp)
  $: page = landingPages[route]
  $: blogArticle = route?.startsWith('blog/') ? blogDrafts.find(draft => draft.slug === route.slice('blog/'.length)) : null
  $: isBlogRoute = route === 'blog' || !!blogArticle
  $: pageTitle = blogArticle ? `${blogArticle.title} | Blog | Más que Urticaria` : page?.metaTitle || (isHome ? pageMetadata[''].metaTitle : 'Página no encontrada | Más que Urticaria')
  $: pageDescription = blogArticle?.excerpt || page?.metaDescription || (isHome ? copy.intro : 'Más que Urticaria: información y herramientas para preparar tu consulta.')

  function openQuiz(e, phase = 'quiz') {
    quizTrigger = e?.currentTarget || null
    quizInitialPhase = phase
    modalCtx = isHome ? ctx : 'dia'
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
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
    if (!reduceMotion) {
      section.classList.remove('section-arrive')
      requestAnimationFrame(() => section.classList.add('section-arrive'))
      window.setTimeout(() => section.classList.remove('section-arrive'), 900)
    }
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
    if (isHome) detectGeoAndWeather().then(data => { if (data) geoData = data })

    // Actualización de reloj cada 30 segundos
    const clockTimer = setInterval(() => { now = new Date() }, 30000)
    return () => clearInterval(clockTimer)
  })
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />
</svelte:head>

<svelte:window on:click={handleDocumentClick} />

<div class="shell" class:dark style={css}>
  <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
  <header class="brand">
    <a class="brand-link" href={routeHref('')} aria-label="Inicio">
      <span>Más que Urticaria</span>
    </a>
    <div class="brand-actions">
      <nav class="site-navigation" aria-label="Navegación principal">
        {#each navigation as item}
          <a class:active={route === item.slug || (item.slug === 'blog' && route?.startsWith('blog/'))} aria-current={route === item.slug || (item.slug === 'blog' && route?.startsWith('blog/')) ? 'page' : undefined} href={routeHref(item.slug)}>{item.label}</a>
        {/each}
      </nav>
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
    </div>
  </header>

  {#if isHome}
    <main id="main-content">
      <Hero {copy} {ctx} {videosMode} autoVideo={!forced} onQuiz={openQuiz} />
      <HomeLanding />
    </main>
  {:else if isBlogRoute}
    <BlogPage article={blogArticle} />
  {:else if route === 'testimonios'}
    <main id="main-content" class="testimonials-main"><Community /></main>
  {:else if page}
    <LandingPage {page} onQuiz={openQuiz} isResources={route === 'recursos-herramientas'} />
    {#if route === 'recursos-herramientas'}<PhotoLibrary />{/if}
  {:else}
    <main id="main-content" class="content-page"><section class="content-hero"><p class="eyebrow accent">Más que Urticaria</p><h1>Esta página todavía no está disponible</h1><p class="content-lead">Vuelve al inicio para explorar los recursos y la información del sitio.</p><a class="button" href={routeHref('')}>Ir al Inicio</a></section></main>
  {/if}

  <footer class="site-footer">
    <em>Tu vida es más grande que los brotes de urticaria crónica espontánea.</em>
    <small>Este contenido es solo información general y no sustituye el consejo médico. Si tienes síntomas, habla con un profesional de la salud.</small>
    <div class="footer-domain">
      <a href={routeHref('')}>{SITE_DOMAIN}</a>
      <span>© {new Date().getFullYear()} {SITE_NAME}</span>
    </div>
  </footer>

  {#if quizOpen}<QuizModal ctx={modalCtx} initialPhase={quizInitialPhase} onClose={closeQuiz} />{/if}
</div>
