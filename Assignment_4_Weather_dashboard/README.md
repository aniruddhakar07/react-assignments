# Assignment 4 — Weather Dashboard

An advanced real-time meteorological dashboard built with **React 19** and **Vite**, featuring dual-engine geocoding, multi-source environmental telemetry (OpenWeatherMap + Open-Meteo + OpenStreetMap), hand-crafted SVG weather illustrations, hourly temperature sparklines, and dynamic animated backdrops.

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [OpenWeatherMap API Key](https://openweathermap.org/api) (free tier)

### Quick Start
```bash
# 1. Navigate to the project directory
cd Assignment_4_Weather_dashboard

# 2. Install dependencies
npm install

# 3. (Optional) Configure API Key via .env file
# Create a .env file in Assignment_4_Weather_dashboard:
# VITE_OWM_API_KEY=your_openweathermap_api_key

# 4. Start the development server
npm run dev
```

Open the printed localhost URL (default **http://localhost:5173**) in your browser.

> **Note on API Keys:** If you do not create a `.env` file, the app provides a built-in **API Key Entry Panel** right in the browser that saves your key safely to `localStorage`.

### Build for Production
```bash
npm run build
npm run preview
```

---

## ✨ Features

- **Dual-Engine Autocomplete Geocoding**:
  - Simultaneously searches OpenWeatherMap Geocoding and OpenStreetMap Nominatim to resolve duplicate place names accurately.
  - Keystroke debouncing prevents API spamming and rate limits.
- **One-Click Browser Geolocation**:
  - Instant current location detection using HTML5 Geolocation API (`navigator.geolocation`).
- **Rich Environmental Telemetry**:
  - Temperature, "Feels like" temperature, Humidity, Wind Speed, and Wind Direction with a 360° rotating SVG compass arrow.
  - Free, keyless **UV Index** and **Air Quality Index (AQI)** fetched from Open-Meteo with color-coded health hazard levels.
  - One-click unit toggle between **Celsius (°C)** and **Fahrenheit (°F)**.
- **Solar Trajectory Arc & Live Countdown**:
  - Interactive SVG solar curve showing the sun's position relative to sunrise and sunset.
  - Dynamic ticking countdown (e.g., *"Sunset in 2h 14m"* or *"Sunrise in 5h 30m"*).
- **24-Hour Hourly Timeline with SVG Sparkline**:
  - Displays the next 24 hours in 3-hour slices.
  - Zero-dependency custom SVG temperature polyline showing daily temperature fluctuations.
- **5-Day Extended Weather Forecast**:
  - Daily cards showing projected conditions, high/low temperatures, and weather icons.
- **Dynamic Animated Atmosphere**:
  - Condition-reactive CSS animations: drifting clouds, twinkling night stars, rain streaks, snow drifts, and thunderstorm flashes.
- **Search History Chips**:
  - Automatically saves recent city searches to `localStorage` for instant 1-click re-checking.

---

## 📖 How to Use

### 1. Initial Setup / Entering API Key
- If prompted with the API Key banner, paste your free OpenWeatherMap API key and click **Save Key**. The key is remembered in your browser.

### 2. Searching for a Location
- Type any city, town, or region into the search bar (e.g., *"Kolkata"*, *"London"*, or *"Tokyo"*).
- Select from the dropdown suggestions populated with state and country details.

### 3. Using GPS Geolocation
- Click the **target/compass icon** inside the search bar.
- Allow browser location permissions when prompted; the app will immediately load current weather for your exact coordinates.

### 4. Switching Units (°C / °F)
- Click the **°C / °F** toggle switch in the top toolbar to switch between metric and imperial measurements.

### 5. Inspecting Weather Insights
- **Hourly Strip**: Scroll horizontally across the 24-hour timeline and inspect the custom SVG trend sparkline.
- **Sun Arc**: Look at the Sun Position module to check whether the sun is rising, peaking, or setting, along with the live countdown.
- **UV & AQI**: Review the UV exposure level and Air Quality rating badges.

### 6. Quick Access via Search History
- Click any recent location chip below the search bar to reload its weather with a single click.
- Click the `×` on any chip to remove it from history.

---

## 🛠️ Tech Stack

- **React 19**: Custom hooks (`useWeather`, `useDebouncedValue`, `useLiveClock`), modular components
- **Vite 6**: Fast build tooling and local dev server
- **APIs**: OpenWeatherMap (Current & 5-day forecast), Open-Meteo (UV & AQI), OpenStreetMap Nominatim (Geocoding)
- **CSS3 & SVGs**: Hand-crafted SVG weather icons, solar arc, sparkline curves, and condition-reactive particle backgrounds

---

## 📁 Project Structure

```
Assignment_4_Weather_dashboard/
├── src/
│   ├── api/
│   │   ├── extras.js               # Open-Meteo UV & AQI fetcher
│   │   ├── geocode.js              # OWM + Nominatim search
│   │   └── weather.js              # OpenWeatherMap data fetcher
│   ├── components/
│   │   ├── ApiKeyPanel.jsx         # Fallback API key configuration modal
│   │   ├── ConditionBadge.jsx      # Weather status badge
│   │   ├── ErrorMessage.jsx        # Dismissible error notifications
│   │   ├── ExtrasBadges.jsx        # UV & AQI rating indicators
│   │   ├── ForecastStrip.jsx       # 5-day extended forecast
│   │   ├── HourlyForecast.jsx      # 24-hour forecast strip
│   │   ├── RecentSearches.jsx      # Saved search history chips
│   │   ├── SearchBar.jsx           # Autocomplete input + geolocation button
│   │   ├── Sparkline.jsx           # SVG temperature trend curve
│   │   ├── SunArc.jsx              # Solar trajectory curve & countdown
│   │   ├── UnitToggle.jsx          # °C / °F switcher
│   │   ├── WeatherBackground.jsx   # Animated CSS weather effects
│   │   ├── WeatherIcon.jsx         # Custom SVG weather icons
│   │   └── WindDirection.jsx       # 360° rotating wind arrow
│   ├── hooks/
│   │   ├── useDebouncedValue.js    # Input debouncing hook
│   │   ├── useLiveClock.js         # Second-level ticking clock
│   │   └── useWeather.js           # Weather telemetry coordinator
│   ├── App.jsx                     # Layout tree assembly
│   ├── index.css                   # Global styles & variables
│   └── main.jsx                    # Vite React entry point
├── index.html
├── package.json
└── vite.config.js
```
