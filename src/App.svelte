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
  import { DARK, SOLID, resolveContext, forcedFromUrl } from './lib/context.js'
  import { detectGeoAndWeather } from './lib/geo.js'
  import { heroVariation } from './lib/heroVariations.js'
  import { homeCopyFor, landingPages, navigation, routeFromPath, routeHref } from './lib/siteContent.js'
  import pageMetadata from './lib/pageMetadata.json'
  import { SITE_DOMAIN, SITE_NAME, SITE_URL, CONTENT_ID, VIGENCIA, LEGAL_LINKS } from './lib/site.js'
  import LogoNovartis from './lib/LogoNovartis.svelte'

  let route = routeFromPath()
  // Todo es automático (hora, clima y ciudad). ?vista= solo fuerza un escenario en las ligas de prueba.
  const forced = forcedFromUrl()
  let quizOpen = false
  let quizTrigger = null
  let geoData = null
  let now = new Date()
  let quizInitialPhase = 'quiz'
  let modalCtx = 'dia'

  $: autoCtx = resolveContext(now, geoData)
  $: ctx = forced || autoCtx
  $: isHome = !route || route === 'videos'
  $: videosMode = route === 'videos'
  // El tema por hora y clima se aplica en todo el sitio, no solo en el Inicio.
  $: theme = themes[ctx]
  $: dark = DARK.has(ctx)
  $: css = Object.entries(theme).map(([k, v]) => `--${k}:${v}`).join(';') + `;--bg-solid:${SOLID[ctx]}`
  // Con ?vista= forzada, el texto sigue al escenario visual y no a la temperatura.
  $: heroTemp = forced ? null : geoData?.temp
  $: copy = homeCopyFor(ctx, now, geoData?.city, heroTemp)
  $: basePage = landingPages[route]
  $: pageHero = basePage ? heroVariation(route, ctx, now, heroTemp, geoData?.city) : null
  $: page = pageHero ? { ...basePage, title: pageHero.title, intro: pageHero.intro || basePage.intro } : basePage
  $: blogArticle = route?.startsWith('blog/') ? blogDrafts.find(draft => draft.slug === route.slice('blog/'.length)) : null
  $: isBlogRoute = route === 'blog' || !!blogArticle
  $: pageTitle = blogArticle ? `${blogArticle.title} | Blog | Más que Urticaria` : page?.metaTitle || (isHome ? pageMetadata[''].metaTitle : 'Página no encontrada | Más que Urticaria')
  $: pageDescription = blogArticle?.excerpt || page?.metaDescription || (isHome ? pageMetadata[''].metaDescription : 'Más que Urticaria: información y herramientas para preparar tu consulta.')
  $: canonicalUrl = `${SITE_URL}/${route ? `${route}/` : ''}`
  $: syncHead(pageTitle, pageDescription, canonicalUrl)
  $: faqs = (page?.sections || []).flatMap(section => section.faqs || [])
  $: jsonLd = JSON.stringify(faqs.length
    ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(faq => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) }
    : isHome ? { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: 'es-MX' } : null)
  $: jsonLdTag = jsonLd === 'null' ? '' : `<script type="application/ld+json">${jsonLd.replaceAll('<', '\\u003c')}<\/script>`

  // index.html y el postbuild ya traen estas etiquetas; aquí solo se actualizan al navegar (sin duplicarlas).
  function syncHead(title, description, url) {
    if (typeof document === 'undefined') return
    const set = (selector, attr, value) => document.head.querySelector(selector)?.setAttribute(attr, value)
    set('meta[name="description"]', 'content', description)
    set('meta[property="og:title"]', 'content', title)
    set('meta[property="og:description"]', 'content', description)
    set('meta[property="og:url"]', 'content', url)
    set('link[rel="canonical"]', 'href', url)
  }

  function openQuiz(e, phase = 'quiz') {
    quizTrigger = e?.currentTarget || null
    quizInitialPhase = phase
    modalCtx = ctx
    quizOpen = true
  }
  function closeQuiz() {
    quizOpen = false
    queueMicrotask(() => quizTrigger?.focus?.())
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

  onMount(() => {
    if (window.location.hash === '#consulta') {
      openQuiz(null, 'map')
    }

    // Detección automática y no bloqueante de ciudad y clima
    detectGeoAndWeather().then(data => { if (data) geoData = data })

    // Actualización de reloj cada 30 segundos
    const clockTimer = setInterval(() => { now = new Date() }, 30000)
    return () => clearInterval(clockTimer)
  })
</script>

<svelte:head>
  <title>{pageTitle}</title>
  {#if jsonLdTag}{@html jsonLdTag}{/if}
</svelte:head>

<svelte:window on:click={handleAnchorClick} />

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
    <LandingPage {page} {ctx} onQuiz={openQuiz} isResources={route === 'recursos-herramientas'} />
    {#if route === 'recursos-herramientas'}<PhotoLibrary />{/if}
  {:else}
    <main id="main-content" class="content-page"><section class="content-hero"><p class="eyebrow accent">Más que Urticaria</p><h1>Esta página todavía no está disponible</h1><p class="content-lead">Vuelve al inicio para explorar los recursos y la información del sitio.</p><a class="button" href={routeHref('')}>Ir al Inicio</a></section></main>
  {/if}

  <footer class="site-footer">
    <em>Tu vida es más grande que los brotes de urticaria crónica espontánea.</em>
    <div class="footer-brand"><LogoNovartis alto={28} /></div>
    <small class="footer-legal">Consulte a su médico. ID de contenido: {CONTENT_ID}<br />Fecha de vigencia: {VIGENCIA}</small>
    <small>Este contenido es solo información general y no sustituye el consejo médico. Si tienes síntomas, habla con un profesional de la salud.</small>
    <small>Las imágenes empleadas no corresponden a pacientes reales. Las imágenes empleadas no corresponden a Profesionales de la Salud reales.</small>
    <small>Novartis Farmacéutica, S.A. de C.V. con domicilio en Av. Insurgentes Sur No.2475, Piso 3, Barrio Loreto, Álvaro Obregón, 01090 Ciudad de México, México</small>
    <nav class="footer-legal-links" aria-label="Información legal">{#each LEGAL_LINKS as l}<a href={l.href}>{l.label}</a>{/each}</nav>
    <div class="footer-domain">
      <a href={routeHref('')}>{SITE_DOMAIN}</a>
      <span>© {new Date().getFullYear()} {SITE_NAME}</span>
    </div>
  </footer>

  {#if quizOpen}<QuizModal ctx={modalCtx} initialPhase={quizInitialPhase} onClose={closeQuiz} />{/if}
</div>
