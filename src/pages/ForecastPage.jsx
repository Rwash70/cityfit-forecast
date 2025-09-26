import { useEffect, useState, Suspense } from 'react'
import styles from './ForecastPage.module.css'
import SearchBar from '../components/SearchBar/SearchBar.jsx'
import { getForecastByCity } from '../utils/weatherApi.js'
import { toDaily } from '../utils/dayBuckets.js'
import React from 'react'
const ForecastList = React.lazy(()=>import('../components/ForecastList/ForecastList.jsx'))

export default function ForecastPage() {
  const [units, setUnits] = useState('imperial')
  const [city, setCity] = useState('Atlanta')
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function load(cityName){
    try{
      setLoading(true); setErr('')
      const data = await getForecastByCity(cityName, units)
      setCity(`${data.city.name}, ${data.city.country}`)
      setDays(toDaily(data.list))
    }catch(e){
      setErr(e?.response?.data?.message || e.message || 'Failed to load forecast')
      setDays([])
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load(city) }, [units]) // eslint-disable-line

  return (
    <main className={styles.wrap}>
      <header className={styles.header}>
        <h1 className={styles.title}>CityFit Forecast</h1>
        <div className={styles.controls}>
          <SearchBar initial="Atlanta" onSearch={load}/>
          <button
            className={styles.unit}
            onClick={()=>setUnits(u=>u==='imperial'?'metric':'imperial')}
            aria-label="Toggle temperature units"
            title="Toggle °F/°C"
          >
            {units==='imperial'?'°F':'°C'}
          </button>
        </div>
        <div className={styles.subtitle}>{city}</div>
      </header>

      {loading && <p className={styles.status}>Loading…</p>}
      {err && <p className={styles.error} role="alert">{err}</p>}

      {!loading && !err && days.length>0 && (
        <section>
          <h2 className={styles.sectionTitle}>5-Day Outlook</h2>
          <Suspense fallback={<p className={styles.status}>Loading forecast…</p>}>
            <ForecastList days={days} units={units}/>
          </Suspense>
        </section>
      )}
    </main>
  )
}
