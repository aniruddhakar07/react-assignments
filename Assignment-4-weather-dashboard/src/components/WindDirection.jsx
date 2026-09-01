const COMPASS_POINTS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

function compassLabel(deg) {
  const index = Math.round(deg / 45) % 8
  return COMPASS_POINTS[index]
}

export default function WindDirection({ deg }) {
  if (deg == null) return null

  return (
    <span className="wind-direction" title={`Wind from ${compassLabel(deg)}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" style={{ transform: `rotate(${deg}deg)` }}>
        <path d="M12 2 L18 14 L12 10.5 L6 14 Z" fill="var(--cyan)" />
      </svg>
      <span className="wind-direction-label">{compassLabel(deg)}</span>
    </span>
  )
}
