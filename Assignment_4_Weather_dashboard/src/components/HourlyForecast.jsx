import { unitSymbol } from '../utils/weatherIcons'
import WeatherIcon from './WeatherIcon.jsx'

function hourLabel(dt, tzOffsetSeconds, isFirst) {
  if (isFirst) return 'Now'
  const localMs = (dt + tzOffsetSeconds) * 1000
  const date = new Date(localMs)
  let hours = date.getUTCHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}${ampm}`
}

export default function HourlyForecast({ hourly, units }) {
  if (!hourly || hourly.length === 0) return null
  const symbol = unitSymbol(units)

  return (
    <div className="hourly-strip">
      <p className="hourly-title">Coming up</p>
      <div className="hourly-row">
        {hourly.map((hour, i) => (
          <div className="hourly-card" key={hour.dt}>
            <span className="hourly-time">{hourLabel(hour.dt, hour.tz, i === 0)}</span>
            <WeatherIcon code={hour.icon} size={30} alt={hour.description} />
            <span className="hourly-temp">
              {Math.round(hour.temp)}
              {symbol}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
