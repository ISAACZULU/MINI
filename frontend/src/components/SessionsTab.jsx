import React from 'react';
import { IconlyVideo, IconlyCalendar, IconlyCheckCircle } from './Iconly';
import { useApp } from '../context/AppContext';

export default function SessionsTab() {
  const { appointments, setActiveTelehealthRoom, setIsAppointmentModalOpen } = useApp();

  return (
    <div className="animate-fade-in">
      <div className="section-title-bar">
        <h3 className="section-heading">My Booked Sessions ({appointments.length})</h3>
        <button
          className="btn-primary"
          style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}
          onClick={() => setIsAppointmentModalOpen(true)}
        >
          + Book a Session
        </button>
      </div>

      {appointments.length > 0 ? (
        <div className="appointments-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginTop: '16px' }}>
          {appointments.map(appt => (
            <div key={appt.id} className="counselor-appt-card">
              <div className="counselor-appt-header">
                <span className="appt-mode-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <IconlyVideo size={13} />
                  {appt.mode}
                </span>
                <span className="appt-status-badge">
                  <IconlyCheckCircle size={12} style={{ marginRight: '4px' }} />
                  {appt.status}
                </span>
              </div>

              <h4 className="appt-topic">{appt.topic}</h4>

              <div className="appt-details">
                <div>
                  <span className="detail-label">Counselor:</span>
                  <strong>{appt.counselorName}</strong>
                </div>
                <div>
                  <span className="detail-label">Date & Time:</span>
                  <strong>{appt.date} ({appt.timeSlot})</strong>
                </div>
              </div>

              {appt.mode === 'Telehealth Video' ? (
                <button
                  type="button"
                  onClick={() => setActiveTelehealthRoom(appt)}
                  className="launch-telehealth-btn"
                  style={{ width: '100%', marginTop: '12px' }}
                >
                  <IconlyVideo size={14} />
                  <span>Join Session</span>
                </button>
              ) : (
                <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  📍 In-person: Student Wellness Center, Room 302
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state-box" style={{ marginTop: '16px' }}>
          <IconlyCalendar size={40} color="var(--text-subtle)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>No sessions booked yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
            Book a confidential 1-on-1 session with a campus counselor to get started.
          </p>
          <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsAppointmentModalOpen(true)}>
            + Book a Session
          </button>
        </div>
      )}
    </div>
  );
}
