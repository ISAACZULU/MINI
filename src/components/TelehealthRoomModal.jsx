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
    <div className="modal-overlay" style={{ zIndex: 900, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)' }}>
      <div style={{ maxWidth: '1200px', width: '95%', height: '90vh', background: 'var(--bg-canvas)', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)', overflow: 'hidden' }}>
        
        {/* Professional Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(0, 180, 108, 0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
            <div style={{ background: 'linear-gradient(135deg, var(--safety-green), #00d97a)', color: '#fff', padding: '8px', borderRadius: '12px', display: 'flex', flexShrink: 0 }}>
              <IconlyShield size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
                {activeTelehealthRoom.topic}
              </h2>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--safety-green)', animation: 'pulse 2s infinite' }}></span>
                  <strong style={{ color: 'var(--safety-green)' }}>Live Connection</strong>
                </span>
                <span>•</span>
                <span>Session #{activeTelehealthRoom.id.slice(-6)}</span>
                <span>•</span>
                <span>🔒 FERPA Verified</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <div style={{ background: 'var(--pill-bg)', border: '2px solid var(--primary-blue)', padding: '8px 16px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⏱️</span>
              {formatTimer(sessionSeconds)}
            </div>
            <button onClick={handleEndCall} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--pill-bg)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', hover: { background: 'var(--restrained-red)', color: '#fff' } }} title="Close session">
              <IconlyClose size={20} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', padding: '16px', overflow: 'hidden', minHeight: 0 }}>
          
          {/* Video Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: 0 }}>
            {/* Counselor Main Video Stream */}
            <div style={{ flex: 1, background: 'linear-gradient(135deg, var(--pill-bg) 0%, rgba(13, 110, 253, 0.05) 100%)', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
              {isScreenSharing ? (
                <div style={{ background: 'linear-gradient(135deg, var(--primary-blue), #0d6efd)', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: '20px', textAlign: 'center' }}>
                  <IconlyMonitor size={56} style={{ marginBottom: '12px', opacity: 0.9 }} />
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Screen Share Active</h4>
                  <p style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: '8px' }}>Presenting: 4-7-8 Breathing & Exam Resilience Slides</p>
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
              
              {/* Status Badge */}
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: isScreenSharing ? 'var(--primary-blue)' : 'var(--safety-green)', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fff', animation: 'pulse 2s infinite' }}></span>
                {isScreenSharing ? 'Sharing Screen' : 'Camera Feed'}
              </div>

              {/* Participant Label */}
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(10px)', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>
                🎓 Campus Counselor (Dr. Sarah Jenkins)
              </div>
            </div>

            {/* Student Preview Stream */}
            <div style={{ background: 'var(--pill-bg)', borderRadius: '12px', border: '1px solid var(--border-color)', padding: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: isVideoOff ? 'linear-gradient(135deg, var(--border-color), var(--text-muted))' : 'linear-gradient(135deg, var(--primary-blue), #0d6efd)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0, border: '2px solid var(--border-color)' }}>
                {isVideoOff ? <IconlyVideoOff size={24} /> : 'YOU'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h5 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-main)' }}>{activeTelehealthRoom.studentAlias}</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--card-bg)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    {isVideoOff ? '🎥 Camera Off' : '✓ Camera On'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--card-bg)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                    {isMuted ? '🔇 Muted' : '🎤 Mic Live'}
                  </span>
                </div>
                
                {/* Mic Level Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '12px' }}>
                  {isMuted ? (
                    <div style={{ width: '50px', height: '2px', backgroundColor: 'var(--restrained-red)', borderRadius: '1px', opacity: 0.6 }} title="Microphone muted" />
                  ) : (
                    <>
                      <div className="mic-bar bar-1" style={{ width: '2px', height: '4px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                      <div className="mic-bar bar-2" style={{ width: '2px', height: '7px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                      <div className="mic-bar bar-3" style={{ width: '2px', height: '6px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                      <div className="mic-bar bar-4" style={{ width: '2px', height: '8px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                      <div className="mic-bar bar-5" style={{ width: '2px', height: '5px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                      <div className="mic-bar bar-6" style={{ width: '2px', height: '6px', backgroundColor: 'var(--safety-green)', borderRadius: '1px' }}></div>
                    </>
                  )}
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 600 }}>You</div>
                <div>(Preview)</div>
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div style={{ background: 'var(--pill-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ background: 'var(--primary-blue)', color: '#fff', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <IconlyChat size={14} />
              </div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>Session Chat</h4>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: 'auto', background: 'var(--card-bg)', padding: '2px 6px', borderRadius: '4px' }}>🔒 Encrypted</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', paddingRight: '6px' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ background: 'var(--card-bg)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)', animation: 'slideIn 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
                    <span style={{ color: 'var(--primary-blue)' }}>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5, wordWrap: 'break-word' }}>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
              <input 
                type="text"
                placeholder="Type message..."
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', color: 'var(--text-main)', fontSize: '0.8rem', padding: '8px 12px', borderRadius: '8px', flex: 1, outline: 'none' }}
                value={newChatText}
                onChange={e => setNewChatText(e.target.value)}
              />
              <button type="submit" style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-blue)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', flexShrink: 0 }}>
                <IconlySend size={14} />
              </button>
            </form>
          </div>
        </div>

        {/* Professional Control Bar */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-color)', background: 'linear-gradient(to right, rgba(13, 110, 253, 0.02), rgba(0, 180, 108, 0.02))', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Mute/Unmute Button */}
          <button 
            type="button"
            onClick={() => { setIsMuted(!isMuted); showToast(isMuted ? 'Microphone unmuted' : 'Microphone muted', 'info'); }}
            style={{ width: '48px', height: '48px', borderRadius: '12px', background: isMuted ? 'var(--restrained-red)' : 'var(--pill-bg)', border: '2px solid ' + (isMuted ? 'var(--restrained-red)' : 'var(--border-color)'), color: isMuted ? '#fff' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: isMuted ? '0 4px 12px rgba(255, 71, 87, 0.3)' : 'none' }}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <IconlyMicOff size={22} /> : <IconlyMic size={22} />}
          </button>

          {/* Camera On/Off Button */}
          <button 
            type="button"
            onClick={() => { setIsVideoOff(!isVideoOff); showToast(isVideoOff ? 'Camera turned on' : 'Camera turned off', 'info'); }}
            style={{ width: '48px', height: '48px', borderRadius: '12px', background: isVideoOff ? 'var(--restrained-red)' : 'var(--pill-bg)', border: '2px solid ' + (isVideoOff ? 'var(--restrained-red)' : 'var(--border-color)'), color: isVideoOff ? '#fff' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: isVideoOff ? '0 4px 12px rgba(255, 71, 87, 0.3)' : 'none' }}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
          >
            {isVideoOff ? <IconlyVideoOff size={22} /> : <IconlyVideo size={22} />}
          </button>

          {/* Screen Share Button */}
          <button 
            type="button"
            onClick={() => { setIsScreenSharing(!isScreenSharing); showToast(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started', 'info'); }}
            style={{ width: '48px', height: '48px', borderRadius: '12px', background: isScreenSharing ? 'var(--primary-blue)' : 'var(--pill-bg)', border: '2px solid ' + (isScreenSharing ? 'var(--primary-blue)' : 'var(--border-color)'), color: isScreenSharing ? '#fff' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: isScreenSharing ? '0 4px 12px rgba(13, 110, 253, 0.3)' : 'none' }}
            title={isScreenSharing ? 'Stop Screen Share' : 'Share Screen'}
          >
            <IconlyMonitor size={22} />
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '32px', background: 'var(--border-color)', margin: '0 8px' }}></div>

          {/* End Call Button */}
          <button 
            type="button"
            onClick={handleEndCall}
            style={{ background: 'linear-gradient(135deg, var(--restrained-red), #ff4757)', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', width: 'auto', padding: '12px 28px', height: 'auto', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: 600, fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)' }}
          >
            <IconlyPhoneOff size={20} />
            <span>End Meeting</span>
          </button>

          {/* Status Indicators */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--safety-green)' }}></span>
              {isMuted ? 'Mic Muted' : 'Mic Active'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isVideoOff ? 'var(--restrained-red)' : 'var(--safety-green)' }}></span>
              {isVideoOff ? 'Camera Off' : 'Camera On'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
