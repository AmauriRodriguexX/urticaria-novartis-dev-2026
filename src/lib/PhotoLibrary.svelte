<script>
  import { onMount } from 'svelte'
  import Icon from './Icon.svelte'

  // Fotos ordenadas por zona del cuerpo y síntoma (sin clasificar por tono de piel).
  const photos = [
    { id: 1, title: 'Brazo', description: 'Referencia visual de cambios en la piel del brazo para comentarlos en consulta.', image: 'library-tone-01.png', className: 'photo-tall' },
    { id: 2, title: 'Hombro', description: 'Referencia visual para observar la piel y preparar preguntas para la consulta.', image: 'library-tone-02.png', className: 'photo-wide' },
    { id: 3, title: 'Cuello', description: 'Referencia visual de cambios que pueden notarse en el cuello.', image: 'library-tone-03.png', className: 'photo-standard' },
    { id: 4, title: 'Mano', description: 'Referencia visual para conversar sobre cambios visibles en manos y muñecas.', image: 'library-tone-04.png', className: 'photo-tall' },
    { id: 5, title: 'Antebrazo', description: 'Referencia visual de cambios sutiles en el antebrazo.', image: 'library-tone-05.png', className: 'photo-wide' },
    { id: 6, title: 'Espalda y hombro', description: 'Referencia visual para observar la piel con iluminación natural y uniforme.', image: 'library-tone-06.png', className: 'photo-standard' },
    { id: 7, title: 'Cuello y escote', description: 'Los cambios en la piel pueden verse distintos en cada persona.', image: 'library-tone-07.png', className: 'photo-tall' },
    { id: 8, title: 'Brazo, vista lateral', description: 'Referencia visual de cambios discretos en el brazo.', image: 'library-tone-08.png', className: 'photo-wide' },
    { id: 9, title: 'Dorso de la mano', description: 'Referencia visual para observar cambios en manos y llevar preguntas a consulta.', image: 'library-tone-09.png', className: 'photo-standard' },
    { id: 10, title: 'Hombro, vista posterior', description: 'Referencia visual con iluminación cuidada para observar la piel.', image: 'library-tone-10.png', className: 'photo-tall' }
  ]

  let selected = null
  let revealed = new Set()

  const visiblePhotos = photos

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
      <h2 id="library-title">Biblioteca visual de la urticaria</h2>
    </div>
    <p class="library-intro">La urticaria puede verse diferente en cada persona. Explora estas referencias y usa lo que observes para iniciar una conversación con un profesional de la salud.</p>
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
