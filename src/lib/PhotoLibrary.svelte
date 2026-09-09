<script>
  import { onMount } from 'svelte'
  import Icon from './Icon.svelte'

  const tones = [
    { id: 'todos', label: 'Todos' },
    { id: 'claro', label: 'Tono claro' },
    { id: 'medio-claro', label: 'Tono medio claro' },
    { id: 'medio', label: 'Tono medio' },
    { id: 'medio-oscuro', label: 'Tono medio oscuro' },
    { id: 'oscuro', label: 'Tono oscuro' }
  ]

  const photos = [
    { id: 1, tone: 'claro', title: 'Tono claro · brazo', description: 'Referencia visual de cambios sutiles en el brazo sobre un tono de piel claro.', image: 'library-tone-01.png', className: 'photo-tall' },
    { id: 2, tone: 'claro', title: 'Tono claro · hombro', description: 'Referencia visual para observar la piel y preparar preguntas para la consulta.', image: 'library-tone-02.png', className: 'photo-wide' },
    { id: 3, tone: 'medio-claro', title: 'Tono medio claro · cuello', description: 'Referencia visual de cambios que pueden notarse en el cuello sobre un tono medio claro.', image: 'library-tone-03.png', className: 'photo-standard' },
    { id: 4, tone: 'medio-claro', title: 'Tono medio claro · mano', description: 'Referencia visual para conversar sobre cambios visibles en manos y muñecas.', image: 'library-tone-04.png', className: 'photo-tall' },
    { id: 5, tone: 'medio', title: 'Tono medio · brazo', description: 'Referencia visual de cambios sutiles en el brazo sobre un tono de piel medio.', image: 'library-tone-05.png', className: 'photo-wide' },
    { id: 6, tone: 'medio', title: 'Tono medio · hombro', description: 'Referencia visual para observar la piel con iluminación natural y uniforme.', image: 'library-tone-06.png', className: 'photo-standard' },
    { id: 7, tone: 'medio-oscuro', title: 'Tono medio oscuro · cuello', description: 'Referencia visual para recordar que los cambios pueden verse distintos en cada piel.', image: 'library-tone-07.png', className: 'photo-tall' },
    { id: 8, tone: 'medio-oscuro', title: 'Tono medio oscuro · brazo', description: 'Referencia visual de cambios discretos sobre un tono medio oscuro.', image: 'library-tone-08.png', className: 'photo-wide' },
    { id: 9, tone: 'oscuro', title: 'Tono oscuro · mano', description: 'Referencia visual para observar cambios en manos y llevar preguntas a consulta.', image: 'library-tone-09.png', className: 'photo-standard' },
    { id: 10, tone: 'oscuro', title: 'Tono oscuro · hombro', description: 'Referencia visual con iluminación cuidada para conservar el tono natural de la piel.', image: 'library-tone-10.png', className: 'photo-tall' }
  ]

  let activeTone = 'todos'
  let selected = null
  let revealed = new Set()

  $: visiblePhotos = activeTone === 'todos' ? photos : photos.filter(photo => photo.tone === activeTone)

  function asset(name) {
    return `${import.meta.env.BASE_URL}assets/img/${name}`
  }

  function closeLightbox() {
    selected = null
  }

  function reveal(node, id) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      revealed = new Set(revealed).add(id)
      observer.unobserve(node)
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' })
    observer.observe(node)
    return { destroy: () => observer.disconnect() }
  }

  function move(direction) {
    if (!selected) return
    const index = visiblePhotos.findIndex(photo => photo.id === selected.id)
    const next = (index + direction + visiblePhotos.length) % visiblePhotos.length
    selected = visiblePhotos[next]
  }

  onMount(() => {
    const handleKeydown = (event) => {
      if (!selected) return
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowRight') move(1)
      if (event.key === 'ArrowLeft') move(-1)
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  })
</script>

<section class="photo-library" id="biblioteca" aria-labelledby="library-title">
  <div class="library-heading">
    <div>
      <p class="eyebrow">Entender también es mirar</p>
      <h2 id="library-title">Biblioteca de fotos por tono de piel</h2>
    </div>
    <p class="library-intro">La urticaria puede verse diferente en cada piel. Explora estas referencias y usa lo que observes para iniciar una conversación con un profesional de la salud.</p>
  </div>

  <div class="tone-filters" role="tablist" aria-label="Filtrar fotos por tono de piel">
    {#each tones as tone}
      <button type="button" role="tab" aria-selected={activeTone === tone.id} class:active={activeTone === tone.id} on:click={() => activeTone = tone.id}>{tone.label}</button>
    {/each}
  </div>

  <div class="photo-masonry">
    {#each visiblePhotos as photo (photo.id)}
      <button class={`photo-tile ${photo.className}`} class:gallery-visible={revealed.has(photo.id)} use:reveal={photo.id} type="button" on:click={() => selected = photo} aria-label={`Abrir foto: ${photo.title}`}>
        <img src={asset(photo.image)} alt={photo.title} loading="lazy" />
        <span class="photo-caption"><strong>{photo.title}</strong><small>Ver descripción <Icon name="arrow_forward" size={16} /></small></span>
      </button>
    {/each}
  </div>

  <p class="library-note"><Icon name="info" size={16} /> Estas imágenes son referencias educativas y no sustituyen una valoración médica.</p>
</section>

{#if selected}
  <div class="lightbox" role="dialog" aria-modal="true" aria-label={selected.title} tabindex="-1" on:click|self={closeLightbox} on:keydown={(event) => event.key === 'Escape' && closeLightbox()}>
    <div class="lightbox-inner">
      <button class="lightbox-close" type="button" aria-label="Cerrar imagen" on:click={closeLightbox}><Icon name="close" size={22} /></button>
      <img src={asset(selected.image)} alt={selected.title} />
      <div class="lightbox-copy">
        <p class="eyebrow">{selected.title}</p>
        <p>{selected.description}</p>
      </div>
      {#if visiblePhotos.length > 1}
        <button class="lightbox-arrow lightbox-prev" type="button" aria-label="Imagen anterior" on:click={() => move(-1)}><Icon name="arrow_back" size={22} /></button>
        <button class="lightbox-arrow lightbox-next" type="button" aria-label="Imagen siguiente" on:click={() => move(1)}><Icon name="arrow_forward" size={22} /></button>
      {/if}
    </div>
  </div>
{/if}
