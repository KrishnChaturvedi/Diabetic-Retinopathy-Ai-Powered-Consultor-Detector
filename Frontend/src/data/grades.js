export const GRADES = [
  {
    grade: 'none',
    label: 'No DR',
    full: 'No Diabetic Retinopathy',
    conf: 94,
    risk: 'Low',
    next: '12 months',
    lesions: { micro: false, hemo: false, exu: false, neo: false },
    ref: 'success',
    refTitle: 'No Referral Required',
    refText: 'No signs of DR detected. Continue annual screening and maintain good blood sugar control.',
  },
  {
    grade: 'mild',
    label: 'Mild NPDR',
    full: 'Mild Non-Proliferative DR',
    conf: 88,
    risk: 'Low-Moderate',
    next: '6–9 months',
    lesions: { micro: true, hemo: false, exu: false, neo: false },
    ref: 'warning',
    refTitle: 'Follow-up Screening Recommended',
    refText: 'Mild retinal changes detected. Schedule follow-up in 6–9 months. Optimize blood glucose control.',
  },
  {
    grade: 'moderate',
    label: 'Moderate NPDR',
    full: 'Moderate Non-Proliferative DR',
    conf: 91,
    risk: 'Moderate-High',
    next: '3–6 months',
    lesions: { micro: true, hemo: true, exu: true, neo: false },
    ref: 'warning',
    refTitle: 'Ophthalmologist Consultation Recommended',
    refText: 'Moderate retinal damage detected. See an ophthalmologist within 1–2 months.',
  },
  {
    grade: 'severe',
    label: 'Severe NPDR',
    full: 'Severe Non-Proliferative DR',
    conf: 96,
    risk: 'High',
    next: 'Immediate',
    lesions: { micro: true, hemo: true, exu: true, neo: true },
    ref: 'danger',
    refTitle: 'URGENT: Specialist Referral Required',
    refText: 'Severe retinal damage. Immediate ophthalmologist referral required. High risk of vision loss.',
  },
];

export const LESION_NAMES = {
  micro: 'Microaneurysms',
  hemo: 'Retinal Hemorrhages',
  exu: 'Hard Exudates',
  neo: 'Neovascularization',
};

export const LESION_COLORS = {
  micro: '#fbbf24',
  hemo:  '#ef4444',
  exu:   '#f97316',
  neo:   '#a855f7',
};

export const LESION_DOTS = [
  { t: 'micro', top: '38%', left: '52%' },
  { t: 'micro', top: '56%', left: '41%' },
  { t: 'micro', top: '44%', left: '63%' },
  { t: 'hemo',  top: '33%', left: '46%' },
  { t: 'hemo',  top: '61%', left: '56%' },
  { t: 'exu',   top: '49%', left: '36%' },
  { t: 'exu',   top: '37%', left: '59%' },
  { t: 'neo',   top: '51%', left: '66%' },
  { t: 'neo',   top: '43%', left: '31%' },
];

export function mockAnalyze() {
  return GRADES[Math.floor(Math.random() * GRADES.length)];
}
