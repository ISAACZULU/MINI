import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  ShieldCheck, 
  MessageSquare, 
  Monitor, 
  Send,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TelehealthRoomModal() {
  const { activeTelehealthRoom, setActiveTelehealthRoom, showToast } = useApp();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(260); // 4m 20s initial
  const [chatMessages, setChatMessages] = useState([
    { sender: 'Dr. Sarah Jenkins', time: '10:02 AM', text: 'Hello Anon#4821! Welcome to your private telehealth session. How are you feeling right now?' }
  ]);
  const [newChatText, setNewChatText] = useState('');

  useEffect(() => {
    if (!activeTelehealthRoom) return;

    const timer = setInterval(() => {
      setSessionSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTelehealthRoom]);

  if (!activeTelehealthRoom) return null;

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!newChatText.trim()) return;

    setChatMessages([
      ...chatMessages,
      { sender: activeTelehealthRoom.studentAlias || 'Anon#4821', time: 'Just now', text: newChatText.trim() }
    ]);
    setNewChatText('');
  };

  const handleEndCall = () => {
    setActiveTelehealthRoom(null);
    showToast('Telehealth session ended securely.', 'info');
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 900 }}>
      <div className="modal-card modal-large" style={{ maxWidth: '940px', background: '#0f172a', color: '#f8fafc', border: '1px solid #334155' }}>
        {/* Top Video Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#10b981', color: '#fff', padding: '6px', borderRadius: '50%', display: 'flex' }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Telehealth Virtual Room: {activeTelehealthRoom.topic}
              </h3>
              <span style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                Session ID: <code style={{ color: '#34d399' }}>{activeTelehealthRoom.id}</code> • End-to-End Encrypted (FERPA Verified)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ background: '#1e293b', border: '1px solid #334155', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
              ⏱️ {formatTimer(sessionSeconds)}
            </span>
            <button className="close-btn" style={{ color: '#94a3b8' }} onClick={handleEndCall}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Telehealth Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', padding: '20px' }}>
          {/* Video Stream Feeds */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Counselor Main Video Stream */}
            <div style={{ height: '280px', background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isScreenSharing ? (
                <div style={{ background: '#0284c7', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '20px' }}>
                  <Monitor size={48} style={{ marginBottom: '8px' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Screen Share Active</h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Presenting "4-7-8 Breathing & Exam Resilience Slides.pdf"</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-teal)', border: '3px solid var(--safety-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto', fontSize: '1.8rem', fontWeight: 800 }}>
                    SJ
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{activeTelehealthRoom.counselorName}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <Volume2 size={14} className="pulse-icon" /> Speaking...
                  </span>
                </div>
              )}

              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(15, 23, 42, 0.75)', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                Verified Campus Counselor Feed
              </div>
            </div>

            {/* Student Preview Stream */}
            <div style={{ height: '110px', background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', position: 'relative', display: 'flex', alignItems: 'center', padding: '16px', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: isVideoOff ? '#475569' : '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {isVideoOff ? <VideoOff size={22} color="#cbd5e1" /> : 'AN'}
              </div>

              <div>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{activeTelehealthRoom.studentAlias} (You)</h5>
                <span style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                  {isVideoOff ? 'Video Muted' : 'Camera On'} • {isMuted ? 'Mic Muted' : 'Mic Live'}
                </span>
              </div>
            </div>
          </div>

          {/* Telehealth In-Session Chat Box */}
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#f8fafc' }}>
              <MessageSquare size={16} color="#38bdf8" />
              <span>Encrypted Session Chat</span>
            </h4>

            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '250px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', paddingRight: '4px' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ background: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <strong style={{ color: '#38bdf8' }}>{msg.sender}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#e2e8f0', margin: 0, lineHeight: 1.4 }}>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="text"
                className="form-input"
                style={{ background: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '0.825rem' }}
                placeholder="Type confidential message..."
                value={newChatText}
                onChange={e => setNewChatText(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 14px', background: '#0284c7' }}>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Telehealth Bottom Control Bar */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', background: '#0f172a' }}>
          <button 
            type="button"
            onClick={() => { setIsMuted(!isMuted); showToast(isMuted ? 'Microphone unmuted' : 'Microphone muted', 'info'); }}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: isMuted ? '#e11d48' : '#334155', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button 
            type="button"
            onClick={() => { setIsVideoOff(!isVideoOff); showToast(isVideoOff ? 'Camera turned on' : 'Camera turned off', 'info'); }}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: isVideoOff ? '#e11d48' : '#334155', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          <button 
            type="button"
            onClick={() => { setIsScreenSharing(!isScreenSharing); showToast(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started', 'info'); }}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: isScreenSharing ? '#0284c7' : '#334155', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Share Screen"
          >
            <Monitor size={20} />
          </button>

          <button 
            type="button"
            onClick={handleEndCall}
            style={{ padding: '10px 24px', borderRadius: '9999px', background: '#e11d48', color: '#fff', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <PhoneOff size={18} />
            <span>End Telehealth Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
}
