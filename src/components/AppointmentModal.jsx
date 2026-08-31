import React, { useState } from 'react';
import { IconlyClose, IconlyShield, IconlyCheckCircle, IconlyChat, IconlySend } from './Iconly';
import { useApp } from '../context/AppContext';
import { supabase } from '../services/supabase';

const COUNSELOR_LOCATIONS = {
  "Dr. Sarah Jenkins, LCSW (Anxiety & Trauma)": "Impact building ground floor",
  "Dr. Mark Peterson, PsyD (Burnout & Depression)": "College of Science 3rd floor",
  "Counselor Alex Rivera, MSW (Academic & Relationships)": "Impact building ground floor"
};

export default function AppointmentModal() {
  const { isAppointmentModalOpen, setIsAppointmentModalOpen, handleBookAppointment, sessionHash, showToast, userAuth, setActiveTab: setPortalActiveTab, setSelectedChatCounselor, handleSendDirectMessage } = useApp();

  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'message'
  const [counselor, setCounselor] = useState('Dr. Sarah Jenkins, LCSW (Anxiety & Trauma)');
  const [date, setDate] = useState('2026-07-27');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:45 AM');
  const [mode, setMode] = useState('In-Person'); // Default to In-Person
  const [topic, setTopic] = useState('Exam Anxiety & Stress');
  const [isAnonymous, setIsAnonymous] = useState(false); // Default to not anonymous

  if (!isAppointmentModalOpen) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'book') {
      const selectedLocation = mode === 'In-Person' ? (COUNSELOR_LOCATIONS[counselor] || 'Student Wellness Center Room 302') : 'Online (Zoom/Teams Link)';
      handleBookAppointment(
        counselor, 
        date, 
        timeSlot, 
        topic, 
        `${mode} (${selectedLocation})`
      );
    } else {
      handleSendDirectMessage(counselor, `Inquiry: ${topic}`, isAnonymous);
      setSelectedChatCounselor(counselor);
      setPortalActiveTab('inbox');
      setIsAppointmentModalOpen(false);
      showToast(`Direct message chat started with ${counselor.split(',')[0]}!`, 'success');
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAppointmentModalOpen(false)}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '500px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="modal-title">
              {activeTab === 'book' ? 'Book Confidential 1-on-1 Counseling' : 'Direct Message Counselor'}
            </h3>
          </div>
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
            <select className="form-select" value={counselor} onChange={e => setCounselor(e.target.value)}>
              <option value="Dr. Sarah Jenkins, LCSW (Anxiety & Trauma)">Dr. Sarah Jenkins, LCSW (Anxiety & Stress Specialist)</option>
              <option value="Dr. Mark Peterson, PsyD (Burnout & Depression)">Dr. Mark Peterson, PsyD (Burnout & Fatigue Specialist)</option>
              <option value="Counselor Alex Rivera, MSW (Academic & Relationships)">Counselor Alex Rivera, MSW (Student Life Specialist)</option>
            </select>
          </div>

          {activeTab === 'book' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} required />
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
                  <option value="In-Person">In-Person Session</option>
                  <option value="Online Session (Zoom/Teams Link)">Online Session (Zoom/Microsoft Teams Link)</option>
                </select>
              </div>

              {mode === 'In-Person' && (
                <div style={{ background: 'var(--pill-bg)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  📍 <strong>Assigned Location:</strong> {COUNSELOR_LOCATIONS[counselor] || 'Student Wellness Center Room 302'}
                </div>
              )}
            </>
          ) : null}

          <div className="form-group">
            <label className="form-label">Primary Topic / Concern</label>
            <input type="text" className="form-input" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Exam panic, sleep issues" required style={{ width: '100%' }} />
          </div>

          {/* Anonymity Toggle Checkbox */}
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
