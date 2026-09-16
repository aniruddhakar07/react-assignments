// A small inline SVG trend line — no chart library needed for something
// this simple. Scales the given values to fit the viewBox, with a bit
// of vertical padding so the line never touches the top/bottom edges.
export default function Sparkline({ values, width = 120, height = 32 }) {
  if (!values || values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const padding = 4

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - padding - ((v - min) / range) * (height - padding * 2)
    return [x, y]
  })

  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const [lastX, lastY] = points[points.length - 1]

  return (
    <svg className="sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Temperature trend for the coming hours">
      <path d={path} fill="none" stroke="var(--sun)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.5" fill="var(--sun)" />
    </svg>
  )
}
