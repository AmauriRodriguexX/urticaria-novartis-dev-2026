<script>
  // Comparador de tipos de urticaria. Cada tema tiene su propio gráfico:
  //  · desencadenante → muestra de piel con el patrón de ronchas de cada tipo
  //  · duración       → línea de tiempo de 0 a 12 semanas con la marca de 6 semanas
  //  · evaluación     → quién orienta (siempre un profesional de la salud)
  // "Ver todas las diferencias" abre la tabla completa (versión accesible e imprimible).
  import Icon from './Icon.svelte'
  import Cita from './Cita.svelte'
  export let data

  let active = 0
  let showAll = false
  const tabIds = data.topics.map((_, i) => `cmp-tab-${i}`)
  $: topic = data.topics[active]
  $: kind = ['skin', 'time', 'care'][active] || 'skin'

  function onKey(event) {
    const n = data.topics.length
    if (event.key === 'ArrowRight') active = (active + 1) % n
    else if (event.key === 'ArrowLeft') active = (active - 1 + n) % n
    else return
    event.preventDefault()
    document.getElementById(tabIds[active])?.focus()
  }
  const val = (t, key) => (typeof t.values[key] === 'string' ? { text: t.values[key] } : t.values[key])

  // Patrones de ronchas sobre la muestra de piel (x, y, rx, ry, giro)
  const WHEALS = {
    uce: [[38, 34, 14, 10, -12], [92, 26, 9, 7, 20], [150, 40, 16, 11, 8], [64, 78, 11, 8, 30], [118, 84, 18, 12, -6], [176, 92, 10, 7, 14], [30, 112, 9, 6, 0], [146, 122, 12, 8, -20], [84, 124, 7, 5, 10]],
    aguda: [[96, 62, 18, 12, -8], [126, 80, 12, 9, 18], [80, 92, 10, 7, 4]],
    inducible: [[40, 66, 22, 5, -14], [92, 72, 24, 5, -14], [146, 79, 24, 5, -14]]
  }
  // Línea de tiempo: semanas 0 a 12. La marca clínica está en la semana 6.
  const W = 12
  const pct = w => `${(w / W) * 100}%`
  const TIME = {
    uce: { bars: [[0, 12]], open: true, label: 'Continúa más allá de 6 semanas' },
    aguda: { bars: [[0, 3.5]], label: 'Se resuelve antes de 6 semanas' },
    inducible: { bars: [[1, 1.6], [4, 4.6], [7.5, 8.1], [10.5, 11.1]], label: 'Aparece cada vez que hay un estímulo' }
  }
</script>

<div class="cmp">
  <div class="cmp-top">
    <p class="cmp-lead">{data.lead}</p>
    <aside class="cmp-notice" role="note"><Icon name="info" size={20} /><span>{data.notice}</span></aside>
  </div>

  <div class="cmp-seg" role="tablist" aria-label="Tema para comparar" on:keydown={onKey}>
    {#each data.topics as t, i}
      <button id={tabIds[i]} type="button" role="tab" class:active={i === active} aria-selected={i === active} aria-controls="cmp-panel" tabindex={i === active ? 0 : -1} on:click={() => (active = i)}>
        <Icon name={t.icon} size={20} /><span>{t.label}</span>
      </button>
    {/each}
  </div>

  <div class="cmp-grid" id="cmp-panel" role="tabpanel" aria-labelledby={tabIds[active]}>
    {#each data.types as ty, n}
      {@const v = val(topic, ty.key)}
      <article class="cmp-card" class:hl={ty.highlight}>
        <header>
          <span class="cmp-index">0{n + 1}</span>
          <h3>{ty.name}</h3>
        </header>

        <div class="cmp-vis" aria-hidden="true">
          {#if kind === 'skin'}
            <svg viewBox="0 0 200 150" class="skin">
              <defs>
                <linearGradient id={`sk-${ty.key}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dccb" /><stop offset="1" stop-color="#ebc3a8" /></linearGradient>
                <radialGradient id={`wh-${ty.key}`}><stop offset="0" stop-color="#fbe9e1" /><stop offset=".55" stop-color="#f3b4a6" /><stop offset="1" stop-color="#e3786b" stop-opacity=".55" /></radialGradient>
              </defs>
              <rect x="0" y="0" width="200" height="150" rx="18" fill={`url(#sk-${ty.key})`} />
              {#each [18, 46, 74, 102, 130] as y}<path d={`M10 ${y} q50 -6 90 0 t90 0`} class="pore" />{/each}
              {#each WHEALS[ty.key] as [x, y, rx, ry, r]}
                <ellipse cx={x} cy={y} rx={rx + 5} ry={ry + 5} transform={`rotate(${r} ${x} ${y})`} class="halo" />
                <ellipse cx={x} cy={y} rx={rx} ry={ry} transform={`rotate(${r} ${x} ${y})`} fill={`url(#wh-${ty.key})`} />
              {/each}
            </svg>
          {:else if kind === 'time'}
            {@const tl = TIME[ty.key]}
            <div class="tl">
              <div class="tl-track">
                {#each tl.bars as [a, b]}<span class="tl-bar" class:open={tl.open} style={`left:${pct(a)};width:${pct(b - a)}`}></span>{/each}
                <span class="tl-mark" style={`left:${pct(6)}`}><em>6 sem.</em></span>
              </div>
              <div class="tl-axis"><span>0</span><span>12 semanas</span></div>
              <p class="tl-cap">{tl.label}</p>
            </div>
          {:else}
            <div class="care"><span class="care-ico"><Icon name="stethoscope" size={34} /></span><span class="care-txt">Lo determina un<br /><strong>profesional de la salud</strong></span></div>
          {/if}
        </div>

        {#if v.stat}<p class="cmp-stat">{v.stat}</p>{/if}
        <p class="cmp-text">{v.text}{#if v.ref}<Cita refs={v.ref} prefix="ref" />{/if}</p>
      </article>
    {/each}
  </div>

  <div class="cmp-key">
    <div class="cmp-key-num" aria-hidden="true"><b>6+</b><span>semanas</span></div>
    <p><strong>Dato clave</strong>{data.key.text}<Cita refs={data.key.ref} prefix="ref" /></p>
    <button type="button" class="cmp-all" aria-expanded={showAll} aria-controls="cmp-tabla" on:click={() => (showAll = !showAll)}>
      {showAll ? 'Ocultar la tabla' : 'Ver todas las diferencias'} <Icon name={showAll ? 'close' : 'arrow_forward'} size={18} />
    </button>
  </div>

  <div class="cmp-table-wrap" id="cmp-tabla" class:open={showAll} role="region" aria-label="Todas las diferencias">
    <table class="content-table">
      <thead><tr><th scope="col">Tema</th>{#each data.types as ty}<th scope="col">{ty.name}</th>{/each}</tr></thead>
      <tbody>
        {#each data.topics as t}<tr><th scope="row">{t.label}</th>{#each data.types as ty}<td>{val(t, ty.key).text}</td>{/each}</tr>{/each}
      </tbody>
    </table>
  </div>

</div>

<style>
  .cmp { --cmp-r: 22px; display: grid; gap: var(--s-5); margin-top: var(--s-4); }
  .cmp-top { display: flex; flex-wrap: wrap; gap: var(--s-4); align-items: center; justify-content: space-between; }
  .cmp-lead { margin: 0; color: var(--soft); max-width: 34em; }
  .cmp-notice { display: flex; gap: 10px; align-items: flex-start; max-width: 24rem; padding: 12px 16px; border-left: 3px solid var(--accent); border-radius: 4px 12px 12px 4px; background: var(--accentSoft); color: var(--ink); font-size: 13px; line-height: 1.45; }
  .cmp-notice :global(.icon) { color: var(--accent); margin-top: 1px; }

  /* control segmentado */
  .cmp-seg { display: inline-grid; grid-auto-flow: column; justify-self: start; gap: 4px; padding: 5px; border: 1px solid var(--line); border-radius: 999px; background: color-mix(in srgb, var(--card) 70%, var(--line)); }
  .cmp-seg button { display: inline-flex; align-items: center; gap: 8px; padding: 11px 20px; border: 0; border-radius: 999px; background: transparent; color: var(--soft); font: 600 15px var(--font-barlow); cursor: pointer; transition: background .25s, color .25s, box-shadow .25s; }
  .cmp-seg button :global(.icon) { color: var(--accent); transition: color .25s; }
  .cmp-seg button:hover { color: var(--ink); }
  .cmp-seg button.active { background: var(--ink); color: var(--bg-solid); box-shadow: 0 6px 18px rgba(0, 0, 0, .14); }
  .cmp-seg button.active :global(.icon) { color: var(--bg-solid); }
  .cmp-seg button:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }

  /* tarjetas */
  .cmp-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--s-4); }
  .cmp-card { position: relative; display: flex; flex-direction: column; gap: var(--s-3); padding: var(--s-4); border: 1px solid var(--line); border-radius: var(--cmp-r); background: var(--card); }
  .cmp-card.hl { border-color: transparent; background: linear-gradient(var(--card), var(--card)) padding-box, linear-gradient(var(--bg-solid), var(--bg-solid)) padding-box, linear-gradient(140deg, var(--accent), color-mix(in srgb, var(--accent) 25%, transparent)) border-box; border: 1.5px solid transparent; box-shadow: 0 18px 40px -22px var(--accent); }
  .cmp-card header { display: grid; grid-template-columns: auto 1fr; align-items: baseline; column-gap: 10px; row-gap: 6px; }
  .cmp-index { font: 700 14px var(--font-barlow-c); letter-spacing: .08em; color: var(--accent); }
  .cmp-card h3 { font-size: 20px; line-height: 1.15; text-wrap: balance; }

  .cmp-vis { display: grid; place-items: center; min-height: 150px; border-radius: 16px; background: color-mix(in srgb, var(--card) 60%, var(--line)); overflow: hidden; }
  .skin { width: 100%; height: auto; display: block; }
  .skin .pore { fill: none; stroke: #e2b498; stroke-width: .8; opacity: .45; }
  .skin .halo { fill: #e3786b; opacity: .16; }

  .tl { width: 100%; padding: 26px 18px 16px; }
  .tl-track { position: relative; height: 14px; border-radius: 999px; background: color-mix(in srgb, var(--line) 80%, var(--card)); }
  .tl-bar { position: absolute; top: 0; bottom: 0; border-radius: 999px; background: var(--accent); }
  .tl-bar.open { border-radius: 999px 0 0 999px; background: linear-gradient(90deg, var(--accent) 80%, color-mix(in srgb, var(--accent) 10%, transparent)); }
  .tl-mark { position: absolute; top: -14px; bottom: -6px; width: 0; border-left: 2px dashed var(--ink); }
  .tl-mark em { position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font: 700 11px var(--font-barlow-c); font-style: normal; letter-spacing: .06em; color: var(--ink); white-space: nowrap; }
  .tl-axis { display: flex; justify-content: space-between; margin-top: 8px; font: 600 11px var(--font-barlow-c); letter-spacing: .06em; color: var(--faint); }
  .tl-cap { margin: 12px 0 0; text-align: center; font: 600 13px var(--font-barlow); color: var(--soft); }

  .care { display: flex; align-items: center; gap: 14px; padding: 20px; }
  .care-ico { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 50%; background: var(--card); color: var(--accent); box-shadow: 0 6px 16px rgba(0, 0, 0, .06); }
  .care-txt { color: var(--soft); font-size: 13px; line-height: 1.35; }
  .care-txt strong { color: var(--ink); font: 700 16px var(--font-barlow); }

  .cmp-stat { margin: 0; font: 700 30px/1 var(--font-barlow-c); color: var(--accent); letter-spacing: -.01em; }
  .cmp-text { margin: 0; color: var(--ink); font-size: 15px; line-height: 1.5; }

  /* dato clave */
  .cmp-key { display: grid; grid-template-columns: auto 1fr auto; gap: var(--s-5); align-items: center; padding: var(--s-4) var(--s-5); border-radius: var(--cmp-r); background: var(--ink); color: var(--bg-solid); }
  .cmp-key-num { display: grid; justify-items: center; line-height: 1; }
  .cmp-key-num b { font: 700 54px/0.9 var(--font-barlow-c); color: var(--accent); }
  .cmp-key-num span { font: 600 12px var(--font-barlow-c); letter-spacing: .14em; text-transform: uppercase; opacity: .75; }
  .cmp-key p { margin: 0; font-size: 16px; line-height: 1.5; color: color-mix(in srgb, var(--bg-solid) 92%, transparent); }
  .cmp-key strong { display: block; margin-bottom: 4px; font: 700 12px var(--font-barlow-c); letter-spacing: .16em; text-transform: uppercase; color: var(--accent); }
  .cmp-all { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border: 1px solid color-mix(in srgb, var(--bg-solid) 35%, transparent); border-radius: 999px; background: transparent; color: var(--bg-solid); font: 700 15px var(--font-barlow); cursor: pointer; transition: background .2s; }
  .cmp-all:hover { background: color-mix(in srgb, var(--bg-solid) 10%, transparent); }
  .cmp-all:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }

  .cmp-table-wrap { display: none; overflow-x: auto; }
  .cmp-table-wrap.open { display: block; }


  @media (max-width: 900px) {
    .cmp-grid { grid-template-columns: 1fr; }
    .cmp-seg { grid-auto-flow: row; justify-self: stretch; border-radius: 22px; }
    .cmp-seg button { justify-content: flex-start; }
    .cmp-key { grid-template-columns: auto 1fr; }
    .cmp-all { grid-column: 1 / -1; justify-self: start; }
  }
  @media print { .cmp-table-wrap { display: block; } .cmp-all { display: none; } }
  @media (prefers-reduced-motion: reduce) { .cmp-seg button, .cmp-seg button :global(.icon) { transition: none; } }
</style>
