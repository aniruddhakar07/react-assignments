// Custom, hand-drawn weather glyphs in the app's own visual language —
// no dependency on an external image loading correctly, and each
// condition gets a shape that's unambiguous at a glance (rain clearly
// shows falling drops, a storm clearly shows a bolt, etc.), rather than
// relying on OpenWeatherMap's icon images or a single emoji per code.

const CLOUD = 'M13 33c-4.4 0-8-3.6-8-8 0-4 3-7.3 6.8-7.9C13 12.6 17.4 9.5 22.5 9.5c6 0 10.9 4.4 11.7 10.1 4.4.5 7.8 4.3 7.8 8.9 0 4.7-3.8 8.5-8.5 8.5H13z'

function Sun({ cx = 24, cy = 18, r = 7, color = 'var(--sun)' }) {
  const rays = []
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4
    const x1 = cx + Math.cos(angle) * (r + 3)
    const y1 = cy + Math.sin(angle) * (r + 3)
    const x2 = cx + Math.cos(angle) * (r + 7)
    const y2 = cy + Math.sin(angle) * (r + 7)
    rays.push(<line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="2" strokeLinecap="round" />)
  }
  return (
    <g>
      {rays}
      <circle cx={cx} cy={cy} r={r} fill={color} />
    </g>
  )
}

function Moon({ cx = 24, cy = 18, r = 7, color = 'var(--cyan)' }) {
  return (
    <path
      d={`M${cx + r} ${cy - r}
          a${r} ${r} 0 1 0 0 ${r * 2}
          a${r * 0.72} ${r * 0.72} 0 0 1 0 -${r * 2}z`}
      fill={color}
    />
  )
}

function Cloud({ fill = 'var(--text-primary)', opacity = 0.9, translateY = 6 }) {
  return <path d={CLOUD} fill={fill} opacity={opacity} transform={`translate(0, ${translateY})`} />
}

function RainDrops({ y = 36, color = 'var(--cyan)', count = 3, heavy = false }) {
  const xs = count === 3 ? [15, 24, 33] : [15, 33]
  return (
    <g>
      {xs.map((x, i) => (
        <line
          key={i}
          x1={x}
          y1={y}
          x2={x - 3}
          y2={y + (heavy ? 9 : 6)}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ))}
    </g>
  )
}

function Bolt() {
  return <path d="M25 33l-7 9h5l-3 7 9-10h-5l3-6z" fill="var(--sun)" />
}

function SnowFlakes({ y = 37 }) {
  const xs = [16, 24, 32]
  return (
    <g>
      {xs.map((x, i) => (
        <g key={i} stroke="var(--cyan)" strokeWidth="2" strokeLinecap="round">
          <line x1={x} y1={y - 3} x2={x} y2={y + 3} />
          <line x1={x - 2.6} y1={y - 1.5} x2={x + 2.6} y2={y + 1.5} />
          <line x1={x - 2.6} y1={y + 1.5} x2={x + 2.6} y2={y - 1.5} />
        </g>
      ))}
    </g>
  )
}

function Mist() {
  const ys = [16, 24, 32, 40]
  return (
    <g stroke="var(--text-secondary)" strokeWidth="2.5" strokeLinecap="round">
      {ys.map((y, i) => (
        <line key={i} x1={i % 2 === 0 ? 8 : 12} y1={y} x2={i % 2 === 0 ? 40 : 36} y2={y} />
      ))}
    </g>
  )
}

function glyphFor(code) {
  const group = (code || '').slice(0, 2)
  const isDay = !code || code.endsWith('d')

  switch (group) {
    case '01': // clear sky
      return isDay ? <Sun cx={24} cy={24} r={10} /> : <Moon cx={24} cy={24} r={10} />

    case '02': // few clouds
      return (
        <>
          {isDay ? <Sun cx={17} cy={14} r={6} /> : <Moon cx={17} cy={14} r={6} />}
          <Cloud translateY={10} />
        </>
      )

    case '03': // scattered clouds
      return <Cloud translateY={8} opacity={0.95} />

    case '04': // broken / overcast clouds
      return (
        <>
          <path d={CLOUD} fill="var(--text-secondary)" opacity="0.6" transform="translate(6, 2) scale(0.85)" />
          <Cloud translateY={9} />
        </>
      )

    case '09': // shower rain
      return (
        <>
          <Cloud translateY={2} />
          <RainDrops y={30} count={3} />
        </>
      )

    case '10': // rain
      return (
        <>
          {isDay ? <Sun cx={15} cy={10} r={5} /> : null}
          <Cloud translateY={4} />
          <RainDrops y={32} count={3} heavy />
        </>
      )

    case '11': // thunderstorm
      return (
        <>
          <Cloud translateY={0} />
          <Bolt />
        </>
      )

    case '13': // snow
      return (
        <>
          <Cloud translateY={2} />
          <SnowFlakes y={35} />
        </>
      )

    case '50': // mist
      return <Mist />

    default:
      return <Sun cx={24} cy={24} r={10} />
  }
}

export default function WeatherIcon({ code, size = 48, alt }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label={alt || 'Weather icon'}
      style={{ display: 'block', flexShrink: 0 }}
    >
      {glyphFor(code)}
    </svg>
  )
}
