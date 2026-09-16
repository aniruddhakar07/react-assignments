// Thin wrapper around OpenWeatherMap's current-weather and 5-day/3-hour
// forecast endpoints. Kept separate from App.jsx / useWeather.js so the
// "how we talk to the API" concern is isolated from "how the UI reacts
// to it" — makes each piece easier to read, test, and grade on its own.

function buildUrl(path, params) {
  const url = new URL(`https://api.openweathermap.org/data/2.5/${path}`)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
  return url.toString()
}

async function request(url) {
  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('That API key was rejected. Double-check it and try again.')
    }
    if (response.status === 429) {
      throw new Error('Too many requests to the weather service. Wait a moment and try again.')
    }
    throw new Error(`Weather service returned an error (${response.status}).`)
  }

  return response.json()
}

export function fetchCurrentWeather({ lat, lon, apiKey, units }) {
  return request(buildUrl('weather', { lat, lon, appid: apiKey, units }))
}

export function fetchForecast({ lat, lon, apiKey, units }) {
  return request(buildUrl('forecast', { lat, lon, appid: apiKey, units }))
}

export function shapeCurrentWeather(raw, place) {
  return {
    // Prefer the place the user actually selected — OpenWeatherMap's
    // weather endpoint does its own reverse-geocoding internally and
    // can label the coordinates with a nearby larger town instead of
    // the exact place searched for.
    name: place?.name || raw.name,
    country: place?.country || raw.sys?.country,
    temp: raw.main.temp,
    feelsLike: raw.main.feels_like,
    humidity: raw.main.humidity,
    windSpeed: raw.wind.speed,
    windDeg: raw.wind.deg,
    description: raw.weather[0]?.description ?? '',
    icon: raw.weather[0]?.icon ?? '',
    sunrise: raw.sys.sunrise,
    sunset: raw.sys.sunset,
    dt: raw.dt,
    tz: raw.timezone,
  }
}

// The forecast endpoint's first several entries (3-hour steps) give us
// the near-term outlook — shown as a scrollable "next hours" strip,
// which is often more useful than the 5-day view for "do I need an
// umbrella soon" style questions.
export function shapeHourlyForecast(raw, count = 8) {
  const tz = raw.city?.timezone ?? 0
  return raw.list.slice(0, count).map((entry) => ({
    dt: entry.dt,
    tz,
    temp: entry.main.temp,
    icon: entry.weather[0]?.icon ?? '',
    description: entry.weather[0]?.description ?? '',
  }))
}

// The forecast endpoint returns data in 3-hour steps for 5 days.
// We pick one representative entry per calendar day (the one closest
// to midday local time) so the UI can show a clean "next 5 days" strip
// instead of 40 raw entries.
export function shapeForecast(raw) {
  const tz = raw.city?.timezone ?? 0
  const byDay = new Map()

  for (const entry of raw.list) {
    const localMs = (entry.dt + tz) * 1000
    const localDate = new Date(localMs)
    const dayKey = localDate.toISOString().slice(0, 10)
    const localHour = localDate.getUTCHours()
    const distanceFromNoon = Math.abs(localHour - 12)

    const existing = byDay.get(dayKey)
    if (!existing || distanceFromNoon < existing.distanceFromNoon) {
      byDay.set(dayKey, {
        dayKey,
        dt: entry.dt,
        tz,
        temp: entry.main.temp,
        tempMin: entry.main.temp_min,
        tempMax: entry.main.temp_max,
        icon: entry.weather[0]?.icon ?? '',
        description: entry.weather[0]?.description ?? '',
        distanceFromNoon,
      })
    }
  }

  return Array.from(byDay.values())
    .sort((a, b) => a.dt - b.dt)
    .slice(0, 5)
}
