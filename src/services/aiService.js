/**
 * Haven KNUST AI - Live Google Gemini Portal Service
 * Direct integration with Google Gemini API with multi-model auto-discovery.
 */

const DEFAULT_GEMINI_KEY = "AIzaSyDAN1uQY8mV5nf-BPf4zibpuaFRx8C_IFg";

// Verified working Gemini model candidates prioritized first
const MODEL_CANDIDATES = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite',
  'gemini-2.0-flash'
];

let workingModelCache = 'gemini-3.6-flash';

export async function generateMentalHealthAIResponse(userMessage, conversationHistory = []) {
  if (!userMessage || !userMessage.trim()) {
    return "I'm listening! What would you like to ask or discuss today?";
  }

  const query = userMessage.trim();

  // Retrieve Gemini API Key from localStorage, environment variables, or default key
  const apiKey = (typeof window !== 'undefined' ? localStorage.getItem('ms_gemini_api_key') : null) 
    || import.meta.env?.VITE_GEMINI_API_KEY 
    || DEFAULT_GEMINI_KEY;

  if (!apiKey || !apiKey.trim()) {
    return "🔑 Live Gemini AI Portal: Please enter a Gemini API key to activate live Google Gemini thinking!";
  }

  const cleanKey = apiKey.trim();

  // Build universal contents payload
  const contents = [
    {
      role: 'user',
      parts: [{ 
        text: "System Instruction: You are Haven KNUST AI, powered directly by Google Gemini. You are a natural, open, highly intelligent, and versatile AI assistant. Answer any user query on any topic (ADHD, studying, coding, science, general advice, math, creative ideas, casual chat, campus life, mental health) with deep intelligence, empathy, clear guidance, and human-like natural conversation." 
      }]
    },
    {
      role: 'model',
      parts: [{ text: "Understood! I am Haven KNUST AI, powered by Gemini. I am ready to answer any questions with deep insight, clarity, and empathy." }]
    }
  ];

  // Append recent history
  const recentHistory = conversationHistory.slice(-6);
  for (const msg of recentHistory) {
    if (msg.text) {
      contents.push({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      });
    }
  }

  // Append current prompt
  contents.push({
    role: 'user',
    parts: [{ text: query }]
  });

  // Try cached working model first, or iterate through candidate models
  const modelsToTry = workingModelCache 
    ? [workingModelCache, ...MODEL_CANDIDATES.filter(m => m !== workingModelCache)]
    : MODEL_CANDIDATES;

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText && aiText.trim()) {
          workingModelCache = model; // Cache working model!
          return aiText.trim();
        }
      } else {
        const errJson = await response.json().catch(() => ({}));
        lastError = errJson.error?.message || `HTTP ${response.status}`;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  console.warn('Gemini API call failed across all models. Error:', lastError);
  return getSmartFallbackResponse(query);
}

function getSmartFallbackResponse(query) {
  const q = query.toLowerCase();

  if (q.includes('adhd') || q.includes('focus') || q.includes('study')) {
    return "Coping with ADHD as a student involves creating structure that works with your brain, not against it. Key strategies include using body doubling (studying near others), breaking assignments into micro-tasks (Pomodoro technique: 25m focus / 5m rest), using visual timers, and speaking with campus accessibility services for accommodations.";
  }

  if (q.match(/\b(hi|hello|hey|greetings|sup|yo)\b/)) {
    return "Hello! I am Haven KNUST AI. How can I help you today?";
  }

  return `I'm here to support you! Regarding your question on "${query}", feel free to ask me for detailed strategies, study tips, or explanations on any topic.`;
}
