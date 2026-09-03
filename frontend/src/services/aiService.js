import { aiChat } from './api';

// The AI companion now talks to our own backend, which holds the Gemini API
// key server-side. The browser never sees it.
export async function generateMentalHealthAIResponse(userMessage, conversationHistory = []) {
  if (!userMessage || !userMessage.trim()) {
    return "I'm listening! What would you like to ask or discuss today?";
  }

  try {
    const { reply } = await aiChat(userMessage.trim(), conversationHistory);
    return reply;
  } catch (err) {
    console.warn('AI chat request failed:', err);
    return "I'm having trouble reaching the AI companion right now. Please try again in a moment, or reach out to a campus counselor directly.";
  }
}
