import React, { useState, useEffect } from 'react';
import { 
  IconlyClose, 
  IconlyShield, 
  IconlyChat, 
  IconlySend, 
  IconlyVideo, 
  IconlyVideoOff, 
  IconlyPhoneOff,
  IconlyMic,
  IconlyMicOff,
  IconlyMonitor,
  IconlyVolume
} from './Iconly';
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
      <div className="modal-card modal-large" style={{ maxWidth: '940px', background: 'var(--bg-canvas)', color: 'var(--text-main)', border: '1px solid var(--border-color)', width: '90%' }}>
        {/* Top Video Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--safety-green)', color: '#fff', padding: '6px', borderRadius: '50%', display: 'flex' }}>
              <IconlyShield size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                Telehealth Virtual Room: {activeTelehealthRoom.topic}
              </h3>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span>Session ID: <code style={{ color: 'var(--safety-green)' }}>{activeTelehealthRoom.id}</code></span>
                <span>•</span>
                <span>End-to-End Encrypted (FERPA Verified)</span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--safety-green)', fontWeight: 600 }}>
                  <span className="live-indicator-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--safety-green)', display: 'inline-block' }}></span>
                  Connected (14ms Latency • Excellent Signal)
                </span>
              </span>
            </div>
          </div>
 
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ background: 'var(--pill-bg)', border: '1px solid var(--border-color)', padding: '4px 12px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-blue)' }}>
              ⏱️ {formatTimer(sessionSeconds)}
            </span>
            <button className="close-btn" style={{ color: 'var(--text-muted)' }} onClick={handleEndCall}>
              <IconlyClose size={20} />
            </button>
          </div>
        </div>
 
        {/* Telehealth Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', padding: '20px' }}>
          {/* Video Stream Feeds */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Counselor Main Video Stream */}
            <div style={{ height: '280px', background: 'var(--pill-bg)', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isScreenSharing ? (
                <div style={{ background: 'var(--primary-blue)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '20px', textAlign: 'center' }}>
                  <IconlyMonitor size={48} style={{ marginBottom: '8px' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Screen Share Active</h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Presenting "4-7-8 Breathing & Exam Resilience Slides.pdf"</p>
                </div>
              ) : (
                <iframe
                  title="Daily Telehealth Room"
                  src="https://demo.daily.co/demo"
                  allow="camera; microphone; fullscreen; speaker; display-capture"
                  style={{ width: '100%', height: '100%', border: 'none', borderRadius: '16px' }}
                  allowFullScreen
                />
              )}
              )
 
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'var(--pill-bg)', border: '1px solid var(--border-color)', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600 }}>
                Verified Campus Counselor Feed
              </div>
            </div>
 
            {/* Student Preview Stream */}
            <div style={{ height: '110px', background: 'var(--pill-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative', display: 'flex', alignItems: 'center', padding: '16px', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: isVideoOff ? 'var(--border-color)' : 'var(--primary-blue)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {isVideoOff ? <IconlyVideoOff size={22} /> : 'AN'}
              </div>
 
              <div style={{ flexGrow: 1 }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{activeTelehealthRoom.studentAlias} (You)</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                    {isVideoOff ? 'Video Muted' : 'Camera On'} • {isMuted ? 'Mic Muted' : 'Mic Live'}
                  </span>
                  
                  {/* Mic Level Indicator (UX Critique) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '6px', height: '14px' }}>
                    {isMuted ? (
                      <div style={{ width: '40px', height: '3px', backgroundColor: 'var(--restrained-red)', borderRadius: '2px', opacity: 0.7 }} title="Microphone muted" />
                    ) : (
                      <>
                        <div className="mic-bar bar-1" style={{ width: '3px', height: '6px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                        <div className="mic-bar bar-2" style={{ width: '3px', height: '10px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                        <div className="mic-bar bar-3" style={{ width: '3px', height: '8px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                        <div className="mic-bar bar-4" style={{ width: '3px', height: '12px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                        <div className="mic-bar bar-5" style={{ width: '3px', height: '5px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Telehealth In-Session Chat Box */}
          <div style={{ background: 'var(--pill-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-main)' }}>
              <IconlyChat size={16} color="var(--primary-blue)" />
              <span>Encrypted Session Chat</span>
            </h4>

            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '250px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', paddingRight: '4px' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ background: 'var(--card-bg)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--primary-blue)' }}>{msg.sender}</strong>
                    <span>{msg.time}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px' }}>
              <input 
                type="text"
                className="form-input"
                style={{ background: 'var(--card-bg)', borderColor: 'var(--border-color)', color: 'var(--text-main)', fontSize: '0.825rem', flexGrow: 1 }}
                placeholder="Type confidential message..."
                value={newChatText}
                onChange={e => setNewChatText(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 14px', height: 'auto' }}>
                <IconlySend size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Telehealth Bottom Control Bar */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', background: 'var(--bg-canvas)', flexWrap: 'wrap' }}>
          <button 
            type="button"
            onClick={() => { setIsMuted(!isMuted); showToast(isMuted ? 'Microphone unmuted' : 'Microphone muted', 'info'); }}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: isMuted ? 'var(--restrained-red)' : 'var(--pill-bg)', border: '1px solid var(--border-color)', color: isMuted ? '#fff' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <IconlyMicOff size={20} /> : <IconlyMic size={20} />}
          </button>

          <button 
            type="button"
            onClick={() => { setIsVideoOff(!isVideoOff); showToast(isVideoOff ? 'Camera turned on' : 'Camera turned off', 'info'); }}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: isVideoOff ? 'var(--restrained-red)' : 'var(--pill-bg)', border: '1px solid var(--border-color)', color: isVideoOff ? '#fff' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <IconlyVideoOff size={20} /> : <IconlyVideo size={20} />}
          </button>

          <button 
            type="button"
            onClick={() => { setIsScreenSharing(!isScreenSharing); showToast(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started', 'info'); }}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: isScreenSharing ? 'var(--primary-blue)' : 'var(--pill-bg)', border: '1px solid var(--border-color)', color: isScreenSharing ? '#fff' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            title="Share Screen"
          >
            <IconlyMonitor size={20} />
          </button>

          <button 
            type="button"
            onClick={handleEndCall}
            className="btn-primary"
            style={{ background: 'var(--restrained-red)', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', width: 'auto', padding: '10px 24px', height: 'auto', borderRadius: '9999px' }}
          >
            <IconlyPhoneOff size={18} />
            <span>End Telehealth Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
}
