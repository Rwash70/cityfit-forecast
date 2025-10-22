// src/components/ThemeToggle/ThemeToggle.jsx
import { useEffect, useState, useMemo } from 'react';

const STORAGE_KEY = 'cityfit-theme'; 

function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === 'light') {
    root.setAttribute('data-theme', 'light');
  } else if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    
    root.removeAttribute('data-theme');
  }
}

export default function ThemeToggle() {
  const [mode, setMode] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'auto'
  );

  const label = useMemo(() => {
    if (mode === 'light') return 'Light';
    if (mode === 'dark') return 'Dark';
    return 'Auto';
  }, [mode]);

  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'auto') return;
    const m = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('auto');
    m.addEventListener?.('change', onChange);
    m.addListener?.(onChange);
    return () => {
      m.removeEventListener?.('change', onChange);
      m.removeListener?.(onChange);
    };
  }, [mode]);

  function cycle() {
    setMode((prev) =>
      prev === 'light' ? 'dark' : prev === 'dark' ? 'auto' : 'light'
    );
  }

  return (
    <button
      type='button'
      onClick={cycle}
      aria-label={`Theme: ${label}. Click to switch`}
      title={`Theme: ${label} (click to change)`}
      style={{
        padding: '12px 14px',
        borderRadius: '10px',
        background: 'var(--btn-bg)',
        color: 'var(--btn-fg)',
        border: 0,
        cursor: 'pointer',
        minWidth: 60,
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );
}
