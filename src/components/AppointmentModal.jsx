import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AppointmentModal() {
  const { isAppointmentModalOpen, setIsAppointmentModalOpen, handleBookAppointment, sessionHash } = useApp();

  const [counselor, setCounselor] = useState('Dr. Sarah Jenkins, LCSW (Anxiety & Trauma)');
  const [date, setDate] = useState('2026-07-27');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:45 AM');
  const [mode, setMode] = useState('Telehealth Video (Private Room)');
  const [topic, setTopic] = useState('Exam Anxiety & Stress');

  if (!isAppointmentModalOpen) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    handleBookAppointment(counselor, date, timeSlot, topic, mode);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAppointmentModalOpen(false)}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 className="modal-title">Book Confidential 1-on-1 Counseling</h3>
          </div>
          <button className="close-btn" onClick={() => setIsAppointmentModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-body">
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '10px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#065f46' }}>
            <ShieldCheck size={18} />
            <span>Confidential session protected by FERPA. Student hash: <strong>{sessionHash}</strong></span>
          </div>

          <div className="form-group">
            <label className="form-label">Select Campus Specialist</label>
            <select className="form-select" value={counselor} onChange={e => setCounselor(e.target.value)}>
              <option value="Dr. Sarah Jenkins, LCSW (Anxiety & Trauma)">Dr. Sarah Jenkins, LCSW (Anxiety & Stress Specialist)</option>
              <option value="Dr. Mark Peterson, PsyD (Burnout & Depression)">Dr. Mark Peterson, PsyD (Burnout & Fatigue Specialist)</option>
              <option value="Counselor Alex Rivera, MSW (Academic & Relationships)">Counselor Alex Rivera, MSW (Student Life Specialist)</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
              <option value="Telehealth Video (Private Room)">Telehealth Video (Encrypted Room)</option>
              <option value="In-Person (Student Wellness Center Room 302)">In-Person (Student Wellness Center Rm 302)</option>
              <option value="Anonymous Chat Session">Anonymous Text/Chat Session</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Primary Topic / Concern</label>
            <input type="text" className="form-input" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Exam panic, sleep issues" required />
          </div>

          <button type="submit" className="btn-primary">
            <CheckCircle2 size={16} /> Confirm Appointment Booking
          </button>
        </form>
      </div>
    </div>
  );
}
