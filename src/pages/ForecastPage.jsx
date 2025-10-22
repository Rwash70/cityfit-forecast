import React, { useEffect, useState, Suspense, useRef } from 'react';
import styles from './ForecastPage.module.css';

import SearchBar from '../components/SearchBar/SearchBar.jsx';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle.jsx';
import Footer from '../components/Footer/Footer.jsx';

import { getForecastByCity, getForecastByCoords } from '../utils/weatherApi.js';
import { toDaily } from '../utils/dayBuckets.js';
import { getDailyByCity, pickLocation } from '../utils/openMeteo.js';

const ForecastList = React.lazy(() =>
  import('../components/ForecastList/ForecastList.jsx')
);

function weekLabel(days) {
  if (!days?.length) return '7-Day Outlook';
  const dt = new Date(days[0].dateStr);
  const fmt = dt.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
  return `Week of ${fmt}`;
}

export default function ForecastPage() {
  const [units, setUnits] = useState(
    () => localStorage.getItem('units') || 'imperial'
  );
  useEffect(() => {
    localStorage.setItem('units', units);
  }, [units]);

  const [range, setRange] = useState(
    () => localStorage.getItem('range') || '5'
  );
  useEffect(() => {
    localStorage.setItem('range', range);
  }, [range]);

  const [city, setCity] = useState('Atlanta');
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const lastPickRef = useRef(null);

  async function load(cityInput) {
    setLoading(true);
    setError('');
    setNotice('');
    setSuggestions([]);

    try {
      if (range === '7') {
        const pick = await pickLocation(cityInput);
        if (pick.best) {
          const label = [pick.best.name, pick.best.admin1, pick.best.country]
            .filter(Boolean)
            .join(', ');
          const data = await getDailyByCity(cityInput, units);
          lastPickRef.current = {
            lat: pick.best.latitude,
            lon: pick.best.longitude,
            label,
          };
          setCity(data.city.name);
          setDays(data.days);
          setSuggestions(data.suggestions || []);
          setError('');
          setNotice('');
          return;
        }

        if (lastPickRef.current) {
          const prox = lastPickRef.current;
          const data = await getDailyByCity(prox.label, units);
          setCity(data.city.name);
          setDays(data.days);
          setNotice('Showing your last location.');
          setError('');
          return;
        }

        try {
          const five = await getForecastByCity(cityInput, units);
          const label = `${five.city.name}, ${five.city.country}`;
          setCity(label);
          setDays(toDaily(five.list, units));
          setNotice(
            '7-day not available for that query. Showing 5-day instead.'
          );
          setError('');
          return;
        } catch {}

        setError(
          'City not found. Try a more specific name (e.g., "Cape Town, ZA").'
        );
        return;
      }

      const pick = await pickLocation(cityInput);
      if (pick.best) {
        const label = [pick.best.name, pick.best.admin1, pick.best.country]
          .filter(Boolean)
          .join(', ');
        const five = await getForecastByCoords(
          pick.best.latitude,
          pick.best.longitude,
          units
        );
        lastPickRef.current = {
          lat: pick.best.latitude,
          lon: pick.best.longitude,
          label,
        };
        setCity(label);
        setDays(toDaily(five.list, units));
        setSuggestions(pick.suggestions || []);
        setError('');
        setNotice('');
        return;
      }

      try {
        const five = await getForecastByCity(cityInput, units);
        const label = `${five.city.name}, ${five.city.country}`;
        setCity(label);
        setDays(toDaily(five.list, units));
        setNotice('Showing name-based forecast.');
        setError('');
        return;
      } catch {
        /* fall through */
      }

      // Final: fatal
      const picks = await pickLocation(cityInput).catch(() => ({
        suggestions: [],
      }));
      setSuggestions(picks?.suggestions || []);
      setError('City not found. Try one of the suggestions below.');
    } catch (e) {
      setError(e?.message || 'Failed to load forecast');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(city);
  }, [units, range]);

  return (
    <div className={styles.page}>
      <main className={styles.wrap}>
        <div className={styles.hero}>
          <header className={styles.header}>
            <h1 className={styles.title}>CityFit Forecast</h1>

            <div className={styles.controls}>
              <SearchBar initial='Atlanta' onSearch={load} />

              <button
                className={styles.unit}
                onClick={() =>
                  setUnits((u) => (u === 'imperial' ? 'metric' : 'imperial'))
                }
                aria-label='Toggle temperature units'
                title='Toggle °F/°C'
              >
                {units === 'imperial' ? '°F' : '°C'}
              </button>

              <button
                className={styles.unit}
                onClick={() => setRange((r) => (r === '5' ? '7' : '5'))}
                aria-label='Toggle forecast range'
                title='Toggle 5-Day / 7-Day'
              >
                {range === '7' ? '7D' : '5D'}
              </button>

              <ThemeToggle className={styles.unit} />
            </div>

            <div className={styles.subtitle}>{city}</div>

            {notice && <p className={styles.status}>{notice}</p>}
          </header>
        </div>

        {loading && <p className={styles.status}>Loading…</p>}

        {error && days.length === 0 && (
          <section>
            <p className={styles.error} role='alert'>
              {error}
            </p>
            {suggestions.length > 0 && (
              <div className={styles.controls} aria-label='Suggestions'>
                {suggestions.map((s) => (
                  <button
                    key={`${s.label}-${s.lat}-${s.lon}`}
                    className={styles.unit}
                    onClick={() => load(s.label)}
                    title={`Use ${s.label}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {!loading && days.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>
              {range === '7' ? weekLabel(days) : '5-Day Outlook'}
            </h2>
            <Suspense
              fallback={<p className={styles.status}>Loading forecast…</p>}
            >
              <ForecastList days={days} units={units} />
            </Suspense>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
