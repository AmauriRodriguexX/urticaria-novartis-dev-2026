<script>
  import { assetsFor } from './context.js'
  import Icon from './Icon.svelte'
  export let copy
  export let onQuiz
  export let ctx = 'dia'
  export let videosMode = false
  export let autoVideo = false

  $: a = assetsFor(ctx)
  $: videoSrc = a.video

  let ctaOffscreen = false
  let videoAvailable = true

  // Mantiene el acceso al test a mano cuando el hero ya quedó fuera de pantalla.
  function watchCta(node) {
    const io = new IntersectionObserver(([e]) => { ctaOffscreen = !e.isIntersecting && e.boundingClientRect.top < 0 }, { threshold: 0 })
    io.observe(node)
    return { destroy() { io.disconnect(); ctaOffscreen = false } }
  }
</script>

{#key `${ctx}-${autoVideo ? 'auto' : 'manual'}`}
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-media" aria-hidden="true">
    <picture>
      <source media="(max-width: 1023px)" srcset={a.mobile} width="1080" height="1350" />
      <img src={a.desktop} alt="" fetchpriority="high" decoding="async" width="1920" height="1080" />
    </picture>
    {#if videosMode && videoAvailable}
      <video
        class="hero-video"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        poster={a.desktop}
        on:error={() => videoAvailable = false}
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    {/if}
    <div class="hero-shade"></div>
  </div>

  <div class="hero-copy rise">
    <p class="kicker"><i aria-hidden="true"></i>{copy.kicker}</p>
    <h1 id="hero-title">{copy.title}</h1>
    <p class="intro">{copy.intro}</p>
    <div class="action-row" use:watchCta>
      <button class="button" on:click={onQuiz}><span>{copy.primaryCta}</span><Icon name="arrow_forward" size={20} /></button>
      <button class="button hero-secondary" on:click={(event) => onQuiz(event, 'map')}><span>{copy.secondaryCta}</span><Icon name="arrow_forward" size={20} /></button>
    </div>
    {#if copy.note}<small class="hero-disclaimer">{copy.note}</small>{/if}
  </div>
  <small class="hero-img-note">Imagen ilustrativa: no representa a una persona real.</small>
</section>
{/key}

{#if ctaOffscreen}
  <div class="sticky-cta" role="region" aria-label="Acceso rápido al quiz">
    <button class="button" on:click={onQuiz}><span>{copy.primaryCta}</span><Icon name="arrow_forward" size={20} /></button>
  </div>
{/if}
