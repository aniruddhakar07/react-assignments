import { windUnit } from '../utils/weatherIcons'
import { uvCategory, aqiCategory } from '../api/extras'
import WindDirection from './WindDirection.jsx'

export default function WeatherStats({ weather, units, extras }) {
  const { humidity, windSpeed, windDeg } = weather
  const uv = extras ? uvCategory(extras.uvIndex) : null
  const aqi = extras ? aqiCategory(extras.aqi) : null

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <p className="stat-label">Humidity</p>
        <p className="stat-value">{humidity}%</p>
      </div>
      <div className="stat-card">
        <p className="stat-label">Wind Speed</p>
        <p className="stat-value stat-value-with-icon">
          {windSpeed} {windUnit(units)}
          <WindDirection deg={windDeg} />
        </p>
      </div>
      {uv && (
        <div className="stat-card">
          <p className="stat-label">UV Index</p>
          <p className={`stat-value tone-${uv.tone}`}>
            {uv.label} ({Math.round(extras.uvIndex)})
          </p>
        </div>
      )}
      {aqi && (
        <div className="stat-card">
          <p className="stat-label">Air Quality</p>
          <p className={`stat-value tone-${aqi.tone}`}>{aqi.label}</p>
        </div>
      )}
    </div>
  )
}
