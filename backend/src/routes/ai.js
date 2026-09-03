import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const MODEL_CANDIDATES = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
let workingModelCache = 'gemini-2.5-flash';

function getSmartFallbackResponse(query) {
  const q = query.toLowerCase();
  if (q.includes('adhd') || q.includes('focus') || q.includes('study')) {
    return "Coping with ADHD as a student involves creating structure that works with your brain, not against it. Key strategies include using body doubling (studying near others), breaking assignments into micro-tasks (Pomodoro technique: 25m focus / 5m rest), using visual timers, and speaking with campus accessibility services for accommodations.";
  }
  if (/\b(hi|hello|hey|greetings|sup|yo)\b/.test(q)) {
    return 'Hello! I am Haven KNUST AI. How can I help you today?';
  }
  return `I'm here to support you! Regarding your question on "${query}", feel free to ask me for detailed strategies, study tips, or explanations on any topic.`;
}

// AI chat is proxied through the backend so the Gemini API key never ships
// to the browser (it used to be hardcoded directly in frontend JS).
router.post('/chat', requireAuth, async (req, res) => {
  const { message, history } = req.body || {};
  const query = (message || '').trim();
  if (!query) return res.json({ reply: "I'm listening! What would you like to ask or discuss today?" });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.json({ reply: getSmartFallbackResponse(query) });
  }

  const contents = [
    {
      role: 'user',
      parts: [{ text: 'System Instruction: You are Haven KNUST AI, powered directly by Google Gemini. You are a natural, open, highly intelligent, and versatile AI assistant. Answer any user query on any topic (ADHD, studying, coding, science, general advice, math, creative ideas, casual chat, campus life, mental health) with deep intelligence, empathy, clear guidance, and human-like natural conversation.' }]
    },
    {
      role: 'model',
      parts: [{ text: 'Understood! I am Haven KNUST AI, powered by Gemini. I am ready to answer any questions with deep insight, clarity, and empathy.' }]
    },
    ...(Array.isArray(history) ? history.slice(-6) : [])
      .filter(m => m?.text)
      .map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
    { role: 'user', parts: [{ text: query }] }
  ];

  const modelsToTry = [workingModelCache, ...MODEL_CANDIDATES.filter(m => m !== workingModelCache)];

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText?.trim()) {
          workingModelCache = model;
          return res.json({ reply: aiText.trim() });
        }
      }
    } catch {
      // try next model candidate
    }
  }

  res.json({ reply: getSmartFallbackResponse(query) });
});

export default router;
