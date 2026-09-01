import { uvCategory, aqiCategory } from '../api/extras'

export default function ExtrasBadges({ extras }) {
  if (!extras) return null

  const uv = uvCategory(extras.uvIndex)
  const aqi = aqiCategory(extras.aqi)

  if (!uv && !aqi) return null

  return (
    <div className="extras-badges">
      {uv && (
        <span className={`extras-badge tone-${uv.tone}`}>
          UV: {uv.label} ({Math.round(extras.uvIndex)})
        </span>
      )}
      {aqi && <span className={`extras-badge tone-${aqi.tone}`}>Air Quality: {aqi.label}</span>}
    </div>
  )
}
