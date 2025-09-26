import styles from './WeatherIcon.module.css';

/**
 * Auto-detect icon "kind" from a description string like:
 * "light rain", "few clouds", "snow", "thunderstorm", "clear sky"
 */
function detectKind(desc = '') {
  const d = String(desc).toLowerCase();
  if (/(thunder|storm)/.test(d)) return 'thunder';
  if (/(snow|sleet|flurr)/.test(d)) return 'snow';
  if (/(rain|drizzle|shower)/.test(d)) return 'rain';
  if (/(clear|sun)/.test(d)) return 'sun';
  if (/(cloud|overcast|mist|fog)/.test(d)) return 'clouds';
  return 'clouds';
}

/**
 * Props:
 * - desc: string (weather description; we auto-map to an icon)
 * - size: number (px) optional, defaults to 64
 */
export default function WeatherIcon({ desc, size = 64 }) {
  const kind = detectKind(desc);

  if (kind === 'sun') {
    return (
      <div
        className={`${styles.icon} ${styles.sun}`}
        style={{ width: size, height: size }}
      >
        <div className={styles.sunCore} />
        <div className={styles.rays} />
      </div>
    );
  }

  if (kind === 'clouds') {
    return (
      <div
        className={`${styles.icon} ${styles.clouds}`}
        style={{ width: size, height: size }}
      >
        <div className={styles.cloud} />
        <div className={`${styles.cloud} ${styles.cloudBack}`} />
      </div>
    );
  }

  if (kind === 'rain') {
    return (
      <div
        className={`${styles.icon} ${styles.rain}`}
        style={{ width: size, height: size }}
      >
        <div className={styles.cloud} />
        <div className={styles.drops}>
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  if (kind === 'snow') {
    return (
      <div
        className={`${styles.icon} ${styles.snow}`}
        style={{ width: size, height: size }}
      >
        <div className={styles.cloud} />
        <div className={styles.flakes}>
          <span>✻</span>
          <span>✻</span>
          <span>✻</span>
        </div>
      </div>
    );
  }

  // thunder (lightning)
  return (
    <div
      className={`${styles.icon} ${styles.thunder}`}
      style={{ width: size, height: size }}
    >
      <div className={styles.cloud} />
      <div className={styles.bolt} />
    </div>
  );
}
