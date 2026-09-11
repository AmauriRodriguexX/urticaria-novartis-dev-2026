<script>
  // Directorio de especialistas. Mapa real con Leaflet + tiles de OpenStreetMap (sin API key).
  // Los datos son de muestra hasta que exista el directorio curado por el equipo médico.
  import { onMount, onDestroy } from 'svelte'
  import Icon from './Icon.svelte'
  import { DARK } from './context.js'
  import 'leaflet/dist/leaflet.css'
  export let ctx = 'dia'
  export let onBack

  $: dark = DARK.has(ctx)

  const specialists = [
    { id: 1, name: 'Dra. Elena Cárdenas', type: 'alergologia', label: 'Alergología e Inmunología', address: 'Av. Reforma 1820, Col. Centro', cp: '97000', dist: '1.2 km', lat: 20.9720, lng: -89.6250 },
    { id: 2, name: 'Dr. Marco Villaseñor', type: 'dermatologia', label: 'Dermatología', address: 'Calle 60 #495, Col. García Ginerés', cp: '97070', dist: '2.0 km', lat: 20.9805, lng: -89.6310 },
    { id: 3, name: 'Dra. Paula Rentería', type: 'alergologia', label: 'Alergología', address: 'Prol. Montejo 220, Col. Itzimná', cp: '97100', dist: '2.8 km', lat: 20.9970, lng: -89.6180 },
    { id: 4, name: 'Dr. Iván Solórzano', type: 'dermatologia', label: 'Dermatología clínica', address: 'Av. Pérez Ponce 134, Col. Alcalá Martín', cp: '97050', dist: '3.4 km', lat: 20.9885, lng: -89.6085 },
    { id: 5, name: 'Dra. Renata Ceballos', type: 'alergologia', label: 'Alergología pediátrica', address: 'Calle 21 #142, Col. México Norte', cp: '97128', dist: '4.1 km', lat: 21.0040, lng: -89.6250 },
    { id: 6, name: 'Dr. Sergio Peniche', type: 'inmunologia', label: 'Inmunología clínica', address: 'Av. Colón 210, Col. García Ginerés', cp: '97070', dist: '2.4 km', lat: 20.9840, lng: -89.6240 }
  ]

  const TYPES = {
    alergologia: { label: 'Alergología', color: '#ee7067' },
    dermatologia: { label: 'Dermatología', color: '#0081a8' },
    inmunologia: { label: 'Inmunología', color: '#c9a227' }
  }

  let filter = 'todos'
  let zip = ''
  let active = null
  let mapEl, map, L
  let markers = new Map()

  // El código postal ordena por cercanía: primero coincidencia exacta, luego por
  // los primeros dígitos compartidos. Con el directorio real esto se sustituye
  // por la distancia que devuelva el servicio.
  function cercania(s, cp) {
    if (!cp) return 0
    if (s.cp === cp) return -100
    let comunes = 0
    for (let i = 0; i < Math.min(cp.length, s.cp.length); i++) {
      if (cp[i] !== s.cp[i]) break
      comunes++
    }
    return -comunes
  }
  $: cpValido = /^\d{5}$/.test(zip)
  $: porTipo = filter === 'todos' ? specialists : specialists.filter(s => s.type === filter)
  $: visible = cpValido ? [...porTipo].sort((a, b) => cercania(a, zip) - cercania(b, zip)) : porTipo
  $: conteo = (tipo) => tipo === 'todos' ? specialists.length : specialists.filter(s => s.type === tipo).length
  $: if (map) syncMarkers(visible)

  function pinIcon(s, isActive) {
    const color = TYPES[s.type].color
    return L.divIcon({
      className: 'pin-wrap',
      html: `<span class="pin${isActive ? ' is-active' : ''}" style="--pin:${color}"></span>`,
      iconSize: [26, 26],
      iconAnchor: [13, 26]
    })
  }

  function syncMarkers(list) {
    markers.forEach(m => m.remove())
    markers = new Map()
    list.forEach(s => {
      const m = L.marker([s.lat, s.lng], { icon: pinIcon(s, active === s.id), keyboard: true, title: s.name })
        .addTo(map)
        .on('click', () => select(s.id))
      markers.set(s.id, m)
    })
    if (list.length) map.fitBounds(list.map(s => [s.lat, s.lng]), { padding: [46, 46], maxZoom: 14 })
  }

  function select(id) {
    active = active === id ? null : id
    markers.forEach((m, key) => {
      const s = specialists.find(x => x.id === key)
      m.setIcon(pinIcon(s, active === key))
    })
    const s = specialists.find(x => x.id === id)
    if (active && s) map.panTo([s.lat, s.lng], { animate: true })
    if (active) document.getElementById(`doc-${id}`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  // --- desplazamiento de los filtros ---
  let scroller
  let puedeIzq = false, puedeDer = false
  function medirScroll() {
    if (!scroller) return
    const max = scroller.scrollWidth - scroller.clientWidth
    puedeIzq = scroller.scrollLeft > 4
    puedeDer = scroller.scrollLeft < max - 4
  }
  function desplazar(dir) {
    scroller?.scrollBy({ left: dir * Math.round(scroller.clientWidth * 0.7), behavior: 'smooth' })
  }

  onMount(async () => {
    const mod = await import('leaflet')
    L = mod.default ?? mod
    map = L.map(mapEl, { scrollWheelZoom: false, zoomControl: true, attributionControl: true })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      subdomains: 'abc',
      maxZoom: 18
    }).addTo(map)
    requestAnimationFrame(() => { map.invalidateSize(); syncMarkers(visible) })
  })

  onMount(() => {
    medirScroll()
    const ro = new ResizeObserver(medirScroll)
    if (scroller) ro.observe(scroller)
    return () => ro.disconnect()
  })

  onDestroy(() => map?.remove())
</script>

<div class="directory">
  <h2 tabindex="-1">Especialistas certificados cerca de ti</h2>
  <p class="sub">Alergólogos y dermatólogos de la red de atención en urticaria. <b>Llévale tu tarjeta a uno de ellos.</b></p>

  <div class="dir-controls">
    <div class="filters-wrap" class:at-start={!puedeIzq} class:at-end={!puedeDer}>
      <button type="button" class="scroll-arrow left" aria-label="Ver especialidades anteriores" tabindex="-1" on:click={() => desplazar(-1)}><Icon name="arrow_back" size={18} /></button>
      <div class="filters-scroll" bind:this={scroller} on:scroll={medirScroll}>
        <div class="filters" role="group" aria-label="Filtrar por especialidad">
          <button class:active={filter === 'todos'} aria-pressed={filter === 'todos'} on:click={() => filter = 'todos'}>
            Todos <em>{conteo('todos')}</em>
          </button>
          {#each Object.entries(TYPES) as [key, t]}
            <button class:active={filter === key} aria-pressed={filter === key} on:click={() => filter = key}>
              <i class="dot" style={`background:${t.color}`}></i>{t.label} <em>{conteo(key)}</em>
            </button>
          {/each}
        </div>
      </div>
      <button type="button" class="scroll-arrow right" aria-label="Ver más especialidades" tabindex="-1" on:click={() => desplazar(1)}><Icon name="arrow_forward" size={18} /></button>
    </div>
    <label class="zip" class:is-on={cpValido}>
      <Icon name="location_on" size={18} />
      <input bind:value={zip} inputmode="numeric" maxlength="5" autocomplete="postal-code" placeholder="Tu código postal" aria-label="Código postal" />
      {#if zip}<button type="button" class="zip-clear" aria-label="Borrar código postal" on:click={() => zip = ''}><Icon name="close" size={16} /></button>{/if}
    </label>
  </div>

  <div class="dir-grid">
    <div class="dir-map-pane">
      <div class="map-shell" class:is-dark={dark}>
        <div class="map" bind:this={mapEl} role="application" aria-label="Mapa de especialistas"></div>
      </div>
      <div class="dir-tips">
        <strong><Icon name="stethoscope" size={17} /> ¿Qué llevar a tu consulta?</strong>
        <p>1. Fotos de tus brotes fechadas. 2. Nota de si duran menos o más de 24 h. 3. Antihistamínicos que ya probaste.</p>
      </div>
    </div>

    <div class="dir-list-pane">
      {#if cpValido}<p class="dir-status"><Icon name="location_on" size={15} /> Ordenado por cercanía al {zip}.</p>{/if}

      <ul class="doc-list">
        {#each visible as s (s.id)}
          <li>
            <button id={`doc-${s.id}`} class="doc" class:is-active={active === s.id} on:click={() => select(s.id)} aria-pressed={active === s.id}>
              <span class="doc-dot" style={`background:${TYPES[s.type].color}`}></span>
              <span class="doc-body">
                <strong>{s.name}</strong>
                <span class="doc-spec">{s.label}</span>
                <span class="doc-addr"><Icon name="location_on" size={14} />{s.address}</span>
              </span>
              <span class="doc-dist">{s.dist}</span>
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <button class="outline dir-back-btn" on:click={onBack}><Icon name="arrow_back" size={18} /><span>Volver</span></button>
</div>
