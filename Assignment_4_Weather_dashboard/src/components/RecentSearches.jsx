import { formatLocationLabel } from '../api/geocode'

export default function RecentSearches({ places, onSelect, onRemove }) {
  if (!places || places.length === 0) return null

  return (
    <div className="recent-searches-wrap">
      <p className="recent-searches-label">Recent</p>
      <div className="recent-searches">
        {places.map((place) => (
          <div className="recent-chip" key={formatLocationLabel(place)}>
            <button type="button" onClick={() => onSelect(place)}>
              {formatLocationLabel(place)}
            </button>
            <button
              type="button"
              className="recent-chip-remove"
              onClick={() => onRemove(place)}
              aria-label={`Remove ${formatLocationLabel(place)} from recent searches`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
