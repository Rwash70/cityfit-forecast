import styles from './ForecastList.module.css';
import ForecastCard from '../ForecastCard/ForecastCard.jsx';
export default function ForecastList({ days, units }) {
  if (!days?.length) return null;
  return (
    <section className={styles.grid} aria-label='Five day forecast'>
      {days.map((d) => (
        <ForecastCard key={d.dateStr} day={d} units={units} />
      ))}
    </section>
  );
}
