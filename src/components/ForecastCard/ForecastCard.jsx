// src/components/ForecastCard/ForecastCard.jsx
import styles from './ForecastCard.module.css';
import { niceDate } from '../../utils/dayBuckets';
import { outfitRecommendation } from '../../utils/outfitRules';
import WeatherIcon from '../WeatherIcon/WeatherIcon.jsx';

export default function ForecastCard({ day, units }) {
  const dataUnits = day.units ?? 'units'; // 'metric' or 'imperial'

  const showUnits = units ?? dataUnits; // fallback to data units

  const hi = convertTemp(day.hi, dataUnits, showUnits);
  const lo = convertTemp(day.lo, dataUnits, showUnits);
  const mid = (hi + lo) / 2;

  const rec = outfitRecommendation({
    temp: mid,
    units: showUnits,
    condition: day.desc,
    wind: day.wind ?? 0,
  });

  const unitLabel = showUnits === 'metric' ? '°C' : '°F';

  return (
    <article
      className={styles.card}
      aria-label={`Forecast for ${niceDate(day.dateStr)}`}
    >
      <div className={styles.date}>{niceDate(day.dateStr)}</div>

      <div className={styles.iconRow}>
        <WeatherIcon desc={day.desc} />
      </div>

      <div className={styles.desc}>{cap(day.desc)}</div>

      <div className={styles.range}>
        <span className={styles.hi}>
          {Math.round(hi)}
          {unitLabel}
        </span>
        <span className={styles.dot}>•</span>
        <span className={styles.lo}>
          {Math.round(lo)}
          {unitLabel}
        </span>
      </div>

      <p className={styles.rec}>{rec}</p>
    </article>
  );
}

function convertTemp(t, from, to) {
  if (!t || from === to) return t;

  if (from === 'imperial' && to === 'imperial' && t > 100) return t;
  return to === 'imperial' ? (t * 9) / 5 + 32 : ((t - 32) * 5) / 9;
}

function cap(s = '') {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
