import SearchBar from './components/SearchBar.jsx'
import Loader from './components/Loader.jsx'
import ErrorMessage from './components/ErrorMessage.jsx'
import ApiKeyPanel from './components/ApiKeyPanel.jsx'
import SunArc from './components/SunArc.jsx'
import SummaryLine from './components/SummaryLine.jsx'
import WeatherStats from './components/WeatherStats.jsx'
import HourlyForecast from './components/HourlyForecast.jsx'
import ForecastStrip from './components/ForecastStrip.jsx'
import UnitToggle from './components/UnitToggle.jsx'
import WeatherBackground from './components/WeatherBackground.jsx'
import { useWeather } from './hooks/useWeather.js'
import { useLiveClock } from './hooks/useLiveClock.js'
import './App.css'

const ENV_API_KEY = import.meta.env.VITE_OWM_API_KEY || ''

export default function App() {
  const {
    apiKey,
    setApiKey,
    units,
    setUnits,
    weather,
    forecast,
    hourly,
    extras,
    loading,
    locating,
    error,
    selectLocation,
    useMyLocation,
  } = useWeather()

  // Ticks forward from the fetch time so night mode also updates live
  // (e.g. if the page is left open across sunset), not just at fetch time.
  const liveDt = useLiveClock(weather?.dt ?? 0)
  const isNight = weather ? liveDt < weather.sunrise || liveDt > weather.sunset : false

  return (
    <>
      <WeatherBackground icon={weather?.icon} isNight={isNight} />
      <div className={`app${isNight ? ' is-night' : ''}`}>
        <header className="app-header">
          <p className="eyebrow">Weather Dashboard</p>
          <h1>What's the sky doing?</h1>
          <p>Search any city, town or village for live temperature, wind, humidity and the sun's path today.</p>
        </header>

        {!ENV_API_KEY && <ApiKeyPanel apiKey={apiKey} onChange={setApiKey} />}

        <div className="toolbar">
          <SearchBar
            apiKey={apiKey}
            onSelectLocation={selectLocation}
            loading={loading}
            onUseLocation={useMyLocation}
            locating={locating}
          />
          <UnitToggle units={units} onChange={setUnits} />
        </div>

        {loading && <Loader />}

        {!loading && error && <ErrorMessage message={error} />}

        {!loading && !error && weather && (
          <div className="weather-result">
            <SunArc weather={weather} units={units} />
            <SummaryLine weather={weather} units={units} />
            <WeatherStats weather={weather} units={units} extras={extras} />
            <HourlyForecast hourly={hourly} units={units} />
            <ForecastStrip forecast={forecast} />
          </div>
        )}

        {!loading && !error && !weather && (
          <div className="empty-state">
            <div className="icon">🌤️</div>
            <p>Search for a place, or use your location, to see the current weather.</p>
          </div>
        )}
      </div>
    </>
  )
}
