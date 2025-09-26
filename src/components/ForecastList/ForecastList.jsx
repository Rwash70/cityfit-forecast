import styles from './ForecastList.module.css';
import ForecastCard from '../ForecastCard/ForecastCard.jsx';

export default function ForecastList({ days, units }) {
  if (!days?.length) return null;

  // Top 5, then any remainder (e.g., 2 for a 7-day view)
  const top = days.slice(0, 5);
  const bottom = days.length > 5 ? days.slice(5) : [];

  return (
    <section aria-label='Forecast'>
      <div className={styles.row5}>
        {top.map((d) => (
          <ForecastCard key={d.dateStr} day={d} units={units} />
        ))}
      </div>

      {bottom.length > 0 && (
        <div className={styles.row2}>
          {bottom.map((d) => (
            <ForecastCard key={d.dateStr} day={d} units={units} />
          ))}
        </div>
      )}
    </section>
  );
}
