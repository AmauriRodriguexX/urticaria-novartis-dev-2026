<script>
  import Icon from './Icon.svelte'
  // Escala de 4 niveles (0 a 3) para las preguntas de habones y comezón (UAS7): la persona
  // coloca ella misma la flecha en el nivel y en el color que le corresponde.
  // Se puede tocar, arrastrar o usar el teclado (flechas, Inicio y Fin).
  export let options = []        // [[valor, etiqueta, descripción], ...] de 0 a 3
  export let value = undefined   // valor elegido ('0' a '3') o undefined
  export let nombre = ''
  export let onchange = () => {}

  const COLORS = ['#1f8f4e', '#f2d12e', '#f39a2b', '#e0453a']
  let track
  let dragging = false
  let hover = null   // nivel sobre el que está el puntero (vista previa antes de elegir)

  $: index = options.findIndex(o => o[0] === value)
  $: chosen = index >= 0 ? options[index] : null
  // etiqueta corta: lo que va antes del paréntesis (p. ej. "Leve (Menos de 20 ronchas)" -> "Leve")
  const short = label => label.split(' (')[0]

  function pick(i) {
    const next = Math.max(0, Math.min(options.length - 1, i))
    if (next !== index) onchange(options[next][0])
  }
  function fromPointer(event) {
    const box = track.getBoundingClientRect()
    pick(Math.floor(((event.clientX - box.left) / box.width) * options.length))
  }
  function down(event) { dragging = true; track.setPointerCapture?.(event.pointerId); fromPointer(event) }
  function move(event) {
    if (dragging) fromPointer(event)
    else { const box = track.getBoundingClientRect(); hover = Math.max(0, Math.min(options.length - 1, Math.floor(((event.clientX - box.left) / box.width) * options.length))) }
  }
  function up() { dragging = false }
  function leave() { if (!dragging) hover = null }
  function key(event) {
    const map = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }
    let next = null
    if (event.key in map) next = (index < 0 ? (map[event.key] > 0 ? 0 : 0) : index + map[event.key])
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = options.length - 1
    if (next === null) return
    event.preventDefault()
    pick(next)
  }
</script>

<div class="scale">
  <div
    class="scale-track"
    bind:this={track}
    role="slider"
    tabindex="0"
    aria-label={nombre}
    aria-valuemin="0"
    aria-valuemax={options.length - 1}
    aria-valuenow={index < 0 ? undefined : index}
    aria-valuetext={chosen ? `${chosen[1]}. ${chosen[2] || ''}` : 'Sin elegir'}
    on:pointerdown={down}
    on:pointermove={move}
    on:pointerup={up}
    on:pointercancel={up}
    on:pointerleave={leave}
    on:keydown={key}
  >
    {#each options as o, i}<span class="scale-seg" class:on={i === index} class:peek={i === hover && i !== index} class:idle={!chosen} style={`background:${COLORS[i]}`}></span>{/each}
    {#if !chosen}
      <span class="scale-ghost" aria-hidden="true"><b><Icon name="back_hand" size={18} /></b><i></i></span>
    {/if}
    {#if chosen}
      <span class="scale-arrow" style={`left:${((index + 0.5) / options.length) * 100}%`}><b>{index}</b><i></i></span>
    {/if}
  </div>

  <ul class="scale-labels" aria-hidden="true">
    {#each options as o, i}<li class:on={i === index} on:pointerenter={() => (hover = i)} on:pointerleave={leave} on:click={() => pick(i)}><i style={`background:${COLORS[i]}`}></i>{short(o[1])}</li>{/each}
  </ul>

  <p class="scale-desc" class:empty={!chosen} style={chosen ? `border-color:${COLORS[index]}` : ''} aria-live="polite">
    {#if chosen}<strong>{chosen[1]}</strong>{#if chosen[2]}<span>{chosen[2]}</span>{/if}{:else}<Icon name="back_hand" size={18} /><span>Toca el color que mejor te describe, o arrastra la flecha.</span>{/if}
  </p>
</div>

<style>
  .scale { display: grid; gap: var(--s-3); margin-top: var(--s-4); }
  .scale-track { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; height: 22px; margin-top: 34px; border-radius: 999px; touch-action: none; cursor: pointer; }
  .scale-track:focus-visible { outline: 3px solid var(--accent); outline-offset: 8px; }
  .scale-seg { border-radius: 4px; opacity: .4; transition: opacity .25s, transform .25s; }
  .scale-seg.idle { opacity: .85; }
  .scale-seg.peek { opacity: 1; transform: scaleY(1.35); }
  .scale-seg:first-child { border-radius: 999px 4px 4px 999px; }
  .scale-seg:last-child { border-radius: 4px 999px 999px 4px; }
  .scale-seg.on { opacity: 1; }
  .scale-arrow { position: absolute; bottom: 100%; display: grid; justify-items: center; gap: 2px; margin-bottom: 4px; transform: translateX(-50%); transition: left .35s cubic-bezier(.2, .7, .2, 1); pointer-events: none; }
  .scale-arrow b { min-width: 26px; padding: 3px 9px; border-radius: 999px; background: var(--ink); color: var(--bg-solid); font: 700 15px var(--font-barlow-c); text-align: center; }
  .scale-arrow i { width: 0; height: 0; border: 7px solid transparent; border-top-color: var(--ink); border-bottom: 0; }
  .scale-labels { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin: 0; padding: 0; list-style: none; }
  .scale-labels li { cursor: pointer; padding: 6px 0; border-radius: 8px; display: grid; justify-items: center; gap: 4px; text-align: center; color: var(--soft); font: 600 13px/1.2 var(--font-barlow); }
  .scale-labels li.on { color: var(--ink); font-weight: 700; }
  .scale-labels i { width: 10px; height: 10px; border-radius: 50%; }
  .scale-desc { display: grid; gap: 2px; margin: 0; padding: 12px 16px; border-left: 4px solid var(--line); border-radius: 4px 12px 12px 4px; background: var(--card); color: var(--soft); font-size: 14px; line-height: 1.45; transition: border-color .3s; }
  .scale-desc strong { color: var(--ink); font: 700 16px var(--font-barlow); }
  .scale-desc.empty { display: flex; align-items: center; gap: 10px; border-left-color: var(--accent); background: var(--accentSoft); color: var(--ink); font-weight: 600; }
  .scale-desc.empty :global(.icon) { flex: none; color: var(--accent); }
  /* flecha fantasma que invita a tocar la escala mientras no hay respuesta */
  .scale-ghost { position: absolute; bottom: 100%; left: 12.5%; display: grid; justify-items: center; gap: 2px; margin-bottom: 4px; transform: translateX(-50%); pointer-events: none; animation: nudge 2.6s ease-in-out infinite; }
  .scale-ghost b { display: grid; place-items: center; width: 34px; height: 30px; border-radius: 999px; background: var(--accent); color: #fff; box-shadow: 0 6px 14px -6px var(--accent); }
  .scale-ghost i { width: 0; height: 0; border: 7px solid transparent; border-top-color: var(--accent); border-bottom: 0; }
  @keyframes nudge { 0%, 100% { left: 12.5%; transform: translateX(-50%) translateY(0); } 40% { left: 87.5%; transform: translateX(-50%) translateY(-4px); } 70% { left: 62.5%; transform: translateX(-50%) translateY(0); } }
  @media (prefers-reduced-motion: reduce) { .scale-arrow, .scale-seg, .scale-desc { transition: none; } .scale-ghost { animation: none; left: 50%; } }
</style>
