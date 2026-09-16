import { conditionGroup } from './conditionGroup'

function toCelsius(temp, units) {
  return units === 'imperial' ? ((temp - 32) * 5) / 9 : temp
}

function toMps(speed, units) {
  return units === 'imperial' ? speed * 0.44704 : speed
}

// A short, human-readable one-liner built from temperature, humidity,
// wind and condition — a small comfort layer on top of the raw numbers.
// Deliberately simple rule-based logic; no API call needed.
export function summarize({ temp, feelsLike, humidity, windSpeed, icon }, units) {
  const tempC = toCelsius(temp, units)
  const feelsC = toCelsius(feelsLike, units)
  const windMps = toMps(windSpeed, units)
  const group = conditionGroup(icon)

  if (group === 'storm') return 'Thunderstorms nearby — best to stay indoors if you can.'
  if (group === 'rain') return "Rain's falling — grab an umbrella before heading out."
  if (group === 'snow') return 'Snow is falling — roads and paths may be slippery.'

  if (feelsC <= tempC - 3) return 'Feels colder than the number suggests — the wind is biting.'
  if (feelsC >= tempC + 3 && humidity >= 60) return "It's muggy — feels warmer than it actually is."

  if (tempC >= 34) return "It's very hot out there — stay hydrated and seek shade."
  if (tempC <= 2) return "Bundle up — it's close to freezing."

  if (windMps >= 10) return "It's quite windy — hold onto your hat."

  if (group === 'mist') return "Visibility is reduced — drive carefully if you're heading out."

  if (group === 'clear' && tempC >= 18 && tempC <= 28 && humidity < 65) {
    return 'Great day to be outside.'
  }

  if (group === 'clouds') return 'Overcast skies, but nothing to worry about.'

  return 'Comfortable conditions right now.'
}
