// src/components/ForecastCard/ForecastCard.jsx
import styles from './ForecastCard.module.css';
import { niceDate } from '../../utils/dayBuckets';
import { outfitRecommendation } from '../../utils/outfitRules';
import WeatherIcon from '../WeatherIcon/WeatherIcon.jsx';

export default function ForecastCard({ day, units = 'imperial' }) {
  const unit = units === 'metric' ? '°C' : '°F';
  const mid = (day.hi + day.lo) / 2;
  const rec = outfitRecommendation({
    temp: mid,
    units,
    condition: day.desc,
    wind: day.wind ?? 0,
  });

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
          {Math.round(day.hi)}
          {unit}
        </span>
        <span className={styles.dot}>•</span>
        <span className={styles.lo}>
          {Math.round(day.lo)}
          {unit}
        </span>
      </div>

      <p className={styles.rec}>{rec}</p>
    </article>
  );
}

function cap(s = '') {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
