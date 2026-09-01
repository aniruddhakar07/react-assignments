import WeatherIcon from './WeatherIcon.jsx'

function dayLabel(dt, tzOffsetSeconds, index) {
  const localMs = (dt + tzOffsetSeconds) * 1000
  const date = new Date(localMs)
  const weekday = index === 0 ? 'Today' : date.toLocaleDateString(undefined, { weekday: 'short', timeZone: 'UTC' })
  const dayOfMonth = date.toLocaleDateString(undefined, { day: 'numeric', timeZone: 'UTC' })
  return { weekday, dayOfMonth }
}

export default function ForecastStrip({ forecast }) {
  if (!forecast || forecast.length === 0) return null

  return (
    <div className="forecast-strip">
      <p className="forecast-title">Next {forecast.length} days</p>
      <div className="forecast-row">
        {forecast.map((day, i) => {
          const { weekday, dayOfMonth } = dayLabel(day.dt, day.tz, i)
          return (
            <div className="forecast-card" key={day.dayKey}>
              <span className="forecast-day">{weekday}</span>
              <span className="forecast-date">{dayOfMonth}</span>
              <WeatherIcon code={day.icon} size={40} alt={day.description} />
              <span className="forecast-temp">
                {Math.round(day.tempMax)}°<span className="low">{Math.round(day.tempMin)}°</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
