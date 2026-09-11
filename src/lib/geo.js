// Servicio de contexto geográfico y climático para tuvidaesmásgrande.org
// Diseñado para ser no bloqueante, resiliente y respetuoso de la privacidad.

const CACHE_KEY = 'uce_geo_ctx'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutos de caché en sesión

export async function detectGeoAndWeather() {
  if (typeof window === 'undefined') return null

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
    const geoUrl = ipinfoToken
      ? `https://ipinfo.io/json?token=${ipinfoToken}`
      : 'https://ipapi.co/json/'

    const geoRes = await fetch(geoUrl, { signal: controller.signal })
    if (!geoRes.ok) throw new Error('Geo lookup failed')
    const geoData = await geoRes.json()

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
