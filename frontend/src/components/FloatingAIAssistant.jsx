import React, { useState, useEffect, useRef } from 'react';
import { generateMentalHealthAIResponse } from '../services/aiService';
import { useApp } from '../context/AppContext';
import {
  IconlyStar,
  IconlyClose,
  IconlySend,
  IconlyShield,
  IconlyRefresh,
  IconlyBot,
  IconlyActivity,
  IconlyDocument,
  IconlyAlert
} from './Iconly';

// Custom Mic SVGs for voice assistant
function IconlyMic({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function IconlyMicOff({ size = 16, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
      <path d="M17 11.5a7 7 0 0 1-10.74 5.76M2 10v2a10 10 0 0 0 16.5 7.5" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function IconlyVolumeUp({ size = 17, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}

function IconlyVolumeMute({ size = 17, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

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

  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const voicesListRef = useRef([]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen, interimText]);

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
      const fallbackText = "I encountered an issue connecting to the AI companion. Please try again in a moment.";
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
            <IconlyStar size={22} color="#ffffff" />
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
              <div className="ai-avatar-badge" style={{ background: 'var(--primary-teal)' }}>
                <IconlyStar size={20} color="#ffffff" />
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
                      Stop Reading
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--safety-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconlyShield size={13} /> Gemini 1.5 Flash Active
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                aria-label={isSpeaking ? 'Stop Active Speech Readout' : (voiceEnabled ? 'Mute AI Voice' : 'Enable Soft AI Voice')}
              >
                {isSpeaking ? (
                  <span style={{ width: '10px', height: '10px', background: 'var(--restrained-red)', display: 'block', borderRadius: '2px' }} />
                ) : voiceEnabled ? (
                  <IconlyVolumeUp size={17} color="var(--safety-green)" />
                ) : (
                  <IconlyVolumeMute size={17} color="var(--text-subtle)" />
                )}
              </button>
 
              <button type="button" className="icon-action-btn" onClick={handleCloseDrawer} aria-label="Close AI chat companion">
                <IconlyClose size={18} />
              </button>
            </div>
          </div>
 
          {/* Quick Suggestion Pills */}
          <div className="ai-suggestion-pills">
            <button type="button" className="ai-chip" onClick={() => handleChipClick('Explain quantum physics in simple terms')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <IconlyActivity size={14} />
              <span>Quantum Physics</span>
            </button>
            <button type="button" className="ai-chip" onClick={() => handleChipClick('Write a Python function to sort an array')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <IconlyDocument size={14} />
              <span>Python Code</span>
            </button>
            <button type="button" className="ai-chip" onClick={() => handleChipClick('How can I overcome severe exam stress?')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <IconlyAlert size={14} />
              <span>Exam Stress</span>
            </button>
            <button type="button" className="ai-chip" onClick={() => handleChipClick('Show me a breathing exercise')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <IconlyStar size={14} />
              <span>Breathing Tool</span>
            </button>
          </div>
 
          {/* Messages Body */}
          <div className="ai-drawer-body" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`ai-message-bubble ${msg.sender === 'user' ? 'user-msg' : 'ai-msg'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="msg-avatar" style={{ background: 'var(--primary-teal)' }}>
                    <IconlyBot size={14} color="#ffffff" />
                  </div>
                )}
                <div className="msg-text">{msg.text}</div>
              </div>
            ))}
 
            {isTyping && (
              <div className="ai-message-bubble ai-msg">
                <div className="msg-avatar" style={{ background: 'var(--primary-teal)' }}>
                  <IconlyBot size={14} color="#ffffff" />
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
            <div className="speech-stop-banner" onClick={stopSpeech} title="Click to stop voice readout" style={{ background: 'var(--primary-teal)', color: '#ffffff', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconlyVolumeUp size={16} />
                <span>Reading response out loud...</span>
              </div>
              <button type="button" className="stop-reading-btn" style={{ background: '#ffffff', color: 'var(--primary-teal)', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 'bold' }} aria-label="Stop active voice playback">
                Stop Reading
              </button>
            </div>
          )}
 
          {/* Live Hearing Transcript Banner when mic is listening */}
          {isListening && (
            <div className="live-hearing-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'var(--pill-bg)', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem' }}>
              <span className="live-mic-pulse" style={{ display: 'flex', alignItems: 'center', color: 'var(--restrained-red)' }}><IconlyMic size={14} /></span>
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
              aria-label={isListening ? "Stop voice listening" : "Start voice listening"}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {isListening ? <IconlyMicOff size={16} color="var(--restrained-red)" /> : <IconlyMic size={16} color="var(--text-subtle)" />}
            </button>
 
            <input 
              type="text" 
              className="ai-input" 
              placeholder="Ask Gemini anything..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              aria-label="Message for AI companion"
              style={{ flexGrow: 1, border: 'none', outline: 'none', background: 'none', fontSize: '0.9rem', color: 'var(--text-main)', padding: '0 8px' }}
            />
 
            <button type="submit" className="ai-send-btn" disabled={!inputText.trim() || isTyping} aria-label="Send message" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconlySend size={15} color={inputText.trim() && !isTyping ? 'var(--primary-teal)' : 'var(--text-subtle)'} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
