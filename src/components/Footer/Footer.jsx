import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} role='contentinfo'>
      <span>© {year} CityFit Forecast</span>
      <span className={styles.dot}>•</span>
      <a
        href='https://github.com/Rwash70/cityfit-forecast'
        target='_blank'
        rel='noreferrer'
      >
        GitHub
      </a>
    </footer>
  );
}
