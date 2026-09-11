<script>
  // Directorio de especialistas certificados cerca de ti.
  // Cuenta con geolocalización GPS del navegador + detección automática de zona por IP/ciudad simulada.
  // Mapa interactivo con Leaflet + tiles de OpenStreetMap (sin API key requerida).
  import { onMount, onDestroy } from 'svelte'
  import Icon from './Icon.svelte'
  import { DARK } from './context.js'
  import { detectGeoAndWeather } from './geo.js'
  import 'leaflet/dist/leaflet.css'

  export let ctx = 'dia'
  export let onBack

  $: dark = DARK.has(ctx)

  // Red nacional de especialistas certificados en Alergología, Dermatología e Inmunología
  const specialists = [
    // Ciudad de México y Área Metropolitana
    { id: 1, name: 'Dra. Sofía Valenzuela Méndez', type: 'alergologia', label: 'Alergología e Inmunología', address: 'Hospital Español, Ejército Nacional 613, Polanco', cp: '11520', city: 'Ciudad de México', defaultDist: '1.2 km', lat: 19.4402, lng: -99.1915 },
    { id: 2, name: 'Dr. Alejandro Morales Trejo', type: 'dermatologia', label: 'Dermatología Clínica', address: 'Médica Sur, Puente de Piedra 150, Tlalpan', cp: '14050', city: 'Ciudad de México', defaultDist: '2.1 km', lat: 19.2991, lng: -99.1554 },
    { id: 3, name: 'Dra. Mariana Estrada Ríos', type: 'alergologia', label: 'Alergología de Alta Especialidad', address: 'Hospital Ángeles del Pedregal, Camino a Santa Teresa 1055', cp: '10700', city: 'Ciudad de México', defaultDist: '3.4 km', lat: 19.3147, lng: -99.2185 },
    { id: 4, name: 'Dr. Carlos Guzmán Viveros', type: 'dermatologia', label: 'Dermatología y UCE', address: 'Álvaro Obregón 151, Col. Roma Norte', cp: '06700', city: 'Ciudad de México', defaultDist: '1.8 km', lat: 19.4172, lng: -99.1620 },
    { id: 5, name: 'Dra. Valeria Ortiz Peñaloza', type: 'inmunologia', label: 'Inmunología Clínica', address: 'Centro Médico ABC Santa Fe, Carlos Graef 154', cp: '05300', city: 'Ciudad de México', defaultDist: '4.5 km', lat: 19.3592, lng: -99.2783 },
    { id: 6, name: 'Dr. Roberto Lozano Garza', type: 'alergologia', label: 'Alergología Integral', address: 'Insurgentes Sur 1388, Col. Actipan / Del Valle', cp: '03230', city: 'Ciudad de México', defaultDist: '2.8 km', lat: 19.3712, lng: -99.1788 },

    // Guadalajara y Zapopan
    { id: 7, name: 'Dr. Marco Villaseñor Fuentes', type: 'dermatologia', label: 'Dermatología', address: 'Puerta de Hierro 5150, Zapopan', cp: '45116', city: 'Guadalajara / Zapopan', defaultDist: '2.0 km', lat: 20.7103, lng: -103.4145 },
    { id: 8, name: 'Dra. Renata Ceballos Barreda', type: 'alergologia', label: 'Alergología e Inmunología', address: 'Av. Terranova 295, Col. Providencia, Guadalajara', cp: '44630', city: 'Guadalajara', defaultDist: '2.5 km', lat: 20.6931, lng: -103.3832 },
    { id: 9, name: 'Dr. Héctor Navarro Cuevas', type: 'dermatologia', label: 'Dermatología Clínica', address: 'Av. Vallarta 1525, Col. Americana, Guadalajara', cp: '44160', city: 'Guadalajara', defaultDist: '3.1 km', lat: 20.6749, lng: -103.3670 },

    // Monterrey y San Pedro Garza García
    { id: 10, name: 'Dra. Laura Garza Benavides', type: 'alergologia', label: 'Alergología e Inmunología', address: 'Hospital Zambrano Hellion, Batallón de San Patricio 112', cp: '66278', city: 'Monterrey', defaultDist: '2.3 km', lat: 25.6489, lng: -100.3347 },
    { id: 11, name: 'Dr. Andrés Cavazos Sada', type: 'dermatologia', label: 'Dermatología Avanzada', address: 'Doctors Hospital, Ecuador 2331, San Jerónimo', cp: '64620', city: 'Monterrey', defaultDist: '3.0 km', lat: 25.6811, lng: -100.3598 },
    { id: 12, name: 'Dra. Marcela Treviño Cantú', type: 'inmunologia', label: 'Inmunología Clínica', address: 'Hospital San José TecSalud, Morones Prieto 3000 Pte', cp: '64710', city: 'Monterrey', defaultDist: '3.8 km', lat: 25.6661, lng: -100.3475 },

    // Puebla
    { id: 13, name: 'Dra. Gabriela Cordero Vega', type: 'alergologia', label: 'Alergología', address: 'Hospital Puebla, Privada de las Ramblas 4, Angelópolis', cp: '72197', city: 'Puebla', defaultDist: '2.2 km', lat: 19.0272, lng: -98.2295 },
    { id: 14, name: 'Dr. Fernando Montiel Téllez', type: 'dermatologia', label: 'Dermatología', address: 'Av. Juárez 2108, Col. La Paz, Puebla', cp: '72160', city: 'Puebla', defaultDist: '2.9 km', lat: 19.0514, lng: -98.2198 },

    // Querétaro
    { id: 15, name: 'Dra. Mónica Balderas Ortiz', type: 'alergologia', label: 'Alergología e Inmunología', address: 'Médica Moscati, Villas del Mesón 40, Juriquilla', cp: '76230', city: 'Querétaro', defaultDist: '2.4 km', lat: 20.7025, lng: -100.4430 },
    { id: 16, name: 'Dr. Daniel Quiroz Ramos', type: 'dermatologia', label: 'Dermatología', address: 'Hospital Ángeles Querétaro, Bernardino del Razo 21', cp: '76010', city: 'Querétaro', defaultDist: '3.2 km', lat: 20.5794, lng: -100.4042 },

    // Mérida
    { id: 17, name: 'Dra. Elena Cárdenas Pantoja', type: 'alergologia', label: 'Alergología e Inmunología', address: 'Calle 7 #215, Fracc. Altabrisa, Mérida', cp: '97130', city: 'Mérida', defaultDist: '1.5 km', lat: 21.0185, lng: -89.5855 },
    { id: 18, name: 'Dr. Sergio Peniche Gamboa', type: 'inmunologia', label: 'Inmunología Clínica', address: 'Av. Colón 210, Col. García Ginerés, Mérida', cp: '97070', city: 'Mérida', defaultDist: '2.4 km', lat: 20.9840, lng: -89.6240 },
    { id: 19, name: 'Dra. Paula Rentería Solís', type: 'alergologia', label: 'Alergología', address: 'Prol. Montejo 220, Col. Itzimná, Mérida', cp: '97100', city: 'Mérida', defaultDist: '2.8 km', lat: 20.9970, lng: -89.6180 },
    { id: 20, name: 'Dr. Iván Solórzano Peón', type: 'dermatologia', label: 'Dermatología Clínica', address: 'Av. Pérez Ponce 134, Col. Alcalá Martín, Mérida', cp: '97050', city: 'Mérida', defaultDist: '3.4 km', lat: 20.9885, lng: -89.6085 }
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
  let userMarker = null

  // Estado de geolocalización
  let userCoords = null // { lat, lng, source: 'gps' | 'ip', city: string | null }
  let locating = false
  let geoNotice = ''

  // Cálculo de distancia ortodrómica (Haversine) en km
  function calcDistKm(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  function formatDist(km) {
    if (km == null || isNaN(km)) return ''
    if (km < 1) return `${Math.round(km * 1000)} m`
    return `${km.toFixed(1)} km`
  }

  // Ordenamiento por código postal (coincidencia de prefijos)
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

  // Especialistas con distancia calculada en tiempo real según la ubicación activa
  $: specialistsWithDist = specialists.map(s => {
    const distKm = userCoords ? calcDistKm(userCoords.lat, userCoords.lng, s.lat, s.lng) : null
    return {
      ...s,
      distKm,
      distText: distKm != null ? formatDist(distKm) : s.defaultDist
    }
  })

  $: porTipo = filter === 'todos' ? specialistsWithDist : specialistsWithDist.filter(s => s.type === filter)

  // Si hay CP válido, manda el CP. Si no, si hay geolocalización (GPS o IP), ordena por distancia ascendente
  $: visible = cpValido
    ? [...porTipo].sort((a, b) => cercania(a, zip) - cercania(b, zip))
    : (userCoords ? [...porTipo].sort((a, b) => (a.distKm ?? 99999) - (b.distKm ?? 99999)) : porTipo)

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

  function updateUserMarker() {
    if (!map || !L || !userCoords) return
    if (userMarker) {
      userMarker.remove()
      userMarker = null
    }

    const isGps = userCoords.source === 'gps'
    const userIcon = L.divIcon({
      className: 'user-pin-wrap',
      html: '<span class="user-pulse"></span><span class="user-pin"></span>',
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    })

    userMarker = L.marker([userCoords.lat, userCoords.lng], {
      icon: userIcon,
      zIndexOffset: 1200,
      title: isGps ? 'Tu ubicación exacta' : 'Tu ubicación aproximada'
    }).addTo(map)

    userMarker.bindTooltip(
      isGps ? '📍 Tu ubicación actual' : `📍 Tu zona (${userCoords.city || 'aproximada'})`,
      { permanent: false, direction: 'top', offset: [0, -12] }
    )
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

    updateUserMarker()

    if (list.length) {
      if (userCoords) {
        // Enfoca el mapa tomando en cuenta tu ubicación y los especialistas más cercanos
        const topNear = list.slice(0, 4).map(s => [s.lat, s.lng])
        topNear.push([userCoords.lat, userCoords.lng])
        map.fitBounds(topNear, { padding: [46, 46], maxZoom: 13 })
      } else {
        map.fitBounds(list.map(s => [s.lat, s.lng]), { padding: [46, 46], maxZoom: 14 })
      }
    }
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

  // Solicitud explícita de ubicación GPS por el navegador
  function solicitarGps() {
    if (typeof window === 'undefined') return
    if (!navigator?.geolocation) {
      geoNotice = 'Tu navegador no soporta geolocalización GPS.'
      setTimeout(() => geoNotice = '', 4500)
      return
    }

    locating = true
    geoNotice = ''

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locating = false
        userCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          source: 'gps',
          city: null
        }
        if (map) {
          map.setView([userCoords.lat, userCoords.lng], 13, { animate: true })
          updateUserMarker()
        }
      },
      (err) => {
        locating = false
        console.warn('Geolocation denied or timeout:', err)
        geoNotice = 'No se pudo obtener tu GPS exacto. Se mantendrá la ubicación aproximada de tu conexión.'
        setTimeout(() => geoNotice = '', 5000)
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 60000 }
    )
  }

  // --- desplazamiento horizontal de los filtros de especialidad ---
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

    // Detección inicial no bloqueante por IP o simulación URL
    detectGeoAndWeather().then(geo => {
      if (geo?.lat && geo?.lon && !userCoords) {
        userCoords = {
          lat: geo.lat,
          lng: geo.lon,
          source: 'ip',
          city: geo.city || null
        }
        requestAnimationFrame(() => {
          if (map) {
            map.invalidateSize()
            syncMarkers(visible)
          }
        })
      }
    }).catch(() => {})

    requestAnimationFrame(() => {
      map.invalidateSize()
      syncMarkers(visible)
    })
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
  <p class="sub">Alergólogos, dermatólogos e inmunólogos de la red de atención en urticaria. <b>Llévale tu resumen a uno de ellos.</b></p>

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

    <div class="dir-actions">
      <button
        type="button"
        class="geo-btn"
        class:is-active={userCoords?.source === 'gps'}
        class:loading={locating}
        on:click={solicitarGps}
        title="Centrar y ordenar por tu ubicación actual GPS"
        aria-label="Usar mi ubicación actual"
      >
        <Icon name="my_location" size={17} />
        <span>{locating ? 'Localizando...' : (userCoords?.source === 'gps' ? 'GPS activo' : 'Cerca de mí')}</span>
      </button>

      <label class="zip" class:is-on={cpValido}>
        <Icon name="location_on" size={18} />
        <input bind:value={zip} inputmode="numeric" maxlength="5" autocomplete="postal-code" placeholder="C. Postal" aria-label="Código postal" />
        {#if zip}<button type="button" class="zip-clear" aria-label="Borrar código postal" on:click={() => zip = ''}><Icon name="close" size={16} /></button>{/if}
      </label>
    </div>
  </div>

  <div class="dir-grid">
    <div class="dir-map-pane">
      <div class="map-shell" class:is-dark={dark}>
        <div class="map" bind:this={mapEl} role="application" aria-label="Mapa de especialistas"></div>
      </div>
      <div class="dir-tips">
        <strong><Icon name="stethoscope" size={17} /> ¿Qué llevar a tu consulta?</strong>
        <p>1. Tu <b>resumen descargado</b> del test. 2. Fotos de tus brotes fechadas. 3. Lista de antihistamínicos que ya has probado.</p>
      </div>
    </div>

    <div class="dir-list-pane">
      {#if cpValido}
        <p class="dir-status"><Icon name="location_on" size={15} /> Ordenado por cercanía al CP {zip}.</p>
      {:else if userCoords?.source === 'gps'}
        <p class="dir-status"><Icon name="my_location" size={15} /> Especialistas ordenados por cercanía a tu GPS actual.</p>
      {:else if userCoords?.city}
        <p class="dir-status"><Icon name="location_on" size={15} /> Ordenado por cercanía a {userCoords.city} (ubicación estimada).</p>
      {:else if geoNotice}
        <p class="dir-status" style="color: var(--soft);">{geoNotice}</p>
      {/if}

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
              {#if s.distText}
                <span class="doc-dist" title="Distancia calculada">{s.distText}</span>
              {/if}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <button class="outline dir-back-btn" on:click={onBack}><Icon name="arrow_back" size={18} /><span>Volver</span></button>
</div>
