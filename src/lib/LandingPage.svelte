<script>
  import { onMount } from 'svelte'
  import { routeHref } from './siteContent.js'
  import SymptomDiary from './SymptomDiary.svelte'
  import Directorio from './Directorio.svelte'
  import SymptomCompare from './SymptomCompare.svelte'
  import SkinTimeline from './SkinTimeline.svelte'
  import Cita from './Cita.svelte'
  import Fuentes from './Fuentes.svelte'
  import LeyendaProfesional from './LeyendaProfesional.svelte'
  import Icon from './Icon.svelte'
  import { reveal } from './reveal.js'
  import { NOTA_TEST } from './site.js'

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
      {#if page.ctas.some(cta => cta.action === 'quiz')}<small class="cta-note">{NOTA_TEST}</small>{/if}
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

  {#if page.diaryTool}<SymptomDiary ref={page.diaryRef} />{/if}
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
        {#if section.highlight}<p class="content-highlight">{section.highlight}</p>{/if}

        {#if section.paragraphs}
          <div class="content-prose">
            {#each section.paragraphs as paragraph}<p>{paragraph.text ?? paragraph}{#if paragraph.refs}<Cita refs={paragraph.refs} prefix="ref" />{/if}</p>{/each}
          </div>
        {/if}

        {#if section.listTitle}<h3 class="content-subtitle">{section.listTitle}</h3>{/if}
        {#if section.list}
          {#if section.layout === 'steps'}<ol class="content-list content-steps">{#each section.list as item}<li>{item.text ?? item}{#if item.refs}<Cita refs={item.refs} prefix="ref" />{/if}</li>{/each}</ol>{:else}<ul class="content-list">
            {#each section.list as item}<li>{item.text ?? item}{#if item.refs}<Cita refs={item.refs} prefix="ref" />{/if}</li>{/each}
          </ul>{/if}
        {/if}

        {#if section.visuals}
          <div class="content-visuals">
            {#each section.visuals.items as name}
              <a class="content-visual" href={routeHref(section.visuals.route)}>
                <div class="content-card-media" role="img" aria-label={`Imagen por definir: ${name}`}><span>Imagen por definir</span></div>
                <strong>{name}</strong>
              </a>
            {/each}
          </div>
        {/if}

        {#if section.cards}
          <div class="content-card-grid" class:content-card-grid-4={section.cardsRow === 4}>
            {#each section.cards as card}
              {#if card.route || card.anchor}
                <a class="content-card content-card-link" href={cardHref(card)}>
                  <span class="content-card-icon" aria-hidden="true"><Icon name={cardIcon(card)} size={22} /></span>
                  <h3>{card.title}</h3>{#if card.text}<p>{card.text}</p>{/if}
                  {#if card.linkLabel}<span class="content-card-cta">{card.linkLabel} <Icon name="arrow_forward" size={16} /></span>{/if}
                </a>
              {:else}
                <article class="content-card" class:testimonial-sample-card={card.sampleQuote}>
                  {#if card.sampleQuote}<span class="content-quote-mark" aria-hidden="true">“</span><h3>{card.title}</h3><span class="content-card-label">Relato de muestra · sin autor real</span><blockquote>{card.sampleQuote}</blockquote>{:else}
                  {#if card.icon}<span class="content-card-icon" aria-hidden="true"><Icon name={card.icon} size={26} /></span>{/if}
                  {#if card.image}<div class="content-card-media" role="img" aria-label={`Imagen por definir: ${card.title}`}><span>Imagen por definir</span></div>{/if}
                  <h3>{card.title}</h3><p>{card.text}{#if card.refs}<Cita refs={card.refs} prefix="ref" />{/if}</p>
                  {#if card.label}<span class="content-card-label">{card.label}</span>{/if}
                  {/if}
                </article>
              {/if}
            {/each}
          </div>
        {/if}

        {#if section.outro}<p class="content-outro">{section.outro}</p>{/if}
        {#if section.skinFigure}<SkinTimeline refs={section.skinFigure} />{/if}
        {#if section.compare}<SymptomCompare data={section.compare} />{/if}

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
            {#each section.faqs as faq, fi}
              <details open={fi === 0}>
                <summary><span>{faq.question}</span><i aria-hidden="true"></i></summary>
                <p>{faq.answer}{#if faq.refs}<Cita refs={faq.refs} prefix="ref" />{/if}</p>
                {#if faq.cta}
                  {#if faq.cta.action}
                    <button class="faq-cta" type="button" on:click={(event) => runAction(event, faq.cta.action)}>{faq.cta.label} <Icon name="arrow_forward" size={16} /></button>
                  {:else}
                    <a class="faq-cta" href={routeHref(faq.cta.route)}>{faq.cta.label} <Icon name="arrow_forward" size={16} /></a>
                  {/if}
                {/if}
              </details>
            {/each}
          </div>
        {/if}

        {#if section.notice}<aside class="content-notice" role="note"><Icon name="emergency" size={20} /><span>{section.notice}</span></aside>{/if}
        {#if section.adaptadoDe}
          <p class="content-adapted">Adaptado de:
            {#each section.adaptadoDe as n, k}{#if k}{' · '}{/if}<a href={`#ref-fuente-${n}`}>{page.sources.find(s => s.n === n)?.short} [{n}]</a>{/each}
          </p>
        {/if}
      </section>
    {/each}

    {#if page.sources}<Fuentes sources={page.sources} prefix="ref" />{/if}

    {#if page.legalNote !== false}
      <LeyendaProfesional />
    {/if}

    {#if page.closing}
      <section class="content-closing" data-reveal>
        <div><p class="eyebrow">Más que Urticaria</p><h2>{page.closing.title}</h2>{#if page.closing.text}<p>{page.closing.text}</p>{/if}</div>
        {#if page.closing.cta.action}
          <button class="button" type="button" on:click={(event) => runAction(event, page.closing.cta.action)}>{page.closing.cta.label} <Icon name="arrow_forward" size={18} /></button>
        {:else}
          <a class="button" href={routeHref(page.closing.cta.route)}>{page.closing.cta.label} <Icon name="arrow_forward" size={18} /></a>
        {/if}
      </section>
    {/if}
  </div>
</main>
