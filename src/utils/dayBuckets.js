// utils/dayBuckets.js
import { format, fromUnixTime } from 'date-fns';

export function toDaily(list, units = 'metric') {
  const byDay = new Map();

  for (const item of list) {
    const dateStr = format(fromUnixTime(item.dt), 'yyyy-MM-dd');
    const t = item.main.temp;
    const icon = item.weather?.[0]?.icon ?? '01d';
    const desc = item.weather?.[0]?.description ?? '';
    const wind = item.wind?.speed ?? 0;

    if (!byDay.has(dateStr)) {
      byDay.set(dateStr, {
        dateStr,
        hi: t,
        lo: t,
        icon,
        desc,
        windSamples: [wind],
        samples: [item],
        units,
      });
    } else {
      const d = byDay.get(dateStr);
      d.hi = Math.max(d.hi, t);
      d.lo = Math.min(d.lo, t);
      d.windSamples.push(wind);
      d.samples.push(item);

      const noon = d.samples.find((s) => s.dt_txt?.includes('12:00:00'));
      if (noon) {
        d.icon = noon.weather?.[0]?.icon ?? d.icon;
        d.desc = noon.weather?.[0]?.description ?? d.desc;
      }
    }
  }

  const days = Array.from(byDay.values()).map((d) => ({
    ...d,
    wind: avg(d.windSamples),
    units,
  }));

  return days.slice(0, 5);
}

function avg(arr = []) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

export function niceDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return format(new Date(y, m - 1, d), 'EEE, MMM d');
}
