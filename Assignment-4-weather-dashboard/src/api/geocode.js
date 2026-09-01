// Resolves place names into coordinates, using two sources merged
// together:
//
// 1. OpenWeatherMap's Geocoding API — fast, and shares the same key as
//    the weather requests, but its place database isn't exhaustive and
//    can return an unrelated place that happens to share a name.
// 2. OpenStreetMap's Nominatim API — free, no key required, and has
//    much broader coverage of small places worldwide (built from
//    community-mapped OSM data).
//
// Both are queried on every search and merged into one list, so places
// that share a name in different countries (e.g. two "Muktarpur"s) all
// show up as distinct, pickable suggestions instead of the app silently
// guessing which one you meant.

function owmKey(place) {
  return `owm-${place.name}-${place.state || ''}-${place.country || ''}-${place.lat}-${place.lon}`
}

async function searchOWM(query, apiKey, limit) {
  if (!apiKey) return []

  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
    query
  )}&limit=${limit}&appid=${apiKey}`

  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('That API key was rejected. Double-check it and try again.')
    }
    throw new Error(`Location lookup failed (${response.status}).`)
  }

  const data = await response.json()

  return data.map((place) => ({
    name: place.name,
    state: place.state || '',
    country: place.country || '',
    lat: place.lat,
    lon: place.lon,
    key: owmKey(place),
  }))
}

async function searchNominatim(query, limit) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    query
  )}&format=jsonv2&addressdetails=1&limit=${limit}`

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) return []

  const data = await response.json()

  return data.map((place) => {
    const addr = place.address || {}
    const name =
      addr.village || addr.town || addr.city || addr.hamlet || addr.suburb || place.name || place.display_name.split(',')[0]
    const state = addr.state || addr.county || ''
    const country = addr.country_code ? addr.country_code.toUpperCase() : addr.country || ''
    const lat = parseFloat(place.lat)
    const lon = parseFloat(place.lon)
    return {
      name,
      state,
      country,
      lat,
      lon,
      key: `osm-${place.place_id}`,
    }
  })
}

// De-duplicates places that are essentially the same location
// (e.g. both sources returning the same village) by rounding coordinates.
function dedupe(places) {
  const seen = new Set()
  const result = []
  for (const place of places) {
    const roundedKey = `${place.name.toLowerCase()}-${place.lat.toFixed(2)}-${place.lon.toFixed(2)}`
    if (!seen.has(roundedKey)) {
      seen.add(roundedKey)
      result.push(place)
    }
  }
  return result
}

export async function searchLocations(query, apiKey, limit = 5) {
  const trimmed = query.trim()
  if (!trimmed) return []

  // Query both sources concurrently and merge, rather than trusting
  // whichever one answers first — a name like "Muktarpur" can exist in
  // OWM's database (e.g. in Bangladesh) while a *different* place with
  // the same name (e.g. in Hooghly, India) only shows up via Nominatim.
  // Merging both lets the user pick the right one instead of the app
  // silently guessing.
  const [owmResult, osmResult] = await Promise.allSettled([
    searchOWM(trimmed, apiKey, limit),
    searchNominatim(trimmed, Math.max(limit, 8)),
  ])

  if (owmResult.status === 'rejected' && osmResult.status === 'rejected') {
    throw owmResult.reason
  }

  const owmResults = owmResult.status === 'fulfilled' ? owmResult.value : []
  const osmResults = osmResult.status === 'fulfilled' ? osmResult.value : []

  return dedupe([...owmResults, ...osmResults])
}

export function formatLocationLabel(place) {
  return [place.name, place.state, place.country].filter(Boolean).join(', ')
}
