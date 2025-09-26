import axios from 'axios';
const API = 'https://api.openweathermap.org/data/2.5/forecast';
const KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export async function getForecastByCity(city, units = 'imperial') {
  if (!KEY) throw new Error('Missing VITE_OPENWEATHER_API_KEY');
  const { data } = await axios.get(API, {
    params: { q: city, appid: KEY, units },
  });
  return data;
}
