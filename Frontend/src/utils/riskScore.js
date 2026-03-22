export function getRisk(score, maxScore) {
  const pct = (score / maxScore) * 100;

  if (pct >= 75)
    return {
      level: 'High Risk',
      color: '#dc2626',
      bg: '#fef2f2',
      border: '#fecaca',
      advice:
        'Your answers suggest high likelihood of retinal damage. Please see an ophthalmologist as soon as possible.',
      boost: 15,
    };

  if (pct >= 50)
    return {
      level: 'Moderate Risk',
      color: '#ea580c',
      bg: '#fff7ed',
      border: '#fed7aa',
      advice:
        'Possible retinal changes from your answers. Schedule an eye check within 1–2 months.',
      boost: 8,
    };

  if (pct >= 30)
    return {
      level: 'Low-Moderate Risk',
      color: '#ca8a04',
      bg: '#fefce8',
      border: '#fde68a',
      advice:
        'Some mild signs noticed. Keep monitoring and ensure good blood sugar control.',
      boost: 4,
    };

  return {
    level: 'Low Risk',
    color: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    advice:
      'No major warning signs from your answers. Continue annual screening as recommended.',
    boost: 0,
  };
}
