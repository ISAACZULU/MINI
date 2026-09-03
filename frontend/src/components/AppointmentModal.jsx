import React, { useState, useEffect } from 'react';
import { IconlyClose, IconlyShield, IconlyCheckCircle, IconlySend } from './Iconly';
import { useApp } from '../context/AppContext';
import { fetchCounselors } from '../services/api';

export default function AppointmentModal() {
  const {
    isAppointmentModalOpen, setIsAppointmentModalOpen, handleBookAppointment, sessionHash, showToast, userAuth,
    setActiveTab: setPortalActiveTab, setSelectedChatCounselor, handleSendDirectMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'message'
  const [counselors, setCounselors] = useState([]);
  const [counselorId, setCounselorId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:45 AM');
  const [mode, setMode] = useState('Telehealth Video');
  const [topic, setTopic] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (!isAppointmentModalOpen) return;
    fetchCounselors()
      .then(({ counselors: list }) => {
        setCounselors(list);
        if (list.length > 0) setCounselorId(prev => prev || list[0].id);
      })
      .catch(err => showToast(err.message, 'warning'));
  }, [isAppointmentModalOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAppointmentModalOpen) return null;

  const selectedCounselor = counselors.find(c => c.id === counselorId);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!counselorId) {
      showToast('Please select a counselor.', 'warning');
      return;
    }

    if (activeTab === 'book') {
      handleBookAppointment(counselorId, date, timeSlot, topic, mode, isAnonymous);
    } else {
      const counselorName = selectedCounselor?.displayName || '';
      handleSendDirectMessage(counselorName, `Inquiry: ${topic}`, isAnonymous);
      setSelectedChatCounselor(counselorName);
      setPortalActiveTab('inbox');
      setIsAppointmentModalOpen(false);
      showToast(`Direct message chat started with ${counselorName.split(',')[0]}!`, 'success');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAppointmentModalOpen(false)}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '500px' }}>
        <div className="modal-header">
          <h3 className="modal-title">
            {activeTab === 'book' ? 'Book Confidential 1-on-1 Counseling' : 'Direct Message Counselor'}
          </h3>
          <button className="close-btn" onClick={() => setIsAppointmentModalOpen(false)}>
            <IconlyClose size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-body">
          {/* Tab Selector between Booking and DM */}
          <div style={{ display: 'flex', background: 'var(--pill-bg)', padding: '4px', borderRadius: '12px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('book')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'book' ? 'var(--card-bg)' : 'transparent',
                color: 'var(--text-main)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Book Appointment
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('message')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'message' ? 'var(--card-bg)' : 'transparent',
                color: 'var(--text-main)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Direct Message
            </button>
          </div>

          <div style={{ background: 'var(--safety-green-light)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--safety-green-dark)' }}>
            <IconlyShield size={18} style={{ flexShrink: 0 }} />
            <span>
              {isAnonymous
                ? `Protected session. Anonymous ID: ${sessionHash}`
                : `Verified connection. Account: ${userAuth?.displayName || 'Student'}`
              }
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Select Campus Specialist</label>
            <select className="form-select" value={counselorId} onChange={e => setCounselorId(e.target.value)} required>
              {counselors.length === 0 && <option value="">Loading counselors…</option>}
              {counselors.map(c => (
                <option key={c.id} value={c.id}>{c.displayName}{c.licenseId ? ` (${c.licenseId})` : ''}</option>
              ))}
            </select>
          </div>

          {activeTab === 'book' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().slice(0, 10)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Slot</label>
                  <select className="form-select" value={timeSlot} onChange={e => setTimeSlot(e.target.value)}>
                    <option value="09:00 AM - 09:45 AM">09:00 AM - 09:45 AM</option>
                    <option value="10:00 AM - 10:45 AM">10:00 AM - 10:45 AM</option>
                    <option value="01:00 PM - 01:45 PM">01:00 PM - 01:45 PM</option>
                    <option value="03:00 PM - 03:45 PM">03:00 PM - 03:45 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Session Format</label>
                <select className="form-select" value={mode} onChange={e => setMode(e.target.value)}>
                  <option value="Telehealth Video">Telehealth Video (join from Haven KNUST)</option>
                  <option value="In-Person">In-Person Session</option>
                </select>
              </div>

              {mode === 'In-Person' && (
                <div style={{ background: 'var(--pill-bg)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  📍 <strong>Location:</strong> Student Wellness Center, Room 302
                </div>
              )}
            </>
          ) : null}

          <div className="form-group">
            <label className="form-label">Primary Topic / Concern</label>
            <input type="text" className="form-input" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Exam panic, sleep issues" required style={{ width: '100%' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', background: 'var(--pill-bg)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <input
              type="checkbox"
              id="booking-anonymity-check"
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="booking-anonymity-check" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer', userSelect: 'none', fontWeight: 550 }}>
              Consult anonymously (hide real name and student ID)
            </label>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            {activeTab === 'book' ? (
              <>
                <IconlyCheckCircle size={16} />
                <span>Confirm Appointment Booking</span>
              </>
            ) : (
              <>
                <IconlySend size={16} />
                <span>Enter Chat</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
