export default function UnitToggle({ units, onChange }) {
  return (
    <div className="unit-toggle" role="group" aria-label="Temperature units">
      <button
        type="button"
        className={units === 'metric' ? 'active' : ''}
        onClick={() => onChange('metric')}
      >
        °C
      </button>
      <button
        type="button"
        className={units === 'imperial' ? 'active' : ''}
        onClick={() => onChange('imperial')}
      >
        °F
      </button>
    </div>
  )
}
