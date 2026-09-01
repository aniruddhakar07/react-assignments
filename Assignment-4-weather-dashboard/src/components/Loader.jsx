// A skeleton that mirrors the shape of the real result (hero card, stats
// grid, hourly row, forecast row) so the layout doesn't jump once data
// arrives, and it reads as "content is coming" rather than a blank pause.
export default function Loader() {
  return (
    <div className="skeleton" role="status" aria-live="polite">
      <span className="visually-hidden">Loading weather…</span>

      <div className="skeleton-card skeleton-hero">
        <div className="skeleton-line skeleton-w-40" />
        <div className="skeleton-line skeleton-w-24" />
        <div className="skeleton-pill" />
        <div className="skeleton-arc" />
      </div>

      <div className="skeleton-stats-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div className="skeleton-card skeleton-stat" key={i}>
            <div className="skeleton-line skeleton-w-16" />
            <div className="skeleton-line skeleton-w-32" />
          </div>
        ))}
      </div>

      <div className="skeleton-row">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="skeleton-card skeleton-hour" key={i} />
        ))}
      </div>

      <div className="skeleton-row skeleton-row-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div className="skeleton-card skeleton-day" key={i} />
        ))}
      </div>
    </div>
  )
}
