const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'harm myself',
  'no reason to live', "goodbye everyone", "can't go on", 'hopeless',
  'better off without me', "don't want to wake up"
];

const HIGH_RISK_KEYWORDS = [
  'drowning', 'panic attack', "can't breathe", 'numb', 'anhedonia',
  'failing everything', 'crushing guilt', 'having a breakdown',
  'unbearable', 'severe anxiety', 'cannot cope', 'terrified'
];

const MODERATE_RISK_KEYWORDS = [
  'stressed', 'overwhelmed', 'lonely', 'exhausted', "can't sleep",
  'insomnia', 'burnout', 'sad', 'crying', 'scared', 'isolated'
];

// Server-side authoritative risk triage. Mirrors the instant client-side
// preview in frontend/src/utils/riskAnalyzer.js, but this is the copy that
// actually gets persisted — the client copy is only for immediate UI feedback.
export function analyzeTextRisk(title = '', content = '') {
  const fullText = `${title} ${content}`.toLowerCase();
  const triggers = [];
  let score = 10;

  for (const keyword of CRISIS_KEYWORDS) {
    if (fullText.includes(keyword)) {
      triggers.push(keyword);
      score += 40;
    }
  }
  if (triggers.length > 0) {
    return {
      riskLevel: 'CRISIS',
      score: Math.min(100, score + 30),
      triggers,
      isCrisis: true,
      recommendation: 'Immediate Crisis Protocol - Display 24/7 Helpline & Notify On-Call Counselor'
    };
  }

  for (const keyword of HIGH_RISK_KEYWORDS) {
    if (fullText.includes(keyword)) {
      triggers.push(keyword);
      score += 20;
    }
  }
  if (score >= 50 || triggers.length >= 2) {
    return {
      riskLevel: 'HIGH',
      score: Math.min(85, score),
      triggers,
      isCrisis: false,
      recommendation: 'Priority Counselor Outreach & Grounding Assistance Suggested'
    };
  }

  for (const keyword of MODERATE_RISK_KEYWORDS) {
    if (fullText.includes(keyword)) {
      triggers.push(keyword);
      score += 10;
    }
  }
  if (score >= 30 || triggers.length >= 1) {
    return {
      riskLevel: 'MODERATE',
      score: Math.min(50, score),
      triggers,
      isCrisis: false,
      recommendation: 'Standard Peer Support & Self-Care Resources'
    };
  }

  return {
    riskLevel: 'LOW',
    score: 15,
    triggers: [],
    isCrisis: false,
    recommendation: 'General Peer Sharing'
  };
}
