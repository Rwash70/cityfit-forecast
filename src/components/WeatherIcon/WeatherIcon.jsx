// src/components/WeatherIcon/WeatherIcon.jsx
import styles from './WeatherIcon.module.css';

function kindFromDesc(desc = '') {
  const s = String(desc).toLowerCase();
  if (/(thunder|storm)/.test(s)) return 'thunder';
  if (/(snow|sleet|blizzard)/.test(s)) return 'snow';
  if (/(rain|drizzle|shower)/.test(s)) return 'rain';
  if (/(cloud|overcast)/.test(s)) return 'clouds';
  if (/(clear|sun)/.test(s)) return 'sun';
  return 'clouds';
}

export default function WeatherIcon({ desc }) {
  const k = kindFromDesc(desc);

  if (k === 'sun') {
    return (
      <div className={styles.sun} role='img' aria-label='Sunny'>
        <div className={styles.sunCore} />
        <div className={styles.rays} />
      </div>
    );
  }

  if (k === 'rain') {
    return (
      <div className={styles.rain} role='img' aria-label='Rain'>
        <div className={`${styles.clouds}`}>
          <div className={`${styles.cloud} ${styles.cloudBack}`}></div>
          <div className={styles.cloud}></div>
        </div>
        <div className={styles.drops}>
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (k === 'snow') {
    return (
      <div className={styles.snow} role='img' aria-label='Snow'>
        <div className={`${styles.clouds}`}>
          <div className={`${styles.cloud} ${styles.cloudBack}`}></div>
          <div className={styles.cloud}></div>
        </div>
        <div className={styles.flakes}>
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>
      </div>
    );
  }

  if (k === 'thunder') {
    return (
      <div className={styles.thunder} role='img' aria-label='Thunderstorm'>
        <div className={`${styles.clouds}`}>
          <div className={`${styles.cloud} ${styles.cloudBack}`}></div>
          <div className={styles.cloud}></div>
        </div>
        <div className={styles.bolt}></div>
      </div>
    );
  }

  // default: clouds
  return (
    <div className={styles.clouds} role='img' aria-label='Clouds'>
      <div className={`${styles.cloud} ${styles.cloudBack}`}></div>
      <div className={styles.cloud}></div>
    </div>
  );
}
