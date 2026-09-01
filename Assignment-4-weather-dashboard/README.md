# Weather Dashboard (Assignment 4)

A React weather dashboard built with Vite, using the OpenWeatherMap API.

## Features
- Live autocomplete: suggestions appear as you type (debounced), merging
  OpenWeatherMap's Geocoding API and OpenStreetMap's Nominatim so small
  villages and big cities both resolve — and places that share a name
  across countries show up as distinct, pickable options
- "Use my location" button (browser geolocation)
- °C / °F unit toggle — re-fetches automatically in the new units
- Temperature, feels-like, humidity, wind speed + direction (compass arrow)
- Custom-drawn SVG weather icons (rain, thunderstorm, snow, mist, clear,
  cloudy) matching the app's own visual style, with no dependency on an
  external icon image loading correctly
- Condition badge (color-coded pill: amber for clear, cyan for rain,
  purple for storms, etc.)
- A short plain-language summary line ("Great day to be outside.",
  "Rain's falling — grab an umbrella.") generated client-side from the
  fetched data
- UV Index and Air Quality shown as part of the same stats grid as
  Humidity and Wind Speed, via Open-Meteo's free, keyless APIs
  (OpenWeatherMap moved these behind a paid tier)
- Animated background matching current conditions — twinkling stars at
  clear night, a pulsing glow on clear days, drifting clouds, falling
  rain/snow, an occasional lightning flash during storms, or slow mist bands
- Sunrise & sunset times, visualized on an animated sun-position arc that
  dims into a night palette after sunset, with a live-ticking clock and
  a "Sunset in 2h 14m" style countdown
- Hourly forecast strip: a scrollable near-term view (next ~24 hours in
  OWM's free 3-hour steps) between the hero card and the 5-day forecast
- 5-day forecast strip (high/low, icon, weekday + actual date per day)
- Layout-matching loading skeleton (shimmering placeholder cards) while
  a request is in flight, instead of a plain spinner
- Error handling for unresolved locations, bad API keys, and network failures
- Remembers your API key, unit preference, and last-searched location in
  `localStorage`

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Get a free API key from [openweathermap.org/api](https://openweathermap.org/api)
   (the "Current Weather Data" plan is free and instant).
3. Open the `.env` file in the project root and replace the placeholder
   with your key:
   ```
   VITE_OWM_API_KEY=your_actual_key_here
   ```
4. Run the app:
   ```bash
   npm run dev
   ```
   The key loads automatically from `.env` every time — no need to paste
   it into the browser. `.env` is listed in `.gitignore`, so it won't get
   committed if you push this to GitHub.

   (If you ever run the app without a `.env` key set, it falls back to
   the on-screen key field from before, so it still works either way.)

## Project structure
```
src/
  App.jsx                     // layout only — state lives in useWeather
  api/
    geocode.js                  // merged OWM + Nominatim place search
    weather.js                   // current/hourly/daily fetch + shaping
    extras.js                     // UV index + air quality (Open-Meteo)
  hooks/
    useWeather.js                 // owns weather/forecast/units/error state
    useLiveClock.js                // ticks a live clock from a fetch timestamp
    useDebouncedValue.js            // debounces the search input
  utils/
    geolocation.js                  // Promise wrapper around navigator.geolocation
    weatherIcons.js                  // unit symbols + time formatting
    conditionGroup.js                 // OWM icon code -> broad condition group
    summary.js                         // plain-language summary generator
  components/
    SearchBar.jsx                       // autocomplete search + "use my location"
    ApiKeyPanel.jsx                      // API key entry
    UnitToggle.jsx                        // °C / °F switch
    Loader.jsx                             // loading skeleton
    ErrorMessage.jsx                        // error display
    WeatherIcon.jsx                          // hand-drawn SVG icon set
    ConditionBadge.jsx                        // color-coded condition pill
    SummaryLine.jsx                             // plain-language one-liner
    WindDirection.jsx                              // compass arrow
    WeatherBackground.jsx                           // animated background
    SunArc.jsx                                       // hero: temp, sun arc, countdown
    WeatherStats.jsx                                  // humidity / wind / UV / air quality
    HourlyForecast.jsx                                 // near-term forecast row
    ForecastStrip.jsx                                   // 5-day forecast cards
```

## How the search works
Typing 2+ characters queries **both** OpenWeatherMap's Geocoding API
(`/geo/1.0/direct`) and **OpenStreetMap's Nominatim API** at the same
time, and merges the results into one dropdown. This matters because a
place name can exist in multiple countries — e.g. there's a Muktarpur
in Bangladesh *and* a different Muktarpur in Hooghly, India — so both
show up as distinct options instead of the app silently picking one for
you. Selecting a suggestion (or pressing Enter, or tapping the location
button) fetches weather for those exact coordinates.

The header always displays the place name **you selected**, not
whatever name OpenWeatherMap's own reverse-geocoding assigns to those
coordinates — for small places, OWM sometimes labels a spot with a
larger neighboring town.

## Notes
- New OpenWeatherMap keys can take up to a couple of hours to activate;
  if you get a 401 error right after signing up, wait and try again.
- The forecast endpoints (hourly + 5-day) use OWM's free `/forecast`
  data, which comes in 3-hour steps — the hourly strip shows the next
  8 of those steps, and the daily strip picks the entry closest to
  midday for each day.
- UV Index and Air Quality come from Open-Meteo rather than OWM, since
  OWM requires a paid subscription for those. If Open-Meteo is
  unreachable, those badges just don't show — everything else still works.
