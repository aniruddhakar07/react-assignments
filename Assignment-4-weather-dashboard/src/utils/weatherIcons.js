// Unit label helpers, plus local-time formatting from a unix timestamp
// and a timezone offset. The icon glyphs themselves now live in
// components/WeatherIcon.jsx as hand-drawn SVGs, rather than being
// looked up from here.

export function unitSymbol(units) {
  return units === 'imperial' ? '°F' : '°C'
}

export function windUnit(units) {
  return units === 'imperial' ? 'mph' : 'm/s'
}

export function formatTime(unixSeconds, timezoneOffsetSeconds) {
  if (!unixSeconds) return '—'
  const localMs = (unixSeconds + timezoneOffsetSeconds) * 1000
  const date = new Date(localMs)
  let hours = date.getUTCHours()
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${ampm}`
}

// Formats a duration in seconds as "2h 14m" (or just "14m" under an hour).
export function formatCountdown(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours <= 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
}
