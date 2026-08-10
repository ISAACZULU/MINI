import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Bot,
  Volume1,
  Key,
  ExternalLink,
  Square,
  BrainCircuit,
  FileText,
  AlertTriangle,
  Heart
} from 'lucide-react';
import { generateMentalHealthAIResponse } from '../services/aiService';
import { useApp } from '../context/AppContext';

const DEFAULT_GEMINI_KEY = "AIzaSyDAN1uQY8mV5nf-BPf4zibpuaFRx8C_IFg";

export default function FloatingAIAssistant() {
  const { setIsBreathingModalOpen, setIsMoodModalOpen, showToast } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hi! I am Haven KNUST AI, powered as your direct portal to Google Gemini. Ask me anything—from coding, math, science, and general advice to mental health support and daily chat!'
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimText, setInterimText] = useState('');

  // Gemini API Key Management (Active by default)
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('ms_gemini_api_key') || DEFAULT_GEMINI_KEY);
  const [showKeyManager, setShowKeyManager] = useState(false);
  const [keyInput, setKeyInput] = useState('');

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const voicesListRef = useRef([]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, interimText, showKeyManager]);

  // Load voices for Speech Synthesis
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      voicesListRef.current = availableVoices;
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Stop Speech Readout Helper
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
    setIsSpeaking(false);
  };

  const handleSaveGeminiKey = (keyToSave) => {
    const trimmed = keyToSave.trim();
    if (trimmed) {
      localStorage.setItem('ms_gemini_api_key', trimmed);
      setGeminiKey(trimmed);
      setShowKeyManager(false);
      showToast('Connected to Google Gemini AI Portal!', 'success');
    } else {
      localStorage.removeItem('ms_gemini_api_key');
      setGeminiKey(DEFAULT_GEMINI_KEY);
      showToast('Reset to default Gemini Portal key', 'info');
    }
  };

  // Speech Synthesis Helper (Soft, slow AI speech)
  const speakText = (text) => {
    stopSpeech(); // Stop any existing speech first
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = 0.82; // Slower, gentle cadence
      utterance.pitch = 0.90; // Soft pitch
      utterance.volume = 0.85; // Gentle volume

      const voices = voicesListRef.current.length > 0 ? voicesListRef.current : window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const softVoice = voices.find(v => 
          v.lang.startsWith('en') && (
            v.name.includes('Google US English') || 
            v.name.includes('Natural') || 
            v.name.includes('Samantha') || 
            v.name.includes('Karen') || 
            v.name.includes('Serena') || 
            v.name.includes('Female')
          )
        ) || voices.find(v => v.lang.startsWith('en'));

        if (softVoice) {
          utterance.voice = softVoice;
        }
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech Synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  // Speech Recognition Helper (Microphone Input)
  const toggleListening = () => {
    stopSpeech(); // Interrupt speech readout if user starts microphone
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice input is not supported in this browser. Please try Chrome, Edge, or Safari.', 'warning');
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);
      setInterimText('');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setInterimText('Listening... Speak now');
        showToast('Microphone active. Speak clearly.', 'info');
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (currentInterim) {
          setInterimText(`Hearing: "${currentInterim}"`);
        }

        if (finalTranscript && finalTranscript.trim()) {
          setIsListening(false);
          setInterimText('');
          setInputText(finalTranscript);
          showToast(`Voice captured: "${finalTranscript}"`, 'success');
          handleSendMessage(finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setInterimText('');
        const errorMsg = event.error;

        if (errorMsg === 'not-allowed' || errorMsg === 'service-not-allowed') {
          showToast('Microphone permission denied. Please allow mic access in your browser location bar.', 'warning');
        } else if (errorMsg === 'no-speech') {
          showToast('No speech heard. Click the mic again and speak near your microphone.', 'info');
        } else {
          showToast(`Voice error (${errorMsg || 'mic error'}). You can type your message below.`, 'warning');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
      setInterimText('');
      showToast('Could not open microphone. Please type your message.', 'warning');
    }
  };

  const handleSendMessage = async (textToSend) => {
    stopSpeech(); // Cancel existing speech readout when a new message is sent
    const messageText = (typeof textToSend === 'string' ? textToSend : inputText).trim();
    if (!messageText || isTyping) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: messageText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setInterimText('');
    setIsTyping(true);

    try {
      const aiReplyText = await generateMentalHealthAIResponse(messageText, messages);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReplyText
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      speakText(aiReplyText);
    } catch (e) {
      console.error('Error generating AI response:', e);
      const fallbackText = "I encountered an issue connecting to Gemini. Please check your Gemini API key in the settings bar above.";
      const errorAiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: fallbackText
      };
      setMessages(prev => [...prev, errorAiMsg]);
      setIsTyping(false);
      speakText(fallbackText);
    }
  };

  const handleChipClick = (suggestion) => {
    stopSpeech();
    if (suggestion === 'Show me a breathing exercise') {
      setIsBreathingModalOpen(true);
      showToast('Opening 4-7-8 Breathing Tool...', 'info');
      return;
    }
    if (suggestion === 'Log my daily mood') {
      setIsMoodModalOpen(true);
      showToast('Opening Daily Mood Log...', 'info');
      return;
    }
    handleSendMessage(suggestion);
  };

  const handleCloseDrawer = () => {
    stopSpeech();
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <div className="floating-ai-fab-container">
        <button 
          className="floating-ai-fab" 
          onClick={() => {
            if (isOpen) stopSpeech();
            setIsOpen(!isOpen);
          }}
          title="Open Gemini AI Assistant Portal"
        >
          <div className="fab-ai-icon-box">
            <Sparkles size={22} color="#ffffff" />
          </div>
          <span className="fab-ai-label">Gemini AI</span>
        </button>
      </div>

      {/* Floating AI Chat Window Drawer */}
      {isOpen && (
        <div className="floating-ai-drawer">
          {/* Header */}
          <div className="ai-drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="ai-avatar-badge" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                <Sparkles size={20} color="#ffffff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>Gemini AI Portal</h4>
                  {isSpeaking && (
                    <button 
                      type="button" 
                      onClick={stopSpeech} 
                      className="speaking-soft-badge speaking-active-btn" 
                      title="Click to stop voice reading"
                    >
                      <Volume1 size={12} className="pulse-icon" /> Stop Reading
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={13} /> Gemini 1.5 Flash Active
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Gemini API Key Config Toggle */}
              <button 
                type="button" 
                className="icon-action-btn"
                onClick={() => setShowKeyManager(!showKeyManager)}
                title="Manage Gemini API Key"
                style={{ color: '#2563eb' }}
              >
                <Key size={17} />
              </button>

              {/* Voice Read-Aloud Toggle */}
              <button 
                type="button" 
                className="icon-action-btn"
                onClick={() => {
                  if (isSpeaking) {
                    stopSpeech();
                  } else {
                    setVoiceEnabled(!voiceEnabled);
                    showToast(voiceEnabled ? 'AI Voice muted' : 'AI Voice enabled (soft pace)', 'info');
                  }
                }}
                title={isSpeaking ? 'Stop Active Speech Readout' : (voiceEnabled ? 'Mute AI Voice' : 'Enable Soft AI Voice')}
              >
                {isSpeaking ? (
                  <Square size={15} color="#e11d48" fill="#e11d48" />
                ) : voiceEnabled ? (
                  <Volume2 size={17} color="#059669" />
                ) : (
                  <VolumeX size={17} color="#94a3b8" />
                )}
              </button>

              <button type="button" className="icon-action-btn" onClick={handleCloseDrawer}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Gemini API Key Configuration Panel */}
          {showKeyManager && (
            <div style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Key size={15} color="#2563eb" />
                  Google Gemini API Key Portal
                </span>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
                >
                  Get Key <ExternalLink size={12} />
                </a>
              </div>
              <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                Active Key: <code style={{ color: '#059669', fontWeight: 700 }}>AIzaSyDAN...FRx8C_IFg</code>
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="Paste custom key"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  style={{ padding: '8px 12px', fontSize: '0.825rem' }}
                />
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={() => handleSaveGeminiKey(keyInput)}
                  style={{ width: 'auto', padding: '8px 16px', fontSize: '0.825rem', whiteSpace: 'nowrap' }}
                >
                  Update Key
                </button>
              </div>
            </div>
          )}

          {/* Quick Suggestion Pills */}
          <div className="ai-suggestion-pills">
            <button type="button" className="ai-chip" onClick={() => handleChipClick('Explain quantum physics in simple terms')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="animate-icon-star"><BrainCircuit size={14} /></span>
              <span>Quantum Physics</span>
            </button>
            <button type="button" className="ai-chip" onClick={() => handleChipClick('Write a Python function to sort an array')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="animate-icon-settings"><FileText size={14} /></span>
              <span>Python Code</span>
            </button>
            <button type="button" className="ai-chip" onClick={() => handleChipClick('How can I overcome severe exam stress?')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="animate-icon-alert"><AlertTriangle size={14} /></span>
              <span>Exam Stress</span>
            </button>
            <button type="button" className="ai-chip" onClick={() => handleChipClick('Show me a breathing exercise')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span className="animate-icon-heart"><Heart size={14} /></span>
              <span>Breathing Tool</span>
            </button>
          </div>

          {/* Messages Body */}
          <div className="ai-drawer-body">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`ai-message-bubble ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="msg-avatar" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                    <Bot size={14} color="#ffffff" />
                  </div>
                )}
                <div className="msg-text">{msg.text}</div>
              </div>
            ))}

            {isTyping && (
              <div className="ai-message-bubble ai-msg">
                <div className="msg-avatar" style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}>
                  <Bot size={14} color="#ffffff" />
                </div>
                <div className="msg-text typing-dots">
                  <span>●</span> <span>●</span> <span>●</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Active Speech Readout Cancellation Bar */}
          {isSpeaking && (
            <div className="speech-stop-banner" onClick={stopSpeech} title="Click to stop voice readout">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Volume2 size={16} className="pulse-icon" />
                <span>Reading response out loud...</span>
              </div>
              <button type="button" className="stop-reading-btn">
                <Square size={11} fill="currentColor" /> Stop Reading
              </button>
            </div>
          )}

          {/* Live Hearing Transcript Banner when mic is listening */}
          {isListening && (
            <div className="live-hearing-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="live-mic-pulse animate-icon-heart" style={{ display: 'flex', alignItems: 'center' }}><Mic size={14} /></span>
              <span>{interimText || 'Listening... Speak into your microphone now'}</span>
            </div>
          )}

          {/* Input Footer */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
            className="ai-drawer-footer"
          >
            <button 
              type="button" 
              className={`mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              title="Click to speak using Microphone"
            >
              {isListening ? <MicOff size={16} color="#e11d48" /> : <Mic size={16} color="#64748b" />}
            </button>

            <input 
              type="text" 
              className="ai-input" 
              placeholder="Ask Gemini anything (coding, science, advice...)"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
            />

            <button type="submit" className="ai-send-btn" disabled={!inputText.trim() || isTyping}>
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
