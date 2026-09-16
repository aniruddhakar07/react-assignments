import { formatTime, formatCountdown, unitSymbol } from '../utils/weatherIcons'
import { useLiveClock } from '../hooks/useLiveClock'
import WeatherIcon from './WeatherIcon.jsx'
import ConditionBadge from './ConditionBadge.jsx'

const CX = 200
const CY = 128
const R = 108

export default function SunArc({ weather, units }) {
  const { name, country, temp, feelsLike, description, icon, dt, sunrise, sunset, tz } = weather
  const symbol = unitSymbol(units)

  // `dt` is frozen at the moment the API responded — tick a live clock
  // forward from it so "Local time" and the sun's position stay current
  // even if the page is left open for a while.
  const liveDt = useLiveClock(dt)

  const span = sunset - sunrise
  const rawFraction = span > 0 ? (liveDt - sunrise) / span : 0.5
  const fraction = Math.min(1, Math.max(0, rawFraction))
  const isDaytime = liveDt >= sunrise && liveDt <= sunset

  const angle = fraction * Math.PI
  const sunX = CX - R * Math.cos(angle)
  const sunY = CY - R * Math.sin(angle)

  // Countdown to whichever sun event is still ahead today. If the sun
  // has already set, we only have today's sunrise/sunset from this API
  // response — not tomorrow's — so we show a static label instead of a
  // countdown to an unknown time.
  let countdownLabel = null
  if (liveDt < sunrise) {
    countdownLabel = `Sunrise in ${formatCountdown(sunrise - liveDt)}`
  } else if (liveDt <= sunset) {
    countdownLabel = `Sunset in ${formatCountdown(sunset - liveDt)}`
  }

  return (
    <div className="sun-arc-card">
      <div className="sun-arc-top">
        <div className="sun-arc-location">
          <h2>
            {name}
            {country ? `, ${country}` : ''}
          </h2>
          <span>Local time {formatTime(liveDt, tz)}</span>
        </div>
        <div className="sun-arc-temp">
          <span className="value">
            {Math.round(temp)}
            {symbol}
          </span>
          <span className="feels">
            Feels like {Math.round(feelsLike)}
            {symbol}
          </span>
        </div>
      </div>

      <div className="sun-arc-condition">
        <WeatherIcon code={icon} size={32} alt={description} />
        <ConditionBadge description={description} icon={icon} />
        {countdownLabel && <span className="sun-countdown">{countdownLabel}</span>}
      </div>

      <svg className="sun-arc-svg" viewBox="0 0 400 160" role="img" aria-label="Sun position between sunrise and sunset">
        <defs>
          <linearGradient id="arcGlow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--cyan)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="var(--sun)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--cyan)" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* horizon */}
        <line x1="16" y1={CY} x2="384" y2={CY} stroke="var(--glass-border)" strokeWidth="1.5" />

        {/* arc path */}
        <path
          d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`}
          fill="none"
          stroke="url(#arcGlow)"
          strokeWidth="2"
          strokeDasharray="2 6"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* sun/moon marker */}
        <circle cx={sunX} cy={sunY} r="9" fill={isDaytime ? 'var(--sun)' : 'var(--cyan)'}>
          {isDaytime && (
            <animate attributeName="opacity" values="1;0.75;1" dur="3s" repeatCount="indefinite" />
          )}
        </circle>
        <circle cx={sunX} cy={sunY} r="16" fill={isDaytime ? 'var(--sun)' : 'var(--cyan)'} opacity="0.18" />
      </svg>

      <div className="sun-arc-times">
        <span>🌅 Sunrise {formatTime(sunrise, tz)}</span>
        <span>🌇 Sunset {formatTime(sunset, tz)}</span>
      </div>
    </div>
  )
}
