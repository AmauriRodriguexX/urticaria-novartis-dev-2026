<script>
  import { onMount } from 'svelte'
  export let copy
  export let target = 1240
  export let onQuiz
  export let word = copy[2]
  export let ctx = 'dia'
  let animatedTarget = 0

  onMount(() => {
    const started = performance.now()
    const duration = 900
    let frame
    const tick = (now) => {
      const progress = Math.min(1, (now - started) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      animatedTarget = Math.round(target * eased)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  })
</script>

{#key ctx}<section class="hero context-transition campaign-hero">
  <div class="hero-copy animate-rise">
    <p class="kicker"><i></i>{copy[0]}</p>
    <h1>{copy[1]}<em>{word}</em>{copy[3]}</h1>
    <p class="intro">{copy[4]}</p>
    <div class="action-row"><button class="button" on:click={onQuiz}>{copy[5]} <span>→</span></button><small>{copy[6]}</small></div>
    <p class="tagline">Que ocupe el lugar más pequeño de tu vida.</p>
  </div>
  <div class="hero-art animate-rise delay">
    <div class:glass-only={ctx !== 'dia'} class="scene" aria-hidden="true"><div class="life-glow"></div><div class="ground"></div>{#if ctx === 'dia'}<div class="person"><div class="person-shadow"></div><svg viewBox="0 0 120 230"><g fill="var(--person)"><circle cx="60" cy="30" r="21"></circle><path d="M60 51c-19 0-29 14-31 35l-7 64c-1 9 12 11 14 2l8-50 2 0-3 96c-1 11 16 11 17 1l4-64 4 0 4 64c1 10 18 10 17-1l-3-96 2 0 8 50c2 9 15 7 14-2l-7-64c-2-21-12-35-31-35z"></path></g></svg></div>{/if}<div class="glass"><div class="glass-rim"></div><div class="glass-body"></div><div class="glass-worm"><b></b><b></b><b></b></div></div></div>
    <div class="counter"><strong>{animatedTarget.toLocaleString('es-MX')}</strong><p>personas usaron esta guía esta semana para entender qué les pasa.</p></div>
  </div>
</section>{/key}
