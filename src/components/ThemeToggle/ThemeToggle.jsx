import { useEffect, useState } from 'react';

const MODES = ['auto', 'dark', 'light'];

export default function ThemeToggle({ className = '' }) {
  const [mode, setMode] = useState(
    () => localStorage.getItem('theme') || 'auto'
  );

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
  }, [mode]);

  function next() {
    setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length]);
  }
  const label = mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light';

  return (
    <button
      className={className}
      onClick={next}
      aria-label='Toggle theme'
      title='Theme: Auto / Dark / Light'
    >
      {label}
    </button>
  );
}
