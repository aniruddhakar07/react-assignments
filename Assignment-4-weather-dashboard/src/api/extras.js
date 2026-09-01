// UV Index and Air Quality via Open-Meteo — chosen over OpenWeatherMap's
// equivalents because OWM moved UV Index behind its paid "One Call 3.0"
// tier, while Open-Meteo's forecast and air-quality APIs are free and
// need no API key at all. Kept as a best-effort addition: if either
// request fails, the caller just won't show these badges.

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Extras request failed (${response.status}).`)
  return response.json()
}

export async function fetchExtras(lat, lon) {
  const [uvResult, aqiResult] = await Promise.allSettled([
    fetchJson(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=uv_index&timezone=auto`
    ),
    fetchJson(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`
    ),
  ])

  const uvIndex = uvResult.status === 'fulfilled' ? uvResult.value?.current?.uv_index : null
  const aqi = aqiResult.status === 'fulfilled' ? aqiResult.value?.current?.us_aqi : null

  if (uvIndex == null && aqi == null) return null
  return { uvIndex, aqi }
}

export function uvCategory(uvIndex) {
  if (uvIndex == null) return null
  if (uvIndex < 3) return { label: 'Low', tone: 'good' }
  if (uvIndex < 6) return { label: 'Moderate', tone: 'moderate' }
  if (uvIndex < 8) return { label: 'High', tone: 'poor' }
  if (uvIndex < 11) return { label: 'Very High', tone: 'poor' }
  return { label: 'Extreme', tone: 'bad' }
}

export function aqiCategory(aqi) {
  if (aqi == null) return null
  if (aqi <= 50) return { label: 'Good', tone: 'good' }
  if (aqi <= 100) return { label: 'Moderate', tone: 'moderate' }
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', tone: 'poor' }
  if (aqi <= 200) return { label: 'Unhealthy', tone: 'poor' }
  if (aqi <= 300) return { label: 'Very Unhealthy', tone: 'bad' }
  return { label: 'Hazardous', tone: 'bad' }
}
