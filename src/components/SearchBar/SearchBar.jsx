import { useState } from 'react';
import styles from './SearchBar.module.css';
export default function SearchBar({ onSearch, initial = '' }) {
  const [city, setCity] = useState(initial);
  function handleSubmit(e) {
    e.preventDefault();
    const q = city.trim();
    if (!q) return;
    onSearch(q);
  }
  return (
    <form className={styles.wrap} onSubmit={handleSubmit} role='search'>
      <input
        aria-label='Search city'
        className={styles.input}
        placeholder='Search city (e.g., Atlanta)'
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button className={styles.btn} type='submit'>
        Search
      </button>
    </form>
  );
}
