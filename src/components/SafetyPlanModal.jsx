import React, { useState } from 'react';
import { X, Shield, Phone, Heart, Home, Save, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SafetyPlanModal() {
  const { 
    isSafetyPlanModalOpen, 
    setIsSafetyPlanModalOpen, 
    safetyPlan, 
    handleSaveSafetyPlan, 
    sessionHash, 
    showToast 
  } = useApp();

  const [trustedContact, setTrustedContact] = useState(safetyPlan?.trustedContact || 'Campus Wellness Advisor (Room 302)');
  const [copingStrategy, setCopingStrategy] = useState(safetyPlan?.copingStrategy || '4-7-8 Box Breathing & 5-minute walk');
  const [safePlace, setSafePlace] = useState(safetyPlan?.safePlace || 'Library 3rd Floor Quiet Corner');
  const [affirmation, setAffirmation] = useState(safetyPlan?.affirmation || 'I am resilient, and this exam stress is temporary.');

  if (!isSafetyPlanModalOpen) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    handleSaveSafetyPlan({
      trustedContact,
      copingStrategy,
      safePlace,
      affirmation
    });
  };

  const handlePrintPlan = () => {
    window.print();
    showToast('Safety net plan sent to printer view', 'info');
  };

  return (
    <div className="modal-overlay" onClick={() => setIsSafetyPlanModalOpen(false)}>
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
            <Shield size={20} />
            <h3 className="modal-title" style={{ color: 'inherit' }}>Personal Emergency Safety Net Plan</h3>
          </div>
          <button className="close-btn" onClick={() => setIsSafetyPlanModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-body">
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.85rem', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>🔒 Confidential personal safety plan bound to Session Hash: <strong>{sessionHash}</strong></span>
            <button type="button" onClick={handlePrintPlan} style={{ background: '#ffffff', color: '#065f46', border: '1px solid #a7f3d0', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Printer size={13} /> Print Safety Card
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} color="#0284c7" /> 1. Trusted Support Contact
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={trustedContact} 
                onChange={e => setTrustedContact(e.target.value)} 
                placeholder="e.g. Roommate Sarah or Campus Counselor" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={15} color="#e11d48" /> 2. Key Coping Technique
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={copingStrategy} 
                onChange={e => setCopingStrategy(e.target.value)} 
                placeholder="e.g. 4-7-8 Breathing or Listening to Music" 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Home size={15} color="#d97706" /> 3. Safe Physical Environment
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={safePlace} 
                onChange={e => setSafePlace(e.target.value)} 
                placeholder="e.g. Campus Wellness Lounge Room 104" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={15} color="#10b981" /> 4. Personal Affirmation
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={affirmation} 
                onChange={e => setAffirmation(e.target.value)} 
                placeholder="e.g. I am safe and this panic will pass." 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary">
            <Save size={15} /> Save Personal Safety Net Card
          </button>
        </form>
      </div>
    </div>
  );
}
