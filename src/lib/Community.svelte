<script>
  import Icon from './Icon.svelte'

  const topics = [
    { id: 'todos', label: 'Todo' },
    { id: 'historias', label: 'Historias' },
    { id: 'consulta', label: 'Preparar mi consulta' },
    { id: 'dia-a-dia', label: 'Día a día' }
  ]
  let posts = [
    { id: 1, topic: 'historias', tag: 'Historias', title: 'Cuando dejé de minimizar lo que sentía', body: 'Anotar cuándo aparecía la comezón me ayudó a explicarlo mejor en consulta.', author: 'Mariana R.', time: 'Hace 2 h', votes: 48, comments: 12, liked: false, thread: [{ id: 11, author: 'Sofía L.', body: 'Me pasó algo parecido. Llevar notas hizo más fácil explicar los días difíciles.', replies: [{ id: 111, author: 'Mariana R.', body: 'Sí, escribirlo también me ayudó a ver patrones.' }] }, { id: 12, author: 'Carlos T.', body: 'Gracias por compartirlo, no sabía por dónde empezar.', replies: [] }] },
    { id: 2, topic: 'consulta', tag: 'Preparar mi consulta', title: '¿Qué información les ha servido llevar?', body: 'Estoy preparando mi primera consulta con dermatología. ¿Qué preguntas les ayudaron?', author: 'Leo M.', time: 'Hace 5 h', votes: 31, comments: 9, liked: false, thread: [{ id: 21, author: 'Nadia G.', body: 'Yo llevé fotos con fecha y una lista de lo que había cambiado.', replies: [] }] },
    { id: 3, topic: 'dia-a-dia', tag: 'Día a día', title: 'Encontrar pequeños espacios de calma', body: 'Compartir cómo me afecta en el sueño me hizo sentir menos solo y más preparado.', author: 'Ana P.', time: 'Ayer', votes: 76, comments: 18, liked: false, thread: [{ id: 31, author: 'Diego A.', body: 'Leer esto me hizo sentir acompañado. Gracias.', replies: [{ id: 311, author: 'Ana P.', body: 'Qué bueno que te sirvió leerlo.' }] }] }
  ]
  let activeTopic = 'todos', search = '', composerOpen = false, authorAlias = '', draftTitle = '', draft = '', openComments = {}, commentDrafts = {}, replyDrafts = {}, replyingTo = null
  $: visiblePosts = posts.filter(post => {
    const matchesTopic = activeTopic === 'todos' || post.topic === activeTopic
    const query = search.trim().toLowerCase()
    return matchesTopic && (!query || `${post.title} ${post.body} ${post.tag}`.toLowerCase().includes(query))
  })
  function toggleLike(id) { posts = posts.map(post => post.id === id ? { ...post, liked: !post.liked, votes: post.votes + (post.liked ? -1 : 1) } : post) }
  function toggleComments(id) { openComments = { ...openComments, [id]: !openComments[id] } }
  function addComment(id) {
    const body = (commentDrafts[id] || '').trim()
    if (!body) return
    posts = posts.map(post => post.id === id ? { ...post, comments: post.comments + 1, thread: [...(post.thread || []), { id: Date.now(), author: authorAlias.trim() || 'Anónimo', body, replies: [] }] } : post)
    commentDrafts = { ...commentDrafts, [id]: '' }
  }
  function addReply(postId, commentId) {
    const body = (replyDrafts[commentId] || '').trim()
    if (!body) return
    posts = posts.map(post => post.id === postId ? { ...post, comments: post.comments + 1, thread: post.thread.map(comment => comment.id === commentId ? { ...comment, replies: [...comment.replies, { id: Date.now(), author: authorAlias.trim() || 'Anónimo', body }] } : comment) } : post)
    replyDrafts = { ...replyDrafts, [commentId]: '' }
    replyingTo = null
  }
  function publish() {
    if (!authorAlias.trim() || !draftTitle.trim() || !draft.trim()) return
    posts = [{ id: Date.now(), topic: 'historias', tag: 'Nueva historia', title: draftTitle.trim(), body: draft.trim(), author: authorAlias.trim(), time: 'Ahora', votes: 1, comments: 0, liked: true, thread: [] }, ...posts]
    draftTitle = ''; draft = ''; composerOpen = false; activeTopic = 'todos'
  }
</script>

<section class="community" id="comunidad" aria-labelledby="community-title">
  <div class="community-hero">
    <div class="community-copy"><p class="eyebrow">Un lugar para hablarlo</p><h2 id="community-title">No lo estás imaginando.</h2><p>Hay días en los que la comezón ocupa demasiado espacio. Aquí puedes leer experiencias, encontrar palabras para contar la tuya y recordar que no tienes que atravesarlo a solas.</p><button class="button community-cta" type="button" on:click={() => composerOpen = !composerOpen}><Icon name="groups" size={20} /><span>{composerOpen ? 'Cerrar historia' : 'Compartir mi experiencia'}</span></button></div>
    <div class="community-stat"><strong>1</strong><span>conversación puede ser el comienzo de sentirte acompañado.</span></div>
  </div>
  {#if composerOpen}<div class="community-composer rise"><label for="community-alias">Tu alias en la comunidad</label><input id="community-alias" class="composer-title" bind:value={authorAlias} maxlength="32" placeholder="Ej. Mariposa azul" /><small class="composer-hint">Usa un alias; no compartas tu nombre real.</small><label for="community-title-draft">Título de tu historia</label><input id="community-title-draft" class="composer-title" bind:value={draftTitle} maxlength="90" placeholder="Escribe un título claro y breve" /><label for="community-draft">Comparte algo que te gustaría que otra persona leyera</label><textarea id="community-draft" bind:value={draft} maxlength="420" placeholder="Escribe tu experiencia, una pregunta o algo que te haya ayudado..."></textarea><div class="composer-footer"><small>{draftTitle.length}/90 · {draft.length}/420 · Tu historia será revisada antes de publicarse.</small><button class="outline" type="button" on:click={publish} disabled={!authorAlias.trim() || !draftTitle.trim() || !draft.trim()}>Publicar historia</button></div></div>{/if}
  <div class="community-toolbar"><div class="community-tabs" role="tablist" aria-label="Filtrar conversaciones">{#each topics as topic}<button type="button" role="tab" aria-selected={activeTopic === topic.id} class:active={activeTopic === topic.id} on:click={() => activeTopic = topic.id}>{topic.label}</button>{/each}</div><label class="community-search"><span class="sr-only">Buscar conversaciones</span><input bind:value={search} type="search" placeholder="Buscar historias" /><span aria-hidden="true">⌕</span></label></div>
  <div class="community-layout"><div class="community-feed" aria-live="polite">{#each visiblePosts as post (post.id)}<article class="community-post"><div class="post-votes"><button type="button" class:liked={post.liked} aria-label={post.liked ? 'Quitar apoyo' : 'Apoyar esta historia'} on:click={() => toggleLike(post.id)}>↑</button><strong>{post.votes}</strong><span>apoyos</span></div><div class="post-main"><span class="post-tag">{post.tag}</span><h3>{post.title}</h3><p>{post.body}</p><footer><span>{post.author} · {post.time}</span><button class="post-comments" type="button" on:click={() => toggleComments(post.id)}><Icon name="groups" size={15} /> {post.comments} comentarios</button></footer>{#if openComments[post.id]}<div class="comment-thread"><h4>Conversación</h4>{#each post.thread as comment (comment.id)}<div class="comment"><div><strong>{comment.author}</strong><p>{comment.body}</p><button class="reply-button" type="button" on:click={() => replyingTo = comment.id}>Responder</button></div>{#each comment.replies as reply (reply.id)}<div class="reply"><strong>{reply.author}</strong><p>{reply.body}</p></div>{/each}{#if replyingTo === comment.id}<div class="reply-form"><input bind:value={replyDrafts[comment.id]} placeholder="Escribe una respuesta" aria-label="Escribe una respuesta" on:keydown={(event) => event.key === 'Enter' && addReply(post.id, comment.id)} /><button type="button" aria-label="Publicar respuesta" on:click={() => addReply(post.id, comment.id)}><Icon name="arrow_forward" size={16} /></button></div>{/if}</div>{/each}<div class="comment-form"><input bind:value={commentDrafts[post.id]} placeholder="Añade un comentario" aria-label="Añade un comentario" on:keydown={(event) => event.key === 'Enter' && addComment(post.id)} /><button type="button" aria-label="Publicar comentario" on:click={() => addComment(post.id)}><Icon name="arrow_forward" size={16} /></button></div></div>{/if}</div></article>{:else}<div class="community-empty"><strong>No encontramos esa conversación.</strong><span>Prueba con otro tema o palabra.</span></div>{/each}</div><aside class="community-aside"><div class="community-card"><Icon name="groups" size={22} /><h3>Un espacio cuidado</h3><p>Las historias son una forma de acompañarnos, no un sustituto de la consulta médica.</p></div><div class="community-card community-guidelines"><h3>Antes de publicar</h3><p>No compartas datos personales, teléfonos ni información que identifique a otra persona.</p><button class="text" type="button" on:click={() => composerOpen = true}>Leer las reglas <Icon name="arrow_forward" size={17} /></button></div></aside></div>
</section>
