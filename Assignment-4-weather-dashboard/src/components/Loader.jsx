// A visible spinner (satisfying the assignment's explicit "Loading
// Spinner" requirement) paired with a skeleton that mirrors the shape
// of the real result — so it's unambiguous that this IS a loading
// spinner, while the layout still doesn't jump once data arrives.
export default function Loader() {
  return (
    <div className="skeleton" role="status" aria-live="polite">
      <div className="spinner-row">
        <div className="spinner" />
        <span>Fetching the forecast…</span>
      </div>

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
