<script>
  // Medidor de actividad semanal de la urticaria (escala UAS7, de 0 a 42): suma de 7 días con
  // habones (0 a 3) y comezón (0 a 3) por día. Bandas según J. A. Bernstein et al., J. Clin. Med., 2023:
  // 0 respuesta completa, 1-6 bien controlada, 7-15 leve, 16-27 moderada, 28-42 severa.
  import Cita from './Cita.svelte'
  export let total = 0            // 0 a 42
  export let titulo = 'Tu puntaje de la semana'
  export let aviso = ''           // texto de cautela bajo el medidor
  export let ref = null           // número de la referencia en la lista de la página
  export let fuenteUrl = ''       // enlace a la fuente cuando la página no tiene lista de referencias (p. ej. el quiz)

  const BANDS = [
    { min: 0, max: 0, name: 'Sin actividad', note: 'respuesta completa', color: '#1f8f4e' },
    { min: 1, max: 6, name: 'Bien controlada', note: '1 a 6', color: '#8bc34a' },
    { min: 7, max: 15, name: 'Leve', note: '7 a 15', color: '#f2d12e' },
    { min: 16, max: 27, name: 'Moderada', note: '16 a 27', color: '#f39a2b' },
    { min: 28, max: 42, name: 'Severa', note: '28 a 42', color: '#e0453a' }
  ]
  // el 0 ocupa un tramo corto al inicio y el resto se reparte de 1 a 42
  const CAP = 4
  const pos = v => (v <= 0 ? CAP / 2 : CAP + (Math.min(42, v) / 42) * (100 - CAP))
  const width = b => (b.min === 0 ? CAP : ((b.max - b.min + 1) / 42) * (100 - CAP))
  $: score = Math.max(0, Math.min(42, Math.round(total)))
  $: band = BANDS.find(b => score >= b.min && score <= b.max)
</script>

<div class="uas">
  <p class="uas-head"><span>{titulo}</span><strong>{score} <small>de 42</small></strong></p>

  <div class="uas-bar" role="img" aria-label={`${titulo}: ${score} de 42, actividad ${band.name.toLowerCase()}`}>
    <span class="uas-arrow" style={`left:${pos(score)}%`}><b>{score}</b><i></i></span>
    {#each BANDS as b}<span class="uas-seg" class:on={b === band} style={`width:${width(b)}%;background:${b.color}`}></span>{/each}
  </div>

  <ul class="uas-legend" aria-label="Niveles de actividad">
    {#each BANDS as b}
      <li class:on={b === band}><i style={`background:${b.color}`}></i><strong>{b.name}</strong><small>{b.note}</small></li>
    {/each}
  </ul>

  <p class="uas-result"><strong>Actividad {band.name.toLowerCase()}.</strong> {aviso}{#if ref} <Cita refs={ref} prefix="ref" />{/if}{#if fuenteUrl}{' '}<a class="uas-src" href={fuenteUrl} target="_blank" rel="noopener">Fuente<span class="sr-only"> (se abre en otra pestaña)</span></a>{/if}</p>
</div>

<style>
  .uas { display: grid; gap: var(--s-3); padding: var(--s-4); border: 1px solid var(--line); border-radius: var(--radius-m); background: var(--card); }
  .uas-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; margin: 0; font: 600 15px var(--font-barlow); color: var(--soft); }
  .uas-head strong { color: var(--ink); font: 700 30px/1 var(--font-barlow-c); }
  .uas-head small { font: 600 14px var(--font-barlow); color: var(--faint); }
  .uas-bar { position: relative; display: flex; height: 16px; margin-top: 30px; border-radius: 999px; }
  .uas-seg { display: block; height: 100%; opacity: .45; transition: opacity .4s; }
  .uas-seg:first-of-type { border-radius: 999px 0 0 999px; }
  .uas-seg:last-child { border-radius: 0 999px 999px 0; }
  .uas-seg.on { opacity: 1; }
  .uas-arrow { position: absolute; bottom: 100%; display: grid; justify-items: center; gap: 2px; margin: 0 0 4px; transform: translateX(-50%); transition: left .5s cubic-bezier(.2, .7, .2, 1); }
  .uas-arrow b { padding: 2px 8px; border-radius: 999px; background: var(--ink); color: var(--bg-solid); font: 700 13px var(--font-barlow-c); }
  .uas-arrow i { width: 0; height: 0; border: 6px solid transparent; border-top-color: var(--ink); border-bottom: 0; }
  .uas-legend { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; margin: 0; padding: 0; list-style: none; }
  .uas-legend li { display: grid; gap: 1px; padding: 8px; border-radius: 10px; border: 1px solid transparent; opacity: .7; }
  .uas-legend li.on { opacity: 1; border-color: var(--line); background: color-mix(in srgb, var(--ink) 4%, transparent); }
  .uas-legend i { width: 100%; height: 5px; margin-bottom: 4px; border-radius: 999px; }
  .uas-legend strong { color: var(--ink); font: 700 13px/1.2 var(--font-barlow); }
  .uas-legend small { color: var(--faint); font-size: 11px; line-height: 1.3; }
  .uas-result { margin: 0; color: var(--soft); font-size: 13px; line-height: 1.5; }
  .uas-result strong { color: var(--ink); }
  .uas-src { color: var(--accent); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
  @media (max-width: 640px) { .uas-legend { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (prefers-reduced-motion: reduce) { .uas-arrow, .uas-seg { transition: none; } }
</style>
