import axios from 'axios';

const API = 'https://api.openweathermap.org/data/2.5/forecast';

const KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function ensureKey() {
  if (!KEY) {
    throw new Error('Missing VITE_OPENWEATHER_API_KEY in .env');
  }
}

function normUnits(units) {
  return units === 'metric' ? 'metric' : 'imperial';
}

export async function getForecastByCity(city, units = 'imperial') {
  ensureKey();
  try {
    const { data } = await axios.get(API, {
      params: {
        q: city,
        appid: KEY,
        units: normUnits(units),
      },
    });
    return data;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      'OpenWeather request failed';
    throw new Error(msg);
  }
}

export async function getForecastByCoords(lat, lon, units = 'imperial') {
  ensureKey();
  try {
    const { data } = await axios.get(API, {
      params: {
        lat,
        lon,
        appid: KEY,
        units: normUnits(units),
      },
    });
    return data;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      'OpenWeather request failed';
    throw new Error(msg);
  }
}

export {
  getDailyByCity as get7DayByCity,
  geocodeCity,
  pickLocation,
} from './openMeteo.js';
