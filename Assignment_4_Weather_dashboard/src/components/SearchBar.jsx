import { useEffect, useRef, useState } from 'react'
import { searchLocations, formatLocationLabel } from '../api/geocode'
import { useDebouncedValue } from '../hooks/useDebouncedValue'

export default function SearchBar({ apiKey, onSelectLocation, loading, onUseLocation, locating }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const [searching, setSearching] = useState(false)
  const containerRef = useRef(null)

  const debouncedQuery = useDebouncedValue(query, 300)

  // Fetch suggestions whenever the debounced query changes
  useEffect(() => {
    let cancelled = false

    async function run() {
      const trimmed = debouncedQuery.trim()
      if (trimmed.length < 2 || !apiKey) {
        setSuggestions([])
        return
      }
      setSearching(true)
      try {
        const results = await searchLocations(trimmed, apiKey)
        if (!cancelled) {
          setSuggestions(results)
          setIsOpen(results.length > 0)
          setHighlightIndex(-1)
        }
      } catch {
        // Suggestion failures stay silent here; the real search
        // (on submit) will surface a proper error if needed.
        if (!cancelled) setSuggestions([])
      } finally {
        if (!cancelled) setSearching(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [debouncedQuery, apiKey])

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectPlace(place) {
    setQuery(formatLocationLabel(place))
    setSuggestions([])
    setIsOpen(false)
    setHighlightIndex(-1)
    onSelectLocation(place)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    // If a suggestion is highlighted, use it
    if (highlightIndex >= 0 && suggestions[highlightIndex]) {
      selectPlace(suggestions[highlightIndex])
      return
    }
    // If there are suggestions but none highlighted, use the first
    if (suggestions.length > 0) {
      selectPlace(suggestions[0])
      return
    }
    // Otherwise, look it up fresh (e.g. user hit Enter before the debounce fired)
    try {
      const results = await searchLocations(trimmed, apiKey, 1)
      if (results.length > 0) {
        selectPlace(results[0])
      } else {
        onSelectLocation(null, `Couldn't find "${trimmed}". Check the spelling and try again.`)
      }
    } catch (err) {
      onSelectLocation(null, err.message)
    }
  }

  function handleKeyDown(e) {
    if (!isOpen || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="search-bar-wrap" ref={containerRef}>
      <form className="search-bar" onSubmit={handleSubmit} autoComplete="off">
        <div className="search-input-wrap">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search any city, town or village…"
            aria-label="Location search"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            role="combobox"
          />
          {searching && <span className="search-spinner" aria-hidden="true" />}

          {isOpen && suggestions.length > 0 && (
            <ul className="suggestions" role="listbox">
              {suggestions.map((place, i) => (
                <li
                  key={place.key}
                  role="option"
                  aria-selected={i === highlightIndex}
                  className={i === highlightIndex ? 'active' : ''}
                  onMouseDown={() => selectPlace(place)}
                  onMouseEnter={() => setHighlightIndex(i)}
                >
                  {formatLocationLabel(place)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching…' : 'Search'}
        </button>

        {onUseLocation && (
          <button
            type="button"
            className="location-btn"
            onClick={onUseLocation}
            disabled={locating}
            title="Use my current location"
            aria-label="Use my current location"
          >
            {locating ? '…' : '📍'}
          </button>
        )}
      </form>
    </div>
  )
}
