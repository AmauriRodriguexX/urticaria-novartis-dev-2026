<script>
  // Dos muestras de piel en volumen (corte en perspectiva): sin ronchas y con habones (ronchas).
  // Microanimación: las ronchas se elevan y bajan despacio y los gránulos de los mastocitos
  // titilan en la dermis. Sin movimiento si el sistema pide reducirlo.
  const TOP = 96, DEPTH = 28, RISE = 26        // borde frontal de la cara superior, fondo en x y en y
  const W = 150, EPI = 12, DERM = 42, HYPO = 30
  const FRONT_B = TOP + EPI + DERM + HYPO

  // geometría de un bloque con origen x0
  const block = x0 => {
    const a = [x0, TOP], b = [x0 + W, TOP], c = [x0 + W + DEPTH, TOP - RISE], d = [x0 + DEPTH, TOP - RISE]
    const pt = p => p.join(' ')
    const band = (y0, y1) => `M${x0} ${y0}H${x0 + W}V${y1}H${x0}Z`
    const side = (y0, y1) => `M${x0 + W} ${y0}L${x0 + W + DEPTH} ${y0 - RISE}V${y1 - RISE}L${x0 + W} ${y1}Z`
    const ys = [TOP, TOP + EPI, TOP + EPI + DERM, FRONT_B]
    return {
      top: `M${pt(a)}L${pt(b)}L${pt(c)}L${pt(d)}Z`,
      front: [band(ys[0], ys[1]), band(ys[1], ys[2]), band(ys[2], ys[3])],
      side: [side(ys[0], ys[1]), side(ys[1], ys[2]), side(ys[2], ys[3])],
      outline: `M${pt(a)}L${pt(d)}L${pt(c)}L${x0 + W + DEPTH} ${FRONT_B - RISE}L${x0 + W} ${FRONT_B}L${x0} ${FRONT_B}Z M${pt(a)}L${pt(b)}L${pt(c)} M${pt(b)}L${x0 + W} ${FRONT_B}`,
      // surcos de la piel: líneas paralelas al borde frontal, de lado a lado de la cara superior
      grooves: [0.2, 0.42, 0.64, 0.86].map(t => `M${x0 + DEPTH * t} ${TOP - RISE * t}L${x0 + W + DEPTH * t} ${TOP - RISE * t}`).join(''),
      // células de la epidermis en la cara frontal
      cells: Array.from({ length: 10 }, (_, i) => `M${x0 + 4 + i * 15} ${TOP + EPI / 2}h10`).join(''),
      lobes: Array.from({ length: 6 }, (_, i) => [x0 + 14 + i * 24.5, TOP + EPI + DERM + HYPO / 2]),
      x0
    }
  }
  const L = block(26), R = block(244)
  // ronchas sobre la cara superior derecha: [t en profundidad 0–1, x a lo largo, ancho, alto, retraso]
  const WHEALS = [[0.32, 36, 21, 13, 0], [0.64, 94, 18, 11, 1.3], [0.34, 128, 13, 8.5, 2.4]]
    .map(([t, x, w, h, delay]) => ({ cx: R.x0 + x + DEPTH * t, cy: TOP - RISE * t, w, h, delay }))
  const dome = ({ cx, cy, w, h }) => `M${cx - w} ${cy}C${cx - w} ${cy - h * 0.9} ${cx - w * 0.45} ${cy - h * 1.25} ${cx} ${cy - h * 1.25}C${cx + w * 0.45} ${cy - h * 1.25} ${cx + w} ${cy - h * 0.9} ${cx + w} ${cy}A${w} ${w * 0.32} 0 0 1 ${cx - w} ${cy}Z`
  // mastocitos con gránulos en la dermis frontal de la muestra con ronchas
  const MASTS = [[R.x0 + 40, TOP + EPI + 18], [R.x0 + 96, TOP + EPI + 26]]
  const GRAINS = MASTS.flatMap(([x, y], m) => [[-8, -4], [7, -6], [9, 3], [-6, 6], [0, -9], [-10, 1]].map(([dx, dy], i) => ({ x: x + dx, y: y + dy, delay: (m * 0.7 + i * 0.45) % 3 })))
</script>

<svg viewBox="0 0 440 230" role="img" aria-labelledby="skin-svg-title skin-svg-desc" class="samples">
  <title id="skin-svg-title">Ilustración de piel sin y con habones (ronchas)</title>
  <desc id="skin-svg-desc">Dos muestras de piel en corte, con epidermis, dermis e hipodermis. La de la izquierda tiene la superficie lisa; la de la derecha tiene habones (ronchas) elevadas y mastocitos que liberan gránulos en la dermis.</desc>
  <defs>
    <linearGradient id="smp-top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6dccb" /><stop offset="1" stop-color="#ebc3a8" /></linearGradient>
    <radialGradient id="smp-wheal" cx="45%" cy="30%" r="75%"><stop offset="0" stop-color="#fdeee8" /><stop offset=".55" stop-color="#f3b4a6" /><stop offset="1" stop-color="#e3786b" /></radialGradient>
    <radialGradient id="smp-halo"><stop offset="0" stop-color="#e3786b" stop-opacity=".6" /><stop offset="1" stop-color="#e3786b" stop-opacity="0" /></radialGradient>
  </defs>

  <text x="110" y="30" text-anchor="middle" class="skin-label">Piel sin habones (ronchas)</text>
  <text x="330" y="30" text-anchor="middle" class="skin-label">Piel con habones (ronchas)</text>

  {#each [L, R] as b, n}
    <ellipse cx={b.x0 + (W + DEPTH) / 2} cy={FRONT_B + 8} rx={(W + DEPTH) / 2} ry="9" class="shadow" />
    <!-- cara lateral, más oscura -->
    <path d={b.side[0]} fill="#efcbb6" /><path d={b.side[1]} fill="#e8b39d" /><path d={b.side[2]} fill="#ecd29e" />
    <!-- cara frontal: las tres capas -->
    <path d={b.front[0]} fill="#f8dccb" /><path d={b.front[1]} fill="#f4c6b2" /><path d={b.front[2]} fill="#f7e2b4" />
    <path d={b.cells} class="cells" />
    {#each b.lobes as [x, y]}<ellipse cx={x} cy={y} rx="10" ry="8" class="lobe" />{/each}
    <path d={`M${b.x0 + 18} ${TOP + EPI + 34}q8 -5 16 0t16 0t16 0t16 0t16 0t16 0`} class="fiber" />
    <!-- cara superior: la superficie de la piel -->
    <path d={b.top} fill="url(#smp-top)" />
    <path d={b.grooves} class="groove" />
    {#if n === 1}
      {#each MASTS as [x, y]}<ellipse cx={x} cy={y} rx="9" ry="7.5" class="mast" />{/each}
      {#each GRAINS as g}<circle cx={g.x} cy={g.y} r="1.6" class="grain" style={`animation-delay:${g.delay}s`} />{/each}
      {#each WHEALS as w}
        <ellipse cx={w.cx} cy={w.cy} rx={w.w + 9} ry={(w.w + 9) * 0.36} fill="url(#smp-halo)" class="halo" style={`animation-delay:${w.delay}s`} />
        <path d={dome(w)} fill="url(#smp-wheal)" class="wheal" style={`animation-delay:${w.delay}s`} />
      {/each}
    {/if}
    <path d={b.outline} class="edge" />
  {/each}
</svg>

<style>
  .samples { display: block; width: 100%; height: auto; overflow: visible; }
  .shadow { fill: rgba(34, 56, 63, .12); filter: blur(4px); }
  .cells, .fiber { fill: none; stroke-linecap: round; }
  .cells { stroke: #e8b9a2; stroke-width: 3; opacity: .55; }
  .fiber { stroke: #e3a690; stroke-width: 1.3; opacity: .7; }
  .lobe { fill: #fbecc8; stroke: #ecc98a; stroke-width: 1; }
  .groove { fill: none; stroke: #d9a790; stroke-width: .9; opacity: .45; }
  .edge { fill: none; stroke: #c98a73; stroke-width: 1.2; stroke-linejoin: round; opacity: .7; }
  .mast { fill: #f9e3dc; stroke: #ee7067; stroke-width: 1.3; }
  .grain { fill: #b34c45; }
  .wheal, .halo { transform-box: fill-box; transform-origin: 50% 100%; }
  .halo { transform-origin: 50% 50%; }

  @media (prefers-reduced-motion: no-preference) {
    .wheal { animation: rise 4.8s cubic-bezier(.45, 0, .55, 1) infinite; }
    .halo { animation: glow 4.8s cubic-bezier(.45, 0, .55, 1) infinite; }
    .grain { animation: twinkle 3s ease-in-out infinite; }
  }
  @keyframes rise { 0%, 100% { transform: scale(.9, .72); } 50% { transform: scale(1, 1); } }
  @keyframes glow { 0%, 100% { opacity: .55; transform: scale(.9); } 50% { opacity: 1; transform: scale(1.06); } }
  @keyframes twinkle { 0%, 100% { opacity: .9; } 50% { opacity: .25; } }
</style>
