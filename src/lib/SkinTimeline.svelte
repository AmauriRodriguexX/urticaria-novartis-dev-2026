<script>
  // Corte de la piel con línea de tiempo: qué pasa en un habón (roncha) y en el angioedema.
  // Límites de las fuentes: cada roncha dura de 1 a 24 h y no deja cicatriz; el angioedema afecta la
  // dermis profunda y el tejido bajo la piel y se resuelve más lento, hasta 72 h (Sachdeva et al. 2011;
  // Hsieh y Lee 2017). El momento del máximo (≈1 h la roncha, ≈7 h el angioedema) es aproximado.
  // `refs` trae el número de cada fuente en la lista de la página: { sachdeva, hsieh }.
  import { onMount } from 'svelte'
  import Cita from './Cita.svelte'
  import Icon from './Icon.svelte'

  export let refs = { sachdeva: 1, hsieh: 2 }

  const RIGHT = 800, SURF = 92, EPI_T = 30, DERM_B = 262, HYPO_B = 420, XC = 470, HOURS = 72
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
  const ss = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t) }
  const bump = (x, c, s) => Math.exp(-(((x - c) / s) ** 2))
  const whealOf = t => ss(0, 1.2, t) * (1 - 0.25 * ss(1.2, 8, t)) * (1 - ss(9, 22, t))
  const angioOf = t => ss(0, 7, t) * (1 - ss(28, 70, t))
  const releaseOf = (t, peak) => t <= 0 ? 0 : ss(0, peak * 0.2, t) * (1 - ss(peak * 0.6, peak * 3, t))

  // piezas fijas (semilla constante: el dibujo es el mismo en cada visita)
  let seed = 7
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  const MASTS = [[300, 168], [420, 196], [545, 160], [650, 205]]
  const GR = MASTS.map(() => Array.from({ length: 14 }, () => ({ a: rnd() * Math.PI * 2, r: 3 + rnd() * 9, d: 20 + rnd() * 34, s: 1.5 + rnd() * 1.4, k: rnd() })))
  const LOBES = []
  for (let row = 0; row < 3; row++) for (let i = 0; i < 12; i++) LOBES.push({ x: i * 72 + (row % 2) * 36 - 10, y: 296 + row * 44, rx: 30 + rnd() * 8, ry: 18 + rnd() * 5 })
  const FIBERS = Array.from({ length: 14 }, (_, i) => ({ y: 140 + (i % 7) * 17 + rnd() * 6, x0: rnd() * 120 - 60 + (i < 7 ? 0 : 380), len: 260 + rnd() * 160, amp: 3 + rnd() * 3, ph: rnd() * 6 }))
  const MARKS = [0, 24, 48, 72]

  let mode = 'roncha'
  let hour = 0          // hora que se dibuja (sigue a `target` con suavidad)
  let target = 0
  let playing = false
  // Reproducción: avanza un parámetro u de 0 a 1 en DUR segundos y la hora es span·u^CURVE,
  // así las primeras horas (cuando la roncha se forma) pasan despacio y no parecen un salto.
  const CURVE = 1.8
  const DUR = { roncha: 13, angio: 15 }
  const SPAN = { roncha: 30, angio: 72 }
  let u = 0
  let slider
  let el = {}

  // hora con precisión de 15 minutos
  const fmt = h => {
    const q = Math.round(h * 4) / 4, hh = Math.floor(q), mm = Math.round((q - hh) * 60)
    if (hh === 0) return mm ? `${mm} min` : '0 h'
    return mm ? `${hh} h ${mm} min` : `${hh} h`
  }

  const line = (f, x0 = -10, x1 = RIGHT + 10, step = 8) => { let d = ''; for (let x = x0; x <= x1; x += step) d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + f(x).toFixed(1); return d }
  const back = (f, x0 = -10, x1 = RIGHT + 10, step = 8) => { let d = ''; for (let x = x1; x >= x0; x -= step) d += 'L' + x.toFixed(1) + ' ' + f(x).toFixed(1); return d }

  // texto de estado: partes con su cita
  const S = refs
  function stateOf(m, h, w, a) {
    if (m === 'roncha') {
      if (h < 0.25) return [['Piel en reposo. Los mastocitos de la piel guardan histamina en sus gránulos.', S.sachdeva]]
      if (h < 1.5) return [['Los mastocitos liberan histamina.', S.sachdeva], [' Los vasos se dilatan y dejan salir líquido: la piel se eleva y se enrojece. Da comezón y a veces ardor.', S.sachdeva]]
      if (w > 0.05) return [['La roncha baja poco a poco. Cada roncha suele durar de 1 a 24 horas.', S.sachdeva]]
      return [['La roncha desapareció sin dejar cicatriz.', S.hsieh], [' En la urticaria crónica espontánea aparecen otras durante 6 semanas o más.', S.hsieh]]
    }
    if (h < 0.25) return [['Piel en reposo.', null]]
    if (h < 10) return [['Hinchazón profunda: el líquido se acumula en la dermis profunda y en el tejido bajo la piel. A veces duele.', S.sachdeva]]
    if (a > 0.05) return [['La hinchazón baja más despacio que una roncha: puede durar hasta 72 horas.', S.sachdeva], [' Se presenta en 30 % a 50 % de las personas con urticaria crónica espontánea, a veces junto con ronchas.', S.hsieh]]
    return [['La hinchazón se resolvió.', null]]
  }
  let parts = stateOf('roncha', 0, 0, 0)
  let partsKey = ''
  let fading = false

  function draw(mix, clock) {
    const w = whealOf(hour) * mix, a = angioOf(hour) * (1 - mix)
    const surf = x => SURF - 34 * w * bump(x, XC, 70) - 30 * a * bump(x, XC, 190)
    const epiB = x => SURF + EPI_T - 28 * w * bump(x, XC, 78) - 30 * a * bump(x, XC, 190)
    const dermB = x => DERM_B - 2 * w * bump(x, XC, 90) - 22 * a * bump(x, XC, 200)
    el.epi.setAttribute('d', line(surf) + back(epiB) + 'Z')
    el.dermis.setAttribute('d', line(epiB) + back(dermB) + 'Z')
    el.hypo.setAttribute('d', line(dermB) + `L${RIGHT + 10} ${HYPO_B + 10}L-10 ${HYPO_B + 10}Z`)
    el.surface.setAttribute('d', line(surf))
    let cells = ''
    for (let row = 0; row < 3; row++) for (let x = (row % 2) * 14 - 14; x < RIGHT; x += 28) {
      const t = surf(x + 14), b = epiB(x + 14), h = (b - t) / 3, y = t + h * row + 1.5
      cells += `<rect x="${x + 1.5}" y="${y.toFixed(1)}" width="25" height="${Math.max(1, h - 3).toFixed(1)}" rx="${Math.min(5, h / 2).toFixed(1)}"/>`
    }
    el.cells.innerHTML = cells
    el.redness.setAttribute('d', line(surf, XC - 190, XC + 190, 6) + back(epiB, XC - 190, XC + 190, 6) + 'Z')
    el.redness.setAttribute('opacity', (w * 0.9 + a * 0.3).toFixed(2))
    el.fluid.setAttribute('cy', (epiB(XC) + 34).toFixed(1)); el.fluid.setAttribute('opacity', (w * 0.95).toFixed(2))
    el.fluidDeep.setAttribute('cy', (dermB(XC) + 30).toFixed(1)); el.fluidDeep.setAttribute('opacity', (a * 0.95).toFixed(2))
    el.fibers.innerHTML = FIBERS.map(f => { let d = ''; for (let x = f.x0; x <= f.x0 + f.len; x += 10) { const u = (f.y - 122) / 140; const base = f.y + (epiB(x) - (SURF + EPI_T)) * (1 - u) + (dermB(x) - DERM_B) * u; d += (d ? 'L' : 'M') + x.toFixed(1) + ' ' + (base + Math.sin(x / 22 + f.ph) * f.amp).toFixed(1) } return `<path d="${d}"/>` }).join('')
    el.vessels.innerHTML = [150, 250, 360, 580, 700].map(x => { const y = epiB(x); const dil = 1 + 0.6 * (w * bump(x, XC, 160) + a * bump(x, XC, 260)); return `<path d="M${x - 9} ${(y + 46).toFixed(1)}Q${x - 9} ${(y + 8).toFixed(1)} ${x} ${(y + 8).toFixed(1)}Q${x + 9} ${(y + 8).toFixed(1)} ${x + 9} ${(y + 46).toFixed(1)}" fill="none" stroke="#e0725f" stroke-width="${(3.2 * dil).toFixed(1)}" stroke-linecap="round" opacity=".8"/>` }).join('')
    const fx = 210
    el.follicle.setAttribute('d', `M${fx - 9} ${surf(fx).toFixed(1)}L${fx - 11} ${(dermB(fx) - 30).toFixed(1)}Q${fx} ${(dermB(fx) - 8).toFixed(1)} ${fx + 11} ${(dermB(fx) - 30).toFixed(1)}L${fx + 9} ${surf(fx).toFixed(1)}Z`)
    el.hair.setAttribute('d', `M${fx} ${(dermB(fx) - 28).toFixed(1)}L${fx} ${surf(fx).toFixed(1)}Q${fx + 6} ${(surf(fx) - 30).toFixed(1)} ${fx + 22} ${(surf(fx) - 52).toFixed(1)}`)
    // el líquido se acumula entre los lóbulos de grasa y los separa; los lóbulos no crecen
    el.lobules.innerHTML = LOBES.map(l => {
      const lift = dermB(l.x) - DERM_B, near = a * bump(l.x, XC, 230)
      const spread = 26 * near * Math.sign(l.x - XC) * Math.min(1, Math.abs(l.x - XC) / 80)
      const cy = l.y + lift * (1 - (l.y - 280) / 160) - 10 * near * (l.y > 320 ? -1 : 1)
      return `<ellipse cx="${(l.x + spread).toFixed(1)}" cy="${cy.toFixed(1)}" rx="${l.rx.toFixed(1)}" ry="${l.ry.toFixed(1)}" fill="#fbecc8" stroke="#ecc98a" stroke-width="1.2"/>`
    }).join('')
    // los mastocitos liberan gránulos con histamina, que se dispersan a su alrededor
    const rel = releaseOf(hour, 1.5) * mix + releaseOf(hour, 7) * 0.8 * (1 - mix)
    let m = '', g = ''
    MASTS.forEach(([x, y0], i) => {
      const y = y0 + (epiB(x) - (SURF + EPI_T)) * 0.55 + (dermB(x) - DERM_B) * 0.45
      const on = rel > 0.15
      m += `<ellipse cx="${x}" cy="${y.toFixed(1)}" rx="17" ry="14" fill="#f9e3dc" stroke="${on ? '#ee7067' : '#d9a08f'}" stroke-width="${on ? 2 : 1.4}"/><circle cx="${x + 4}" cy="${(y - 1).toFixed(1)}" r="4.6" fill="#c9786a" opacity=".8"/>`
      GR[i].forEach(p => {
        const cycle = (clock * 0.28 + p.k) % 1, out = rel * cycle, r = p.r + p.d * out
        const op = rel > 0.02 ? 0.9 - 0.85 * cycle * Math.min(1, rel * 1.4) : 0.9
        g += `<circle cx="${(x + Math.cos(p.a) * r).toFixed(1)}" cy="${(y + Math.sin(p.a) * r * 0.85).toFixed(1)}" r="${p.s}" fill="#b34c45" opacity="${op.toFixed(2)}"/>`
      })
    })
    el.masts.innerHTML = m
    el.grains.innerHTML = g
    const next = stateOf(mode, hour, w, a)
    const key = next.map(p => p[0]).join('|')
    if (key !== partsKey) {
      partsKey = key
      fading = true
      setTimeout(() => { parts = next; fading = false }, 160)
    }
  }

  onMount(() => {
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    let mix = 1, last = 0, clock = 0, frame = 0, visible = false
    playing = !still
    if (still) { target = hour = 1 }
    let hold = 0, rewinding = false
    function tick(now) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now
      if (playing && !rewinding) {
        if (u < 1) { u = Math.min(1, u + dt / DUR[mode]); target = SPAN[mode] * u ** CURVE }
        else if ((hold += dt) > 1.6) { hold = 0; rewinding = true; target = 0 }   // pausa al final y rebobina
      }
      if (rewinding && hour < 0.05) { rewinding = false; u = 0; hour = 0 }
      const goal = clamp(target, 0, HOURS)
      // al arrastrar sigue de cerca; al rebobinar va más despacio para que se vea continuo
      const tau = rewinding ? 0.45 : playing ? 0.08 : 0.16
      hour = still ? goal : hour + (goal - hour) * (1 - Math.exp(-dt / tau))
      const want = mode === 'roncha' ? 1 : 0
      mix = still ? want : mix + (want - mix) * (1 - Math.exp(-dt / 0.35))
      clock += dt
      if (document.activeElement !== slider) slider.value = String(hour)
      draw(mix, clock)
      frame = visible ? requestAnimationFrame(tick) : 0
    }
    const io = new IntersectionObserver(entries => {
      visible = entries[entries.length - 1].isIntersecting
      if (visible && !frame) { last = 0; frame = requestAnimationFrame(tick) }
    }, { rootMargin: '120px 0px' })
    io.observe(el.root)
    draw(1, 0)
    return () => { io.disconnect(); cancelAnimationFrame(frame) }
  })

  const uOf = h => clamp((h / SPAN[mode]) ** (1 / CURVE), 0, 1)
  function onInput(event) { target = +event.currentTarget.value; playing = false }
  // flechas: 15 min; con Mayús, 3 h; Inicio y Fin
  function onKey(event) {
    const step = event.shiftKey ? 3 : 0.25
    const map = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step }
    let next = null
    if (event.key in map) next = Math.round((target + map[event.key]) * 4) / 4
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = HOURS
    if (next === null) return
    event.preventDefault()
    target = clamp(next, 0, HOURS); playing = false
  }
  function togglePlay() {
    if (!playing) { u = target >= SPAN[mode] - 0.5 ? 0 : uOf(target); if (!u) target = 0 }
    playing = !playing
  }
  function setMode(next) { mode = next; target = 0; u = 0 }
</script>

<div class="skin-figure" bind:this={el.root}>
  <div class="skin-top">
    <p class="skin-title">Qué pasa en la piel</p>
    <div class="skin-seg" role="group" aria-label="Qué mostrar">
      <button type="button" aria-pressed={mode === 'roncha'} on:click={() => setMode('roncha')}>Habón (roncha)</button>
      <button type="button" aria-pressed={mode === 'angio'} on:click={() => setMode('angio')}>Hinchazón (angioedema)</button>
    </div>
  </div>

  <svg viewBox="0 0 800 420" role="img" aria-label="Corte de la piel en tres capas: epidermis arriba, dermis con mastocitos en medio e hipodermis con grasa abajo. Muestra cómo cambia la piel con el paso de las horas.">
    <defs>
      <clipPath id="skin-clip"><rect width="800" height="420" rx="14" /></clipPath>
      <radialGradient id="skin-fluid" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffffff" stop-opacity=".85" /><stop offset=".7" stop-color="#fff4ef" stop-opacity=".5" /><stop offset="1" stop-color="#fff4ef" stop-opacity="0" /></radialGradient>
      <radialGradient id="skin-red" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ee7067" stop-opacity=".55" /><stop offset="1" stop-color="#ee7067" stop-opacity="0" /></radialGradient>
      <linearGradient id="skin-air" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfaf5" /><stop offset="1" stop-color="#f3efe4" /></linearGradient>
    </defs>
    <g clip-path="url(#skin-clip)">
      <rect width="800" height="420" fill="url(#skin-air)" />
      <path bind:this={el.hypo} fill="#f7e2b4" />
      <g bind:this={el.lobules}></g>
      <ellipse bind:this={el.fluidDeep} cx={XC} rx="300" ry="95" fill="url(#skin-fluid)" opacity="0" />
      <path bind:this={el.dermis} fill="#f4c6b2" />
      <g bind:this={el.fibers} fill="none" stroke="#e3a690" stroke-width="1.4" stroke-linecap="round" opacity=".75"></g>
      <g bind:this={el.vessels}></g>
      <path bind:this={el.follicle} fill="#ebb39d" stroke="#d68f78" stroke-width="1.2" />
      <ellipse bind:this={el.fluid} cx={XC} rx="150" ry="52" fill="url(#skin-fluid)" opacity="0" />
      <g bind:this={el.masts}></g>
      <g bind:this={el.grains}></g>
      <path bind:this={el.epi} fill="#f8dccb" />
      <g bind:this={el.cells} fill="none" stroke="#e8b9a2" stroke-width="1"></g>
      <path bind:this={el.redness} fill="url(#skin-red)" opacity="0" />
      <path bind:this={el.surface} fill="none" stroke="#c98a73" stroke-width="2" />
      <path bind:this={el.hair} fill="none" stroke="#8a5b4b" stroke-width="2" stroke-linecap="round" />
    </g>
  </svg>

  <ul class="skin-legend" aria-label="Capas de la piel">
    <li><i style="background:#f8dccb"></i>Epidermis</li>
    <li><i style="background:#f4c6b2"></i>Dermis, con mastocitos</li>
    <li><i style="background:#f7e2b4"></i>Hipodermis (grasa)</li>
    <li><i class="dot"></i>Gránulos de histamina</li>
  </ul>

  <div class="skin-controls">
    <button class="skin-play" type="button" aria-label={playing ? 'Pausar' : 'Reproducir'} on:click={togglePlay}><Icon name={playing ? 'pause' : 'play_arrow'} size={22} /></button>
    <div class="skin-slider">
      <label for="skin-hour"><span>Horas desde que aparece</span></label>
      <div class="skin-track" style={`--p:${(hour / HOURS).toFixed(4)};--limit:${mode === 'roncha' ? 24 / HOURS : 1}`}>
        <span class="skin-band"></span>
        <span class="skin-fill"></span>
        <input id="skin-hour" bind:this={slider} type="range" min="0" max={HOURS} step="any" value="0" aria-valuetext={fmt(hour)} aria-describedby="skin-state" on:input={onInput} on:keydown={onKey} />
        <span class="skin-marks" aria-hidden="true">
          {#each MARKS as h}<span class="skin-mark" class:on={hour >= h - 0.01 && (h > 0 || hour > 0.2)} style={`--at:${h / HOURS}`}><b>{h} h</b></span>{/each}
        </span>
      </div>
      <p class="skin-band-note"><i></i>{mode === 'roncha' ? 'Duración de una roncha: de 1 a 24 horas' : 'Duración del angioedema: hasta 72 horas'}<Cita refs={refs.sachdeva} prefix="ref" /></p>
    </div>
  </div>

  <p class="skin-state" class:fade={fading} id="skin-state" aria-live="polite">{#each parts as [text, ref]}{text}{#if ref}<Cita refs={ref} prefix="ref" />{/if}{/each}</p>
  <p class="skin-note">Esquema ilustrativo: el tamaño no es a escala y la forma de la curva en el tiempo es aproximada; los límites de duración salen de las fuentes.</p>
</div>

<style>
  .skin-figure { --thumb: 22px; display: grid; gap: var(--s-3); margin-top: var(--s-5); padding: clamp(16px, 3vw, 24px); border: 1px solid var(--line); border-radius: 22px; background: var(--card); }
  .skin-top { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; }
  .skin-title { margin: 0; font: 700 20px/1.2 var(--font-barlow); color: var(--ink); }
  .skin-seg { display: inline-flex; gap: 4px; padding: 4px; border: 1px solid var(--line); border-radius: 999px; background: color-mix(in srgb, var(--card) 70%, var(--line)); }
  .skin-seg button { padding: 9px 16px; border: 0; border-radius: 999px; background: transparent; color: var(--soft); font: 600 14px var(--font-barlow); cursor: pointer; transition: background .3s, color .3s; }
  .skin-seg button[aria-pressed="true"] { background: var(--ink); color: var(--bg-solid); }
  .skin-seg button:focus-visible, .skin-play:focus-visible, .skin-slider input:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
  svg { display: block; width: 100%; height: auto; border-radius: 14px; }
  .skin-legend { display: flex; flex-wrap: wrap; gap: 6px 18px; margin: 0; padding: 0; list-style: none; font: 600 13px var(--font-barlow); color: var(--soft); }
  .skin-legend i { display: inline-block; width: 12px; height: 12px; margin-right: 6px; border: 1px solid rgba(0, 0, 0, .08); border-radius: 3px; vertical-align: -1px; }
  .skin-legend i.dot { border-radius: 50%; background: #b34c45; }

  .skin-controls { display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: start; }
  .skin-play { display: inline-grid; place-items: center; width: 44px; height: 44px; margin-top: 18px; border: 0; border-radius: 50%; background: var(--accent); color: #fff; cursor: pointer; box-shadow: 0 6px 16px -6px var(--accent); }
  .skin-slider label { display: flex; justify-content: space-between; gap: 12px; font: 600 13px var(--font-barlow); color: var(--soft); }
  .skin-slider label b { color: var(--ink); font-size: 15px; font-variant-numeric: tabular-nums; }
  .skin-track { position: relative; height: 44px; margin-top: 4px; }
  .skin-band, .skin-fill { position: absolute; left: calc(var(--thumb) / 2); border-radius: 999px; }
  .skin-band { top: 9px; height: 8px; width: calc((100% - var(--thumb)) * var(--limit)); background: var(--accentSoft); transition: width .6s cubic-bezier(.2, .7, .2, 1); }
  .skin-fill { top: 11px; height: 4px; width: calc((100% - var(--thumb)) * var(--p)); background: var(--accent); }
  .skin-slider input { -webkit-appearance: none; appearance: none; position: absolute; inset: 0 0 auto; width: 100%; height: 26px; margin: 0; background: transparent; cursor: pointer; }
  .skin-slider input::-webkit-slider-runnable-track { height: 4px; border-radius: 999px; background: color-mix(in srgb, var(--ink) 12%, transparent); }
  .skin-slider input::-moz-range-track { height: 4px; border-radius: 999px; background: color-mix(in srgb, var(--ink) 12%, transparent); }
  .skin-slider input::-webkit-slider-thumb { -webkit-appearance: none; width: var(--thumb); height: var(--thumb); margin-top: -9px; border: 3px solid #fff; border-radius: 50%; background: var(--accent); box-shadow: 0 2px 8px rgba(34, 56, 63, .3); }
  .skin-slider input::-moz-range-thumb { width: 16px; height: 16px; border: 3px solid #fff; border-radius: 50%; background: var(--accent); box-shadow: 0 2px 8px rgba(34, 56, 63, .3); }
  .skin-marks { position: absolute; inset: 0; pointer-events: none; }
  .skin-mark { position: absolute; top: 7px; left: calc(var(--thumb) / 2 + (100% - var(--thumb)) * var(--at)); width: 12px; height: 12px; margin-left: -6px; border: 2px solid var(--line); border-radius: 50%; background: var(--card); transition: background .3s, border-color .3s, transform .3s; }
  .skin-mark.on { border-color: var(--accent); background: var(--accent); transform: scale(1.15); }
  .skin-mark b { position: absolute; top: 18px; left: 50%; transform: translateX(-50%); white-space: nowrap; font: 600 11px var(--font-barlow); color: var(--faint); }
  .skin-mark.on b { color: var(--ink); }
  .skin-band-note { margin: 2px 0 0; font: 600 12px var(--font-barlow); color: var(--soft); }
  .skin-band-note i { display: inline-block; width: 18px; height: 8px; margin-right: 6px; border-radius: 999px; background: var(--accentSoft); vertical-align: 0; }
  .skin-state { margin: 0; padding: 12px 16px; border-left: 3px solid var(--accent); border-radius: 4px 12px 12px 4px; background: var(--accentSoft); color: var(--ink); font-size: 14px; line-height: 1.55; min-height: 4.8em; transition: opacity .2s; }
  .skin-state.fade { opacity: 0; }
  .skin-note { margin: 0; color: var(--faint); font-size: 12px; }
  @media (prefers-reduced-motion: reduce) { .skin-state, .skin-band, .skin-mark { transition: none; } }
</style>
