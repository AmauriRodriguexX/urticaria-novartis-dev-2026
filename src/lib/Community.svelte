<script>
  import { onMount, tick } from 'svelte'
  import Icon from './Icon.svelte'
  import { routeHref } from './siteContent.js'
  import { reveal } from './reveal.js'
  import { casos, iniciales } from './testimonios.js'

  const base = import.meta.env.BASE_URL

  const topics = [
    { id: 'todos', label: 'Todo' },
    { id: 'historias', label: 'Historias' },
    { id: 'consulta', label: 'Preparar mi consulta' },
    { id: 'dia-a-dia', label: 'Día a día' }
  ]
  const posts = [
    { id: 1, topic: 'historias', tag: 'Historias', title: 'Pensé que podía ser algo que comía', body: '“Quiero entender qué puede significar lo que observo y qué preguntas puedo llevar a consulta.”', type: 'Experiencia de muestra' },
    { id: 2, topic: 'consulta', tag: 'Preparar mi consulta', title: 'La picazón afecta mi descanso', body: '“Estoy anotando cómo se presentan las molestias y cómo influyen en mi rutina para comentarlo con un profesional.”', type: 'Experiencia de muestra' },
    { id: 3, topic: 'dia-a-dia', tag: 'Día a día', title: 'Acompañar a alguien de mi familia', body: '“Me preocupa la picazón que tiene mi hijo. Quiero ordenar lo que observo para conversarlo en consulta.”', type: 'Experiencia de muestra' }
  ]

  let activeTopic = 'todos'
  let search = ''
  let shareInfoOpen = false
  // Prototipo: las historias enviadas se guardan solo en este navegador (no hay servidor ni moderación todavía).
  const STORE_KEY = 'mqu-historias-prototipo'
  let userPosts = []
  onMount(() => {
    try { userPosts = JSON.parse(localStorage.getItem(STORE_KEY) || '[]') } catch { userPosts = [] }
  })
  function saveUserPosts() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(userPosts)) } catch { /* sin almacenamiento, la historia vive hasta recargar */ }
  }
  function removePost(id) {
    userPosts = userPosts.filter(post => post.id !== id)
    saveUserPosts()
  }

  $: visiblePosts = [...userPosts, ...posts].filter(post => {
    const matchesTopic = activeTopic === 'todos' || post.topic === activeTopic
    const query = search.trim().toLowerCase()
    return matchesTopic && (!query || `${post.title} ${post.body} ${post.tag}`.toLowerCase().includes(query))
  })

  // Formulario para compartir. Anónimo por defecto: el nombre solo se pide si la persona elige mostrarlo.
  let form = { visibility: 'anonimo', name: '', age: '', city: '', topic: 'historias', title: '', story: '', consent: false }
  let sent = false
  $: publicName = form.visibility === 'nombre' && form.name.trim()
    ? [form.name.trim(), form.age && `${form.age} años`, form.city.trim()].filter(Boolean).join(' · ')
    : 'Anónimo'

  async function openShare() {
    shareInfoOpen = true
    sent = false
    await tick()
    document.getElementById('compartir')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    document.getElementById('share-title')?.focus({ preventScroll: true })
  }

  async function submitStory() {
    const topic = topics.find(t => t.id === form.topic) || topics[1]
    userPosts = [{ id: `u${Date.now()}`, own: true, topic: topic.id, tag: topic.label, title: form.title.trim(), body: `“${form.story.trim()}”`, author: publicName }, ...userPosts]
    saveUserPosts()
    activeTopic = 'todos'
    search = ''
    sent = true
    await tick()
    document.querySelector('.community-post-own')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  function resetForm() {
    form = { visibility: 'anonimo', name: '', age: '', city: '', topic: 'historias', title: '', story: '', consent: false }
    sent = false
  }
</script>

<section class="community" id="comunidad" aria-labelledby="community-title">
  <div class="community-hero">
    <div class="community-copy">
      <p class="eyebrow">Testimonios</p>
      <h1 id="community-title">Historias Reales de Urticaria Crónica Espontánea: No Estás Solo</h1>
      <p>Detrás de cada brote hay una historia de resiliencia. Conoce los testimonios de personas que, al igual que tú, enfrentaron la incertidumbre, encontraron el tratamiento adecuado y volvieron a tomar el control de su vida.</p>
      <button class="button community-cta" type="button" aria-expanded={shareInfoOpen} aria-controls="compartir" on:click={() => shareInfoOpen ? (shareInfoOpen = false) : openShare()}><Icon name="groups" size={20} /><span>{shareInfoOpen ? 'Cerrar formulario' : 'Compartir mi Historia'}</span></button>
    </div>
    <div class="community-stat"><span>Las historias de la comunidad se publican con autorización y revisión del equipo médico.</span></div>
  </div>

  {#if shareInfoOpen}
    <div class="community-composer" id="compartir">
      {#if sent}
        <div class="composer-sent" role="status">
          <h2>Gracias por querer compartir tu historia</h2>
          <p>Tu historia ya aparece en <b>Historias compartidas por la comunidad</b> como <b>{publicName}</b>. En este prototipo solo se ve en tu navegador; en el sitio final el equipo médico la revisará antes de publicarla para todos.</p>
          <div class="composer-sent-actions"><button class="button" type="button" on:click={() => document.querySelector('.community-post-own')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>Ver mi historia <Icon name="arrow_forward" size={18} /></button><button class="button secondary" type="button" on:click={resetForm}>Escribir otra historia</button></div>
        </div>
      {:else}
        <form class="composer-form" on:submit|preventDefault={submitStory}>
          <h2>Comparte tu historia</h2>
          <fieldset class="composer-visibility">
            <legend>¿Cómo quieres que aparezca?</legend>
            <label class:chosen={form.visibility === 'anonimo'}><input type="radio" bind:group={form.visibility} value="anonimo" /> <span><strong>Anónima</strong><small>No pedimos ni publicamos tu nombre.</small></span></label>
            <label class:chosen={form.visibility === 'nombre'}><input type="radio" bind:group={form.visibility} value="nombre" /> <span><strong>Con mi nombre</strong><small>Tú decides qué datos mostrar.</small></span></label>
          </fieldset>

          {#if form.visibility === 'nombre'}
            <div class="composer-row">
              <label>Nombre o seudónimo<input class="composer-title" bind:value={form.name} required maxlength="40" autocomplete="given-name" placeholder="Ej. Mariana S." /></label>
              <label>Edad <small>(opcional)</small><input class="composer-title" bind:value={form.age} type="number" min="1" max="110" inputmode="numeric" /></label>
              <label>Ciudad <small>(opcional)</small><input class="composer-title" bind:value={form.city} maxlength="40" autocomplete="address-level2" /></label>
            </div>
          {/if}

          <label for="share-topic">Tema</label>
          <select id="share-topic" class="composer-title" bind:value={form.topic}>
            {#each topics.slice(1) as topic}<option value={topic.id}>{topic.label}</option>{/each}
          </select>
          <label for="share-title">Título</label>
          <input id="share-title" class="composer-title" bind:value={form.title} required maxlength="80" placeholder="Ej. Pensé que era alergia a la comida" />
          <label for="share-story">Tu historia</label>
          <textarea id="share-story" bind:value={form.story} required maxlength="1200" placeholder="Cuéntanos qué viviste, qué te ayudó y qué te gustaría que otras personas supieran."></textarea>
          <span class="composer-hint">{form.story.length}/1200 · No incluyas teléfonos, correos ni nombres de médicos.</span>

          <label class="composer-consent" for="share-consent"><input id="share-consent" type="checkbox" bind:checked={form.consent} required /> <span>Acepto que el equipo médico revise mi historia antes de publicarla.</span></label>

          <div class="composer-footer">
            <p class="composer-preview">Se publicará como: <b>{publicName}</b></p>
            <button class="button" type="submit">Enviar mi historia <Icon name="arrow_forward" size={18} /></button>
          </div>
        </form>
      {/if}
    </div>
  {/if}
</section>

<div class="community-followup content-sections" use:reveal>
  <section class="content-section" aria-labelledby="community-cases-title" data-reveal>
    <h2 id="community-cases-title">Casos reales de urticaria: Volviendo a vivir sin limitaciones</h2>
    <p class="content-section-intro">Explora cómo diferentes pacientes mexicanos lograron superar la frustración inicial y reducir la urticaria a la parte más pequeña de sus vidas.</p>
    <div class="content-card-grid">
      {#each casos as caso}
        <article class="home-story-card testimonial-case">
          <span class="home-story-mark" aria-hidden="true">“</span>
          <h3>{caso.name}, {caso.detail} – “{caso.title}”</h3>
          <blockquote>{caso.story}</blockquote>
          <footer>
            <span class="home-story-avatar testimonial-photo">{#if caso.photo}<img src={`${base}${caso.photo}`} alt={`Retrato de ${caso.name}`} loading="lazy" />{:else}<span aria-hidden="true">{iniciales(caso.name)}</span>{/if}</span>
            <small>{caso.name} · {caso.detail}</small>
          </footer>
        </article>
      {/each}
    </div>
  </section>
</div>

<section class="community community-ugc" aria-labelledby="community-ugc-title">
  <div class="community-copy">
    <h2 id="community-ugc-title">Historias compartidas por la comunidad</h2>
    <p>Cada experiencia compartida suma aliento para quienes recién comienzan su camino hacia el diagnóstico.</p>
  </div>

  <div class="community-toolbar">
    <div class="community-tabs" role="tablist" aria-label="Filtrar relatos por tema">
      {#each topics as topic}<button type="button" role="tab" aria-selected={activeTopic === topic.id} class:active={activeTopic === topic.id} on:click={() => activeTopic = topic.id}>{topic.label}</button>{/each}
    </div>
    <label class="community-search"><span class="sr-only">Buscar relatos</span><input bind:value={search} type="search" placeholder="Buscar historias" /><span aria-hidden="true">⌕</span></label>
  </div>

  <div class="community-layout">
    <div class="community-feed" aria-live="polite">
      {#each visiblePosts as post (post.id)}
        {#if post.own}
          <article class="community-post community-post-sample community-post-own">
            <div class="post-main"><span class="post-tag">{post.tag} · {post.author}</span><h3>{post.title}</h3><blockquote>{post.body}</blockquote><footer><span>Prototipo · solo visible en este navegador</span><button class="text" type="button" on:click={() => removePost(post.id)}>Quitar</button></footer></div>
          </article>
        {:else}
          <article class="community-post community-post-sample">
            <div class="post-main"><span class="post-tag">{post.tag} · {post.type}</span><h3>{post.title}</h3><blockquote>{post.body}</blockquote><footer><span>Ejemplo representativo · sin autor real</span></footer></div>
          </article>
        {/if}
      {:else}
        <div class="community-empty"><strong>No encontramos relatos para esa búsqueda.</strong><span>Prueba con otro tema o palabra.</span></div>
      {/each}
    </div>
    <aside class="community-aside">
      <div class="community-card"><Icon name="groups" size={22} /><h3>Historias reales: El camino desde el aislamiento hasta el diagnóstico</h3><p>La mayoría de las personas con urticaria crónica atraviesan por etapas de frustración, aislamiento y agotamiento físico. Leer o escuchar testimonios de urticaria ayuda a entender que tus síntomas son reales, que no estás exagerando y que existe una comunidad que comprende por lo que estás pasando.</p></div>
      <div class="community-card community-guidelines"><p>El punto de inflexión en todos los casos exitosos siempre ha sido el mismo: acudir con un dermatólogo o alergólogo capacitado y comprometerse con el plan de tratamiento prescrito.</p><a class="text" href={routeHref('directorio-medico')}>Buscar especialista <Icon name="arrow_forward" size={17} /></a></div>
    </aside>
  </div>
</section>

<div class="community-followup content-sections" use:reveal>
  <section class="content-section" aria-labelledby="community-faq-title" data-reveal>
    <h2 id="community-faq-title">Preguntas frecuentes sobre las historias de pacientes</h2>
    <div class="content-faqs">
      <details><summary><span>¿Puedo compartir mi testimonio de forma anónima?</span><i aria-hidden="true"></i></summary><p>Sí. Sabemos que la salud cutánea es un tema muy personal. Si deseas compartir tu historia para inspirar a otros pero prefieres resguardar tu identidad, podemos usar un seudónimo.</p></details>
      <details><summary><span>¿Cómo puedo ponerme en contacto con un especialista?</span><i aria-hidden="true"></i></summary><p>Puedes acceder directamente a nuestro <a href={routeHref('directorio-medico')}>Directorio Médico</a> para ubicar dermatólogos y alergólogos certificados cerca de tu localidad.</p></details>
    </div>
  </section>
  <section class="content-closing" data-reveal><div><p class="eyebrow">Más que Urticaria</p><h2>¿Quieres compartir cómo hiciste a la urticaria más pequeña en tu vida?</h2><p>Tu historia puede ser el impulso que alguien necesita para acudir al especialista y transformar su calidad de vida.</p></div><button class="button" type="button" on:click={openShare}>Enviar mi Testimonio <Icon name="arrow_forward" size={18} /></button></section>
</div>
