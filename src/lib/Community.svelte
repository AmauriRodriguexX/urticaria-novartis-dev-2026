<script>
  import Icon from './Icon.svelte'
  import { routeHref } from './siteContent.js'
  import { reveal } from './reveal.js'

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
  $: visiblePosts = posts.filter(post => {
    const matchesTopic = activeTopic === 'todos' || post.topic === activeTopic
    const query = search.trim().toLowerCase()
    return matchesTopic && (!query || `${post.title} ${post.body} ${post.tag}`.toLowerCase().includes(query))
  })

</script>

<section class="community" id="comunidad" aria-labelledby="community-title">
  <div class="community-hero">
    <div class="community-copy">
      <p class="eyebrow">Testimonios</p>
      <h1 id="community-title">Historias compartidas por la comunidad</h1>
      <p>Cada experiencia compartida puede acompañar a quienes comienzan su camino para entender la urticaria crónica espontánea.</p>
      <button class="button community-cta" type="button" aria-expanded={shareInfoOpen} on:click={() => shareInfoOpen = !shareInfoOpen}><Icon name="groups" size={20} /><span>{shareInfoOpen ? 'Cerrar información' : 'Compartir mi historia'}</span></button>
    </div>
    <div class="community-stat"><span>Las historias reales se publicarán con autorización y revisión.</span></div>
  </div>

  {#if shareInfoOpen}
    <div class="community-composer" role="status"><p>La recepción de historias se habilitará cuando esté disponible el proceso de autorización y revisión. Mientras tanto, puedes explorar los recursos del sitio.</p><a class="button secondary" href={routeHref('recursos-herramientas')}>Conoce nuestros recursos <Icon name="arrow_forward" size={17} /></a></div>
  {/if}

  <div class="community-toolbar">
    <div class="community-tabs" role="tablist" aria-label="Filtrar relatos por tema">
      {#each topics as topic}<button type="button" role="tab" aria-selected={activeTopic === topic.id} class:active={activeTopic === topic.id} on:click={() => activeTopic = topic.id}>{topic.label}</button>{/each}
    </div>
    <label class="community-search"><span class="sr-only">Buscar relatos</span><input bind:value={search} type="search" placeholder="Buscar historias" /><span aria-hidden="true">⌕</span></label>
  </div>

  <div class="community-layout">
    <div class="community-feed" aria-live="polite">
      {#each visiblePosts as post (post.id)}
        <article class="community-post community-post-sample">
          <div class="post-main"><span class="post-tag">{post.tag} · {post.type}</span><h2>{post.title}</h2><blockquote>{post.body}</blockquote><footer><span>Ejemplo representativo · sin autor real</span></footer></div>
        </article>
      {:else}
        <div class="community-empty"><strong>No encontramos relatos para esa búsqueda.</strong><span>Prueba con otro tema o palabra.</span></div>
      {/each}
    </div>
    <aside class="community-aside">
      <div class="community-card"><Icon name="groups" size={22} /><h2>Historias para acompañar</h2><p>Compartir experiencias puede ayudar a encontrar palabras para conversar sobre los síntomas con un profesional de la salud.</p></div>
      <div class="community-card community-guidelines"><h2>Un espacio cuidado</h2><p>Los testimonios reales requieren autorización. Evita compartir datos personales o información que identifique a otra persona.</p><a class="text" href={routeHref('recursos-herramientas')}>Explora recursos <Icon name="arrow_forward" size={17} /></a></div>
    </aside>
  </div>
</section>

<div class="community-followup content-sections" use:reveal>
  <section class="content-section" aria-labelledby="community-faq-title" data-reveal>
    <h2 id="community-faq-title">Preguntas frecuentes sobre las historias</h2>
    <div class="content-faqs">
      <details><summary><span>¿Puedo compartir mi testimonio de forma anónima?</span><i aria-hidden="true"></i></summary><p>Cuando el envío esté habilitado, se explicará cómo elegir un seudónimo y qué información se puede compartir.</p></details>
      <details><summary><span>¿Cómo puedo ponerme en contacto con un especialista?</span><i aria-hidden="true"></i></summary><p>Explora los recursos informativos del sitio para preparar una conversación con un profesional de la salud.</p></details>
    </div>
  </section>
  <section class="content-closing" data-reveal><div><p class="eyebrow">Más que Urticaria</p><h2>Mientras tanto, consulta los recursos disponibles</h2><p>Explora herramientas para reconocer y registrar tus síntomas.</p></div><a class="button" href={routeHref('recursos-herramientas')}>Ir a Recursos <Icon name="arrow_forward" size={18} /></a></section>
</div>
