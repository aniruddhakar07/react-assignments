export default function ApiKeyPanel({ apiKey, onChange }) {
  return (
    <details className="api-key-panel" open={!apiKey}>
      <summary>
        {apiKey ? 'OpenWeatherMap API key saved ✓' : 'Add your OpenWeatherMap API key to get started'}
      </summary>
      <p style={{ margin: '10px 0 0' }}>
        Get a free key from{' '}
        <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer">
          openweathermap.org/api
        </a>
        . It's saved only in this browser's local storage.
      </p>
      <div className="key-row">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste your API key"
          aria-label="OpenWeatherMap API key"
        />
      </div>
    </details>
  )
}
