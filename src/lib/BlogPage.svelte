<script>
  import { onMount } from 'svelte'
  import Icon from './Icon.svelte'
  import { routeHref } from './siteContent.js'
  import { blogDrafts } from './blogDrafts.js'
  import Fuentes from './Fuentes.svelte'
  import LeyendaProfesional from './LeyendaProfesional.svelte'

  export let article = null

  let activeTopic = 'Todos los temas'
  let showSampleNotice = true
  const topics = ['Todos los temas', ...new Set(blogDrafts.map(post => post.topic))]
  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`

  $: visiblePosts = activeTopic === 'Todos los temas'
    ? blogDrafts
    : blogDrafts.filter(post => post.topic === activeTopic)
  $: listedCount = visiblePosts.length - (activeTopic === 'Todos los temas' && visiblePosts.length ? 1 : 0)

  onMount(() => {
    try { showSampleNotice = sessionStorage.getItem('blog-sample-notice-dismissed') !== 'true' } catch { showSampleNotice = true }
  })

  function dismissSampleNotice() {
    showSampleNotice = false
    try { sessionStorage.setItem('blog-sample-notice-dismissed', 'true') } catch { /* El aviso también puede cerrarse sin almacenamiento de sesión. */ }
  }

  function imageUrl(path) {
    return `${baseUrl}${path.replace(/^\/+/, '')}`
  }
</script>

{#if article}
  <main id="main-content" class="blog-page blog-article-page">
    <div class="blog-article-shell">
      <a class="blog-back-link" href={routeHref('blog')}><Icon name="arrow_back" size={18} /> Volver al Blog</a>
      <p class="eyebrow accent blog-article-topic">{article.topic}</p>
      <h1>{article.title}</h1>
      <p class="blog-article-deck">{article.excerpt}</p>
      <div class="blog-article-byline"><span>Lectura de muestra</span><span aria-hidden="true">·</span><span>{article.readTime}</span></div>
      {#if showSampleNotice}
        <aside class="blog-draft-notice" role="note"><p><strong>Contenido de muestra.</strong> La información es general y no tiene validez. Se incluye solo de forma representativa para mostrar el diseño y la maquetación del sitio.</p><button type="button" aria-label="Cerrar aviso" title="Cerrar aviso" on:click={dismissSampleNotice}><Icon name="close" size={18} /></button></aside>
      {/if}
      <figure class="blog-article-cover">
        <img src={imageUrl(article.image)} alt={article.imageAlt} />
        <figcaption>Imagen ilustrativa y representativa; no muestra un paciente ni una situación clínica.</figcaption>
      </figure>

      <article class="blog-prose">
        {#each article.sections as section}
          <section aria-labelledby={`draft-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
            <h2 id={`draft-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>{section.title}</h2>
            {#each section.paragraphs as paragraph}<p>{paragraph}</p>{/each}
          </section>
        {/each}
      </article>

      {#if article.sources?.length}<Fuentes sources={article.sources.map((s, i) => ({ n: i + 1, text: s.label, url: s.href }))} prefix="blog" />{/if}

      <a class="blog-resource-cta" href={routeHref('recursos-herramientas')}><span><small>PARA SEGUIR EXPLORANDO</small><strong>Conoce los recursos del sitio</strong></span><Icon name="arrow_forward" size={20} /></a>
      <LeyendaProfesional />
    </div>
  </main>
{:else}
  <main id="main-content" class="blog-page">
    <header class="blog-header">
      <div><p class="eyebrow accent">Más que Urticaria · Blog</p><h1>Ideas para entender y conversar</h1><p>Lecturas breves sobre urticaria crónica espontánea, registro y preparación para consulta.</p></div>
    </header>

    <nav class="blog-topic-nav" aria-label="Filtrar artículos por tema">
      {#each topics as topic}
        <button class:active={activeTopic === topic} aria-pressed={activeTopic === topic} type="button" on:click={() => activeTopic = topic}>{topic}</button>
      {/each}
    </nav>

    {#if showSampleNotice}
      <aside class="blog-draft-notice blog-draft-notice-wide" role="note"><p><strong>Contenido de muestra.</strong> La información es general y no tiene validez. Se incluye solo de forma representativa para mostrar el diseño y la maquetación del sitio.</p><button type="button" aria-label="Cerrar aviso" title="Cerrar aviso" on:click={dismissSampleNotice}><Icon name="close" size={18} /></button></aside>
    {/if}

    <div class="blog-layout">
      <section class="blog-feed" aria-label="Lecturas de muestra">
        {#if activeTopic === 'Todos los temas' && visiblePosts.length}
          {@const featured = visiblePosts[0]}
          <a class="blog-featured" href={routeHref(`blog/${featured.slug}`)}>
            <div class="blog-featured-copy"><span class="blog-story-kicker">Para empezar · {featured.topic}</span><span class="blog-draft-label">Lectura de muestra</span><h2>{featured.title}</h2><p>{featured.excerpt}</p><span class="blog-read-link">Leer muestra <Icon name="arrow_forward" size={17} /></span></div>
            <figure><img src={imageUrl(featured.image)} alt="" /><figcaption>Imagen representativa para mostrar el diseño.</figcaption></figure>
          </a>
        {/if}

        <div class="blog-feed-heading"><h2>{activeTopic === 'Todos los temas' ? 'Lecturas de muestra' : activeTopic}</h2><span>{listedCount} {listedCount === 1 ? 'lectura' : 'lecturas'}</span></div>
        {#each (activeTopic === 'Todos los temas' ? visiblePosts.slice(1) : visiblePosts) as post}
          <article class="blog-story">
            <div class="blog-story-copy">
              <div class="blog-story-meta"><span>{post.topic}</span><span aria-hidden="true">·</span><span>{post.readTime}</span></div>
              <h3><a href={routeHref(`blog/${post.slug}`)}>{post.title}</a></h3>
              <p>{post.excerpt}</p>
              <span class="blog-draft-label">Lectura de muestra</span>
            </div>
            <a class="blog-story-image" href={routeHref(`blog/${post.slug}`)} aria-label={`Abrir borrador: ${post.title}`}><img src={imageUrl(post.image)} alt="" loading="lazy" /></a>
          </article>
        {/each}
        {#if !visiblePosts.length}<p class="blog-empty">No hay lecturas de muestra para este tema.</p>{/if}
      </section>

      <aside class="blog-sidebar" aria-label="Acerca del blog">
        <section class="blog-sidebar-card"><p class="eyebrow">Explora</p><h2>Temas para conversar</h2><p>Encuentra recursos sobre síntomas, herramientas y cómo preparar una conversación con un profesional de la salud.</p></section>
        <section class="blog-sidebar-card blog-related"><p class="eyebrow">Explora también</p><a href={routeHref('sintomas')}>Síntomas <Icon name="arrow_forward" size={16} /></a><a href={routeHref('diario')}>Diario de Síntomas <Icon name="arrow_forward" size={16} /></a><a href={routeHref('recursos-herramientas')}>Recursos y herramientas <Icon name="arrow_forward" size={16} /></a></section>
      </aside>
    </div>
    <LeyendaProfesional />
  </main>
{/if}
