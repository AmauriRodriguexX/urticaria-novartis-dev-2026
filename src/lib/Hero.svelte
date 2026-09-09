<script>
  import { onMount } from 'svelte'
  import { assetsFor } from './context.js'
  import Icon from './Icon.svelte'
  export let copy
  export let target = 1240
  export let onQuiz
  export let word = copy[2]
  export let ctx = 'dia'
  export let videosMode = false
  export let autoVideo = false

  $: a = assetsFor(ctx)
  $: videoSrc = autoVideo ? `${import.meta.env.BASE_URL}assets/video/hero-dia-auto.mp4` : a.video

  let animated = 0, mounted = false, frame
  let ctaOffscreen = false
  let videoAvailable = true

  // Acción: se reengancha en cada render del hero (el {#key ctx} lo recrea al cambiar de vista).
  function watchCta(node) {
    const io = new IntersectionObserver(([e]) => { ctaOffscreen = !e.isIntersecting && e.boundingClientRect.top < 0 }, { threshold: 0 })
    io.observe(node)
    return { destroy() { io.disconnect(); ctaOffscreen = false } }
  }

  function animateCounter(value) {
    cancelAnimationFrame(frame)
    animated = 0
    const started = performance.now(), duration = 900
    const tick = (now) => {
      const p = Math.min(1, (now - started) / duration)
      animated = Math.round(value * (1 - Math.pow(1 - p, 3)))
      if (p < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
  }
  $: if (mounted && target != null && ctx) animateCounter(target)

  onMount(() => {
    mounted = true
    return () => cancelAnimationFrame(frame)
  })
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
    <p class="kicker"><i aria-hidden="true"></i>{copy[0]}</p>
    <h1 id="hero-title">{copy[1]}<em>{word}</em>{copy[3]}</h1>
    <p class="intro">{copy[4]}</p>
    <div class="action-row" use:watchCta>
      <button class="button" on:click={onQuiz}><span>{copy[5]}</span><Icon name="arrow_forward" size={20} /></button>
      <small>{copy[6]}</small>
    </div>
    <div class="counter">
      <strong>{animated.toLocaleString('es-MX')}</strong>
      <p>personas usaron esta guía esta semana para entender qué les pasa.</p>
    </div>
  </div>
</section>
{/key}

{#if ctaOffscreen}
  <div class="sticky-cta" role="region" aria-label="Acceso rápido al quiz">
    <button class="button" on:click={onQuiz}><span>{copy[5]}</span><Icon name="arrow_forward" size={20} /></button>
  </div>
{/if}
