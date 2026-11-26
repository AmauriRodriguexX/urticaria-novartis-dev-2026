<script>
  import { onMount } from 'svelte'
  import Icon from './Icon.svelte'

  // Fotografías clínicas reales de pacientes (Wikimedia Commons, licencias libres). Sin imágenes de banco ni generadas con IA.
  // Las fotos clínicas son de pacientes reales; cada una muestra su crédito. Fichas completas en ajustes-colega/imagenes/CREDITOS.md
  const photos = [
    { id: 1, title: 'Ronchas en la espalda', description: 'Ronchas tenues y rosados distribuidos en la espalda.', image: 'biblioteca/bib-01.jpg', credit: 'Foto: Ericalens, Wikimedia Commons · CC BY 3.0', className: 'photo-tall' },
    { id: 2, title: 'Ronchas en la mano', description: 'Ronchas rojizas y elevadas en el dorso de la mano, algunas unidas en placas.', image: 'biblioteca/bib-02.jpg', credit: 'Foto: Membeth, Wikimedia Commons · CC0', className: 'photo-wide' },
    { id: 3, title: 'Hinchazón de párpados y labios', description: 'Hinchazón (angioedema) en párpados, nariz y labios en una persona con urticaria crónica espontánea. Suele durar de 1 a 3 días.', image: 'biblioteca/bib-10-uce-angioedema.jpg', credit: 'Foto: Rezendevaleria, Wikimedia Commons · CC BY-SA 4.0', className: 'photo-tall' },
    { id: 4, title: 'Ronchas en el brazo', description: 'Ronchas rojizas de bordes bien definidos en el antebrazo.', image: 'biblioteca/bib-04.jpg', credit: 'Foto: Heckat, Wikimedia Commons · Dominio público', className: 'photo-tall' },
    { id: 5, title: 'Ronchas en el costado', description: 'Ronchas con forma de anillo en el costado: presentación típica de la urticaria crónica espontánea.', image: 'biblioteca/bib-11-uce-ronchas.jpg', credit: 'Foto: ECARF, Wikimedia Commons · CC BY 4.0', className: 'photo-standard' },
    { id: 6, title: 'Ronchas en la palma', description: 'Ronchas con forma de anillo en la palma de la mano.', image: 'biblioteca/bib-06.jpg', credit: 'Foto: Klaus D. Peter, Wikimedia Commons · CC BY 3.0 DE', className: 'photo-standard' },
    { id: 7, title: 'Ronchas en la pierna', description: 'Ronchas rosadas de bordes bien definidos en la pierna.', image: 'biblioteca/bib-07.jpg', credit: 'Foto: James Heilman, MD, Wikimedia Commons · CC BY-SA 4.0', className: 'photo-tall' },
    { id: 8, title: 'Hinchazón del labio', description: 'Hinchazón (angioedema) del labio. Si la hinchazón afecta la lengua o la garganta, o te cuesta respirar, busca atención urgente.', image: 'biblioteca/bib-08.jpg', credit: 'Foto: James Heilman, MD, Wikimedia Commons · CC BY-SA 3.0', className: 'photo-standard' },
    { id: 9, title: 'Ronchas en el pecho y el costado', description: 'Ronchas extensas y elevadas en el costado del tórax.', image: 'biblioteca/bib-09.jpg', credit: 'Foto: James Heilman, MD, Wikimedia Commons · CC BY-SA 3.0', className: 'photo-wide' }
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
      <h2 id="library-title">Biblioteca de imágenes</h2>
    </div>
    <p class="library-intro">La urticaria puede verse diferente en cada persona. Explora estas referencias y usa lo que observes para iniciar una conversación con un profesional de la salud.</p>
  </div>


  <div class="photo-masonry">
    {#each visiblePhotos as photo (photo.id)}
      <button class={`photo-tile ${photo.className}`} class:gallery-visible={revealed.has(photo.id)} use:reveal={photo.id} type="button" on:click={() => selected = photo} aria-label={`Abrir foto: ${photo.title}`}>
        <img src={asset(photo.image)} alt={photo.title} loading="lazy" />
        <span class="photo-credit">{photo.credit}</span>
        <span class="photo-caption"><strong>{photo.title}</strong><small>Ver descripción <Icon name="arrow_forward" size={16} /></small></span>
      </button>
    {/each}
  </div>

  <p class="library-note"><Icon name="info" size={16} /> Fotografías clínicas reales de pacientes (Wikimedia Commons); el crédito y la licencia aparecen en cada imagen. Son referencias educativas y no sustituyen una valoración médica.</p>
</section>

{#if selected}
  <div class="lightbox" role="dialog" aria-modal="true" aria-label={selected.title} tabindex="-1" on:click|self={closeLightbox} on:keydown={(event) => event.key === 'Escape' && closeLightbox()}>
    <div class="lightbox-inner">
      <button class="lightbox-close" type="button" aria-label="Cerrar imagen" on:click={closeLightbox}><Icon name="close" size={22} /></button>
      <img src={asset(selected.image)} alt={selected.title} />
      <div class="lightbox-copy">
        <p class="eyebrow">{selected.title}</p>
        <p>{selected.description}</p>
        <p class="lightbox-credit">{selected.credit}</p>
      </div>
      {#if visiblePhotos.length > 1}
        <button class="lightbox-arrow lightbox-prev" type="button" aria-label="Imagen anterior" on:click={() => move(-1)}><Icon name="arrow_back" size={22} /></button>
        <button class="lightbox-arrow lightbox-next" type="button" aria-label="Imagen siguiente" on:click={() => move(1)}><Icon name="arrow_forward" size={22} /></button>
      {/if}
    </div>
  </div>
{/if}
