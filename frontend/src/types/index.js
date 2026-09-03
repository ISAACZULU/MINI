export const RISK_LEVELS = {
  CRISIS: 'CRISIS',
  HIGH: 'HIGH',
  MODERATE: 'MODERATE',
  LOW: 'LOW'
};

export const RISK_CONFIG = {
  CRISIS: {
    label: 'Immediate Crisis Signal',
    badgeClass: 'badge-crisis',
    color: '#e11d48',
    bgColor: '#ffe4e6',
    borderColor: '#fecdd3',
    icon: 'AlertTriangle'
  },
  HIGH: {
    label: 'High Distress Level',
    badgeClass: 'badge-high',
    color: '#d97706',
    bgColor: '#fef3c7',
    borderColor: '#fde68a',
    icon: 'AlertCircle'
  },
  MODERATE: {
    label: 'Moderate Support Needed',
    badgeClass: 'badge-moderate',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    borderColor: '#bae6fd',
    icon: 'HelpCircle'
  },
  LOW: {
    label: 'General Peer Discussion',
    badgeClass: 'badge-low',
    color: '#059669',
    bgColor: '#d1fae5',
    borderColor: '#a7f3d0',
    icon: 'CheckCircle'
  }
};

export const CATEGORIES = [
  'All',
  'Anxiety',
  'Academic pressure',
  'Loneliness',
  'Depression',
  'Relationships',
  'Family',
  'Sleep',
  'Burnout'
];

export const CANNED_COUNSELOR_RESPONSES = [
  {
    title: '4-7-8 Grounding Technique',
    text: 'Thank you for opening up. Try taking a moment for box breathing: inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds. campus counselors are always available at the wellness center.'
  },
  {
    title: 'Schedule 1-on-1 Session',
    text: 'I hear how difficult this situation is for you. Please consider booking a confidential telehealth or in-person 1-on-1 check-in with our team through the Counselor button above.'
  },
  {
    title: 'Academic Relief Guidance',
    text: 'Academic stress can feel overwhelming, but your well-being comes first. Campus academic advisors can assist with course adjustments, extensions, or tutoring options.'
  }
];
