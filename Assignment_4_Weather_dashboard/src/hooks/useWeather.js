import { useCallback, useEffect, useRef, useState } from 'react'
import {
  fetchCurrentWeather,
  fetchForecast,
  shapeCurrentWeather,
  shapeForecast,
  shapeHourlyForecast,
} from '../api/weather'
import { fetchExtras } from '../api/extras'
import { getCurrentPosition } from '../utils/geolocation'

const API_KEY_STORAGE = 'owm_api_key'
const LAST_LOCATION_STORAGE = 'owm_last_location'
const UNITS_STORAGE = 'owm_units'

const ENV_API_KEY = import.meta.env.VITE_OWM_API_KEY || ''

export function useWeather() {
  const [apiKey, setApiKey] = useState(
    () => ENV_API_KEY || localStorage.getItem(API_KEY_STORAGE) || ''
  )
  const [units, setUnits] = useState(() => localStorage.getItem(UNITS_STORAGE) || 'metric')
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState([])
  const [hourly, setHourly] = useState([])
  const [extras, setExtras] = useState(null)
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    localStorage.setItem(API_KEY_STORAGE, apiKey)
  }, [apiKey])

  useEffect(() => {
    localStorage.setItem(UNITS_STORAGE, units)
  }, [units])

  const fetchForPlace = useCallback(
    async (place) => {
      if (!apiKey) {
        setError('Add your OpenWeatherMap API key above first.')
        return
      }

      setLoading(true)
      setError(null)

      try {
        const [currentRaw, forecastRaw] = await Promise.all([
          fetchCurrentWeather({ lat: place.lat, lon: place.lon, apiKey, units }),
          fetchForecast({ lat: place.lat, lon: place.lon, apiKey, units }),
        ])

        setWeather(shapeCurrentWeather(currentRaw, place))
        setForecast(shapeForecast(forecastRaw))
        setHourly(shapeHourlyForecast(forecastRaw))
        localStorage.setItem(LAST_LOCATION_STORAGE, JSON.stringify(place))

        // Best-effort extras (UV index, air quality) from a separate,
        // keyless service — never lets a failure here affect the main
        // weather display, which has already succeeded by this point.
        fetchExtras(place.lat, place.lon)
          .then(setExtras)
          .catch(() => setExtras(null))
      } catch (err) {
        setError(err.message || 'Something went wrong while fetching the weather.')
        setWeather(null)
        setForecast([])
        setHourly([])
        setExtras(null)
      } finally {
        setLoading(false)
      }
    },
    [apiKey, units]
  )

  // Called by SearchBar: either a resolved place, or (null, errorMessage)
  // when the typed text couldn't be resolved to any location at all.
  const selectLocation = useCallback(
    (place, errorMessage) => {
      if (place) {
        fetchForPlace(place)
      } else {
        setWeather(null)
        setForecast([])
        setHourly([])
        setExtras(null)
        setError(errorMessage || "Couldn't find that location. Check the spelling and try again.")
      }
    },
    [fetchForPlace]
  )

  const useMyLocation = useCallback(async () => {
    setLocating(true)
    setError(null)
    try {
      const coords = await getCurrentPosition()
      await fetchForPlace({ ...coords, name: 'Your location', state: '', country: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLocating(false)
    }
  }, [fetchForPlace])

  // Re-fetch in the newly chosen units without requiring a new search
  // (skips the initial mount — that's handled by the effect below)
  const isFirstUnitsRender = useRef(true)
  useEffect(() => {
    if (isFirstUnitsRender.current) {
      isFirstUnitsRender.current = false
      return
    }
    const raw = localStorage.getItem(LAST_LOCATION_STORAGE)
    if (raw && apiKey) {
      try {
        fetchForPlace(JSON.parse(raw))
      } catch {
        // ignore malformed cache
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units])

  // Load the last-searched location once, on first mount
  useEffect(() => {
    const raw = localStorage.getItem(LAST_LOCATION_STORAGE)
    if (raw && apiKey) {
      try {
        fetchForPlace(JSON.parse(raw))
      } catch {
        // ignore malformed cache
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
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
  }
}
