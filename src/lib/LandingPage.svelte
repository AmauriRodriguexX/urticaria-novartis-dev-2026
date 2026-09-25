<script>
  import { onMount } from 'svelte'
  import { routeHref } from './siteContent.js'
  import SymptomDiary from './SymptomDiary.svelte'
  import Directorio from './Directorio.svelte'
  import Icon from './Icon.svelte'
  import { reveal } from './reveal.js'

  export let page
  export let onQuiz
  export let isResources = false
  export let ctx = 'dia'
  let showSampleNotice = true

  onMount(() => {
    if (!page.sampleNotice) return
    try { showSampleNotice = sessionStorage.getItem(`sample-notice-${page.sampleNotice.key}`) !== 'true' } catch { showSampleNotice = true }
  })

  function dismissSampleNotice() {
    showSampleNotice = false
    try { sessionStorage.setItem(`sample-notice-${page.sampleNotice.key}`, 'true') } catch { /* Se puede cerrar aunque el navegador no guarde la sesión. */ }
  }

  function runAction(event, action) {
    if (action === 'quiz') onQuiz?.(event, 'quiz')
    if (action === 'directory') onQuiz?.(event, 'map')
    if (action === 'print') window.print()
  }

  const cardIcons = { test: 'quiz', diario: 'download', sintomas: 'check', tratamiento: 'stethoscope', 'recursos-herramientas': 'groups', '#biblioteca': 'groups' }
  const cardIcon = card => cardIcons[card.anchor || card.route] || 'arrow_forward'
  const pad = n => String(n).padStart(2, '0')

  function cardHref(card) {
    return card.anchor || routeHref(card.route)
  }

  function sectionId(section, index) {
    if (section.id) return section.id
    const slug = section.title.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    return `seccion-${index + 1}-${slug}`
  }
</script>

<main id="main-content" class="content-page" class:resource-page={isResources} use:reveal>
  <section class="content-hero" class:content-hero-indexed={page.sections.length > 3}>
    <div class="content-hero-copy">
    <p class="eyebrow accent">{page.eyebrow}</p>
    <h1>{page.title}</h1>
    <p class="content-lead">{page.intro}</p>
    {#if page.ctas?.length}
      <div class="content-actions">
        {#each page.ctas as cta, i}
          {#if cta.action}
            <button class:secondary={i > 0} class="button" type="button" on:click={(event) => runAction(event, cta.action)}>{cta.label} <Icon name="arrow_forward" size={18} /></button>
          {:else}
            <a class:secondary={i > 0} class="button" href={cta.href || routeHref(cta.route)}>{cta.label} <Icon name="arrow_forward" size={18} /></a>
          {/if}
        {/each}
      </div>
    {/if}
    </div>
    {#if page.sections.length > 3}
      <nav class="section-index" aria-label="En esta página">
        <p>En esta página</p>
        <ol>{#each page.sections as section, i}<li><a href={`#${sectionId(section, i)}`}><span aria-hidden="true">{pad(i + 1)}</span>{section.title}</a></li>{/each}</ol>
      </nav>
    {/if}
  </section>

  {#if page.sampleNotice && showSampleNotice}
    <aside class="sample-page-notice" role="note"><p>{page.sampleNotice.text}</p><button type="button" aria-label="Cerrar aviso" title="Cerrar aviso" on:click={dismissSampleNotice}><Icon name="close" size={18} /></button></aside>
  {/if}

  {#if page.diaryTool}<SymptomDiary />{/if}
  {#if page.directoryTool}<section class="directory-page" aria-label="Directorio de especialistas"><Directorio {ctx} /></section>{/if}

  <div class="content-sections">
    {#each page.sections as section, i}
      <section class="content-section" class:content-section-featured={section.layout === 'featured'} class:content-section-steps={section.layout === 'steps'} id={sectionId(section, i)} aria-labelledby={`section-title-${i}`} data-reveal>
        <div class="content-section-heading">
          <span class="content-section-number" aria-hidden="true">{pad(i + 1)}</span>
          <div>
            {#if section.kicker}<p class="eyebrow">{section.kicker}</p>{/if}
            <h2 id={`section-title-${i}`}>{section.title}</h2>
          </div>
        </div>
        {#if section.intro}<p class="content-section-intro">{section.intro}</p>{/if}

        {#if section.paragraphs}
          <div class="content-prose">
            {#each section.paragraphs as paragraph}<p>{paragraph}</p>{/each}
          </div>
        {/if}

        {#if section.listTitle}<h3 class="content-subtitle">{section.listTitle}</h3>{/if}
        {#if section.list}
          {#if section.layout === 'steps'}<ol class="content-list content-steps">{#each section.list as item}<li>{item}</li>{/each}</ol>{:else}<ul class="content-list">
            {#each section.list as item}<li>{item}</li>{/each}
          </ul>{/if}
        {/if}

        {#if section.cards}
          <div class="content-card-grid">
            {#each section.cards as card}
              {#if card.route || card.anchor}
                <a class="content-card content-card-link" href={cardHref(card)}>
                  <span class="content-card-icon" aria-hidden="true"><Icon name={cardIcon(card)} size={22} /></span>
                  <h3>{card.title}</h3><p>{card.text}</p>
                  {#if card.linkLabel}<span class="content-card-cta">{card.linkLabel} <Icon name="arrow_forward" size={16} /></span>{/if}
                </a>
              {:else}
                <article class="content-card" class:testimonial-sample-card={card.sampleQuote}>
                  {#if card.sampleQuote}<span class="content-quote-mark" aria-hidden="true">“</span><h3>{card.title}</h3><span class="content-card-label">Relato de muestra · sin autor real</span><blockquote>{card.sampleQuote}</blockquote>{:else}
                  <h3>{card.title}</h3><p>{card.text}</p>
                  {#if card.label}<span class="content-card-label">{card.label}</span>{/if}
                  {/if}
                </article>
              {/if}
            {/each}
          </div>
        {/if}

        {#if section.table}
          <div class="content-table-wrap" role="region" aria-label={section.title}>
            <table class="content-table">
              <thead><tr>{#each section.table.headers as header}<th scope="col">{header}</th>{/each}</tr></thead>
              <tbody>{#each section.table.rows as row}<tr>{#each row as cell, j}{#if j === 0}<th scope="row">{cell}</th>{:else}<td>{cell}</td>{/if}{/each}</tr>{/each}</tbody>
            </table>
          </div>
        {/if}

        {#if section.faqs}
          <div class="content-faqs">
            {#each section.faqs as faq}
              <details><summary><span>{faq.question}</span><i aria-hidden="true"></i></summary><p>{faq.answer}</p></details>
            {/each}
          </div>
        {/if}

        {#if section.notice}<aside class="content-notice" role="note"><Icon name="emergency" size={20} /><span>{section.notice}</span></aside>{/if}
      </section>
    {/each}

    {#if page.closing}
      <section class="content-closing" data-reveal>
        <div><p class="eyebrow">Más que Urticaria</p><h2>{page.closing.title}</h2><p>{page.closing.text}</p></div>
        {#if page.closing.cta.action}
          <button class="button" type="button" on:click={(event) => runAction(event, page.closing.cta.action)}>{page.closing.cta.label} <Icon name="arrow_forward" size={18} /></button>
        {:else}
          <a class="button" href={routeHref(page.closing.cta.route)}>{page.closing.cta.label} <Icon name="arrow_forward" size={18} /></a>
        {/if}
      </section>
    {/if}
  </div>
</main>
