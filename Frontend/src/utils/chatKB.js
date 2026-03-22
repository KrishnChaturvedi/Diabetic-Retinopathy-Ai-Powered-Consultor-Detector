const KB = {
  'diabetic retinopathy':
    'Diabetic retinopathy is damage to retinal blood vessels from high blood sugar. It has 4 stages: No DR, Mild NPDR, Moderate NPDR, and Severe NPDR. Early detection prevents blindness.',
  symptoms:
    'Common symptoms: blurry vision, floating spots, dark areas, poor night vision, faded colors. In early stages there are NO symptoms — so regular screening is crucial.',
  prevent:
    'To prevent DR: keep HbA1c below 7%, manage blood pressure, get annual eye screening, quit smoking, and exercise regularly.',
  treatment:
    'Treatment: laser therapy (photocoagulation), anti-VEGF injections, vitrectomy surgery for severe cases, and strict blood sugar control.',
  microaneurysms:
    'Microaneurysms are tiny bulges in retinal blood vessels — the first sign of DR. They appear as small red dots and can leak fluid into the retina.',
  hemorrhages:
    'Retinal hemorrhages are bleeding from ruptured blood vessels. They appear as red blotches and indicate moderate to severe retinopathy.',
  exudates:
    'Hard exudates are fat/protein deposits from damaged vessels. They appear as yellow-white spots and often indicate macular edema.',
  hello:
    'Hello! I am your eye health assistant. Ask me anything about diabetic retinopathy, symptoms, or how the AI screening works.',
  hi: 'Hi there! Ask me about symptoms, treatment, blood sugar control, or how the AI analysis works.',
};

export function getBotReply(msg) {
  const m = msg.toLowerCase();
  for (const [k, v] of Object.entries(KB)) {
    if (m.includes(k)) return v;
  }
  if (m.includes('float') || m.includes('spot')) return KB['symptoms'];
  if (m.includes('blur') || m.includes('vision')) return KB['symptoms'];
  if (m.includes('laser') || m.includes('inject')) return KB['treatment'];
  if (m.includes('sugar') || m.includes('hba1c'))
    return 'Keeping HbA1c below 7% significantly reduces DR risk. Monitor blood sugar regularly and take medications consistently.';
  if (m.includes('prevent')) return KB['prevent'];
  return 'I can help with: symptoms, what is DR, treatment, microaneurysms, blood sugar, or how the AI works. What would you like to know?';
}

export const QUICK_QUESTIONS = [
  'What is DR?',
  'Symptoms?',
  'How to prevent?',
  'Treatment?',
  'Microaneurysms?',
];
