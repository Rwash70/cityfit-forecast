# CityFit Forecast

A modern weather app built with **React + Vite**.  
It provides both **5-day (OpenWeather)** and **7-day (Open-Meteo)** forecasts, with friendly **outfit recommendations** to help users decide what to wear.

---

##  Features

- **Worldwide City Search**
  - Handles international cities (`Cape Town, ZA`, `São Paulo`, `Tokyo`).
  - Smart normalization for tricky names (e.g., “Capetown” → “Cape Town”).

- **Forecast Modes**
  - **5-Day Forecast** → OpenWeather 3-hour forecast grouped into days.
  - **7-Day Forecast** → Open-Meteo daily data, aligned to **next Monday → Sunday**.

- **Outfit Recommendations**
  - Suggests clothing based on average temperature, wind, and conditions.

- **Interactive UI**
  - Toggle °F / °C.
  - Toggle 5-Day / 7-Day views.
  - Light/Dark theme toggle.
  - Responsive card grid (5 cards top row, 2 below).

- **Fallbacks & Suggestions**
  - Keeps showing last good forecast if a toggle/search fails.
  - Provides suggestions when a city name is ambiguous.

- **Custom Components**
  - **WeatherIcon** → condition-based icons.
  - **ThemeToggle** → light/dark switcher.
  - **Footer** → customizable with links (e.g., GitHub, portfolio).

---

## 🛠️ Tech Stack

- **React + Vite**
- **Axios** (API requests)
- **OpenWeather API** (5-day forecast)
- **Open-Meteo API** (7-day forecast + geocoding)
- **CSS Modules** (scoped styling per component)
- **LocalStorage** (saves unit & forecast range)

---

##  Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/YourUser/cityfit-forecast.git
   cd cityfit-forecast
