const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const METEO_URL = 'https://api.open-meteo.com/v1/forecast';

/* ------------------------- condition mapping ------------------------- */
function wmoToDesc(code) {
  const c = Number(code);
  if (c === 0) return 'clear sky';
  if ([1, 2, 3].includes(c)) return 'few clouds';
  if ([45, 48].includes(c)) return 'fog';
  if ([51, 53, 55, 56, 57].includes(c)) return 'drizzle';
  if ([61, 63, 65].includes(c)) return 'rain';
  if ([66, 67].includes(c)) return 'freezing rain';
  if ([71, 73, 75, 77].includes(c)) return 'snow';
  if ([80, 81, 82].includes(c)) return 'rain showers';
  if ([85, 86].includes(c)) return 'snow showers';
  if ([95, 96, 99].includes(c)) return 'thunderstorm';
  return 'clouds';
}

/* ---------------------------- geocoding ------------------------------ */
function normalizeQuery(raw = '') {
  let s = String(raw).trim().toLowerCase();
  s = s.replace(/\s+/g, ' ');

  s = s.replace(/\bcapetown\b/g, 'cape town');
  s = s.replace(/\bsouth african\b/g, 'south africa');
  s = s.replace(/\bu\.?s\.?a\.?\b/g, 'united states');
  s = s.replace(/\buk\b/g, 'united kingdom');

  s = s.replace(/\s*,\s*/g, ', ');
  return s;
}

export async function geocodeCity(city) {
  const q = normalizeQuery(city);
  const url = `${GEO_URL}?name=${encodeURIComponent(q)}&count=5&language=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocoding failed');
  const data = await res.json();
  const results = Array.isArray(data?.results) ? data.results : [];

  return results;
}

export async function pickLocation(city) {
  const results = await geocodeCity(city);
  if (results.length === 0) return { best: null, suggestions: [] };
  const best = results[0];
  const suggestions = results.map((r) => ({
    label: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
    lat: r.latitude,
    lon: r.longitude,
  }));
  return { best, suggestions };
}

/* ------------------------- week alignment --------------------------- */
function toDate(d) {
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, m - 1, day);
}
function nextMonday(from = new Date()) {
  const day = from.getDay();
  const delta = (8 - day) % 7 || 7;
  const dt = new Date(from);
  dt.setDate(dt.getDate() + delta);
  dt.setHours(0, 0, 0, 0);
  return dt;
}
function alignToNextMonday(days) {
  if (!Array.isArray(days) || !days.length) return [];
  const start = nextMonday();
  let idx = days.findIndex(
    (d) => toDate(d.dateStr).getTime() >= start.getTime()
  );
  if (idx < 0) idx = 0;
  const span = days.slice(idx, idx + 7);
  if (span.length < 7) return span.concat(days.slice(0, 7 - span.length));
  return span;
}

/* --------------------------- fetch helpers --------------------------- */
function buildParams(lat, lon, units) {
  const temperature_unit = units === 'imperial' ? 'fahrenheit' : 'celsius';
  const windspeed_unit = units === 'imperial' ? 'mph' : 'kmh';
  return new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: [
      'weathercode',
      'temperature_2m_max',
      'temperature_2m_min',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    temperature_unit,
    windspeed_unit,
  });
}

function mapDaily(j) {
  const d = j?.daily || {};
  return (d.time || []).map((t, i) => ({
    dateStr: t,
    hi: d.temperature_2m_max?.[i],
    lo: d.temperature_2m_min?.[i],
    wind: d.wind_speed_10m_max?.[i],
    desc: wmoToDesc(d.weathercode?.[i]),
  }));
}

/* ----------------------------- 7-day APIs --------------------------- */

export async function getDailyByCity(city, units = 'imperial') {
  const picked = await pickLocation(city);
  if (!picked.best) {
    const err = new Error('City not found');
    err.code = 'NO_MATCH';
    err.suggestions = [];
    throw err;
  }

  const { latitude, longitude, name, country, admin1 } = picked.best;
  const params = buildParams(latitude, longitude, units);

  const res = await fetch(`${METEO_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Forecast fetch failed');
  const met = await res.json();

  const raw = mapDaily(met);
  return {
    city: { name: [name, admin1, country].filter(Boolean).join(', ') },
    days: alignToNextMonday(raw),
    suggestions: picked.suggestions,
  };
}

export async function getDailyByCoords(
  lat,
  lon,
  units = 'imperial',
  label = ''
) {
  const params = buildParams(lat, lon, units);
  const res = await fetch(`${METEO_URL}?${params.toString()}`);
  if (!res.ok) throw new Error('Forecast fetch failed');
  const met = await res.json();

  const raw = mapDaily(met);
  return {
    city: { name: label || `${lat.toFixed(2)}, ${lon.toFixed(2)}` },
    days: alignToNextMonday(raw),
  };
}

export { wmoToDesc };
