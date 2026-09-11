// Servicio de contexto geográfico y climático para tuvidaesmásgrande.org
// Diseñado para ser no bloqueante, resiliente y respetuoso de la privacidad.

const CACHE_KEY = 'uce_geo_ctx'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutos de caché en sesión

export async function detectGeoAndWeather() {
  if (typeof window === 'undefined') return null

  // 0. Simulación directa por parámetros de URL (?ciudad=Monterrey&temp=35)
  const params = new URLSearchParams(window.location.search)
  const simCity = params.get('ciudad') || params.get('city')
  const simTemp = params.get('temp') || params.get('temperatura')
  if (simCity || simTemp) {
    const cityClean = (simCity || 'Ciudad de México').toLowerCase().trim()
    const cityCoords = {
      'monterrey': { lat: 25.6866, lon: -100.3161 },
      'guadalajara': { lat: 20.6597, lon: -103.3496 },
      'zapopan': { lat: 20.7233, lon: -103.3848 },
      'mérida': { lat: 20.9674, lon: -89.5926 },
      'merida': { lat: 20.9674, lon: -89.5926 },
      'puebla': { lat: 19.0414, lon: -98.2063 },
      'querétaro': { lat: 20.5888, lon: -100.3899 },
      'queretaro': { lat: 20.5888, lon: -100.3899 },
      'toluca': { lat: 19.2826, lon: -99.6557 },
      'tijuana': { lat: 32.5149, lon: -117.0382 },
      'león': { lat: 21.1221, lon: -101.6826 },
      'leon': { lat: 21.1221, lon: -101.6826 },
      'cancún': { lat: 21.1619, lon: -86.8515 },
      'cancun': { lat: 21.1619, lon: -86.8515 }
    }
    const coords = cityCoords[cityClean] || { lat: 19.4326, lon: -99.1332 }
    return {
      city: simCity || 'Ciudad de México',
      temp: simTemp ? parseFloat(simTemp) : 22,
      lat: coords.lat,
      lon: coords.lon
    }
  }

  // 1. Revisar caché de sesión
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (Date.now() - parsed.timestamp < CACHE_TTL && parsed.data) {
        return parsed.data
      }
    }
  } catch {}

  // 2. Timeout de seguridad de 2.2 segundos para no demorar la carga
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 2200)

  try {
    // Paso A: IPinfo / Geo IP
    const ipinfoToken = import.meta.env.VITE_IPINFO_TOKEN
    let geoData = null

    if (ipinfoToken) {
      try {
        const r = await fetch(`https://ipinfo.io/json?token=${ipinfoToken}`, { signal: controller.signal })
        if (r.ok) geoData = await r.json()
      } catch {}
    }

    if (!geoData) {
      try {
        const r = await fetch('https://ipwho.is/', { signal: controller.signal })
        if (r.ok) {
          const d = await r.json()
          if (d.success !== false) geoData = d
        }
      } catch {}
    }

    if (!geoData) {
      try {
        const r = await fetch('https://ipapi.co/json/', { signal: controller.signal })
        if (r.ok) {
          const d = await r.json()
          if (!d.error) geoData = d
        }
      } catch {}
    }

    if (!geoData) throw new Error('Geo lookup unavailable')

    const city = geoData.city || null
    let lat = geoData.latitude || (geoData.loc ? parseFloat(geoData.loc.split(',')[0]) : null)
    let lon = geoData.longitude || (geoData.loc ? parseFloat(geoData.loc.split(',')[1]) : null)
    let temp = null

    // Paso B: Clima (OpenWeatherMap o fallback abierto de Open-Meteo)
    if (lat != null && lon != null) {
      const owmKey = import.meta.env.VITE_OPENWEATHER_API_KEY
      if (owmKey) {
        const wUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${owmKey}`
        const wRes = await fetch(wUrl, { signal: controller.signal })
        if (wRes.ok) {
          const wData = await wRes.json()
          temp = wData.main?.temp ?? null
        }
      } else {
        // Fallback robusto y sin API key: Open-Meteo
        const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
        const omRes = await fetch(omUrl, { signal: controller.signal })
        if (omRes.ok) {
          const omData = await omRes.json()
          temp = omData.current?.temperature_2m ?? null
        }
      }
    }

    clearTimeout(timeoutId)

    const result = { city, temp, lat, lon }
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data: result }))
    } catch {}

    return result
  } catch {
    clearTimeout(timeoutId)
    return null
  }
}
