import { conditionGroup } from '../utils/conditionGroup'

// Deterministic pseudo-random-looking placement from an index, so the
// layout is stable across re-renders (the app re-renders every second
// for the live clock) without needing Math.random or memoization.
function spread(i, mod, scale = 1, offset = 0) {
  return ((i * mod) % 100) * scale + offset
}

function Stars({ count = 26 }) {
  return (
    <div className="wx-layer wx-stars">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="wx-star"
          style={{
            left: `${spread(i, 37)}%`,
            top: `${spread(i, 53)}%`,
            animationDelay: `${(i % 6) * 0.5}s`,
            animationDuration: `${2.5 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  )
}

function SunGlow() {
  return (
    <div className="wx-layer">
      <div className="wx-sun-glow" />
    </div>
  )
}

function Clouds({ count = 4 }) {
  return (
    <div className="wx-layer wx-clouds">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="wx-cloud-shape"
          style={{
            top: `${8 + spread(i, 17, 0.5)}%`,
            animationDelay: `${i * 4.5}s`,
            animationDuration: `${28 + i * 6}s`,
            opacity: 0.5 - i * 0.08,
            transform: `scale(${1 + i * 0.25})`,
          }}
        />
      ))}
    </div>
  )
}

function Rain({ count = 34, heavy = false }) {
  return (
    <div className="wx-layer wx-rain">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`wx-raindrop${heavy ? ' heavy' : ''}`}
          style={{
            left: `${spread(i, 13)}%`,
            animationDelay: `${(i % 10) * 0.15}s`,
            animationDuration: `${heavy ? 0.5 : 0.8}s`,
          }}
        />
      ))}
    </div>
  )
}

function Flash() {
  return (
    <div className="wx-layer">
      <div className="wx-flash" />
    </div>
  )
}

function Snow({ count = 26 }) {
  return (
    <div className="wx-layer wx-snow">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="wx-snowflake"
          style={{
            left: `${spread(i, 19)}%`,
            animationDelay: `${(i % 8) * 0.8}s`,
            animationDuration: `${8 + (i % 5) * 2}s`,
            width: `${3 + (i % 3)}px`,
            height: `${3 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  )
}

function Mist() {
  return (
    <div className="wx-layer wx-mist">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="wx-mist-band"
          style={{ top: `${20 + i * 25}%`, animationDelay: `${i * 3}s`, animationDuration: `${18 + i * 4}s` }}
        />
      ))}
    </div>
  )
}

export default function WeatherBackground({ icon, isNight }) {
  const group = conditionGroup(icon)

  return (
    <div className="wx-background" aria-hidden="true">
      {group === 'clear' && !isNight && <SunGlow />}
      {group === 'clear' && isNight && <Stars />}
      {group === 'clouds' && <Clouds />}
      {group === 'rain' && <Rain />}
      {group === 'storm' && (
        <>
          <Rain count={40} heavy />
          <Flash />
        </>
      )}
      {group === 'snow' && <Snow />}
      {group === 'mist' && <Mist />}
    </div>
  )
}
