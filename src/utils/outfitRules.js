export function outfitRecommendation({
  temp,
  units = 'imperial',
  condition = '',
  wind = 0,
}) {
  const tF = units === 'metric' ? (temp * 9) / 5 + 32 : temp;
  const windMph = units === 'metric' ? wind * 2.23694 : wind;
  const c = (condition || '').toLowerCase();

  let rec = '';
  if (tF < 45)
    rec =
      'Bundle up in warm layers. A coat and insulation will keep you comfortable.';
  else if (tF < 61)
    rec =
      'A light jacket or sweater works well. Stay cozy without overheating.';
  else if (tF < 76) rec = 'Great t-shirt weather. Go casual and comfortable.';
  else if (tF < 86)
    rec =
      'Go light and breathable. Short sleeves and relaxed fabrics feel best.';
  else
    rec =
      'Stay cool with airy, moisture-wicking clothes. Consider a hat or shades.';

  const mods = [];
  if (/(rain|drizzle|thunder)/.test(c))
    mods.push('Carry something water-resistant.');
  if (/(snow|sleet)/.test(c))
    mods.push('Dress for winter and keep extremities protected.');
  if (windMph > 15) mods.push('Layer something that blocks the wind.');

  return mods.length ? `${rec} ${mods.join(' ')}` : rec;
}
