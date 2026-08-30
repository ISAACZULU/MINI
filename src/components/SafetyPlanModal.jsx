import React, { useState } from 'react';
import { 
  IconlyClose, 
  IconlyShield, 
  IconlyPhone, 
  IconlyHeart, 
  IconlyHome, 
  IconlySave, 
  IconlyPrinter, 
  IconlyLock 
} from './Iconly';
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
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '650px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--safety-green)' }}>
            <IconlyShield size={20} />
            <h3 className="modal-title" style={{ color: 'inherit' }}>Personal Emergency Safety Net Plan</h3>
          </div>
          <button className="close-btn" onClick={() => setIsSafetyPlanModalOpen(false)}>
            <IconlyClose size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-body">
          <div style={{ background: 'var(--safety-green-light)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '10px', marginBottom: '18px', fontSize: '0.85rem', color: 'var(--safety-green-dark)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="animate-icon-lock"><IconlyLock size={13} /></span>
              <span>Confidential personal safety plan bound to Session Hash: <strong>{sessionHash}</strong></span>
            </span>
            <button type="button" onClick={handlePrintPlan} style={{ background: '#ffffff', color: 'var(--safety-green-dark)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '6px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <IconlyPrinter size={13} /> 
              <span>Print Safety Card</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconlyPhone size={15} color="var(--primary-blue)" /> 
                <span>1. Trusted Support Contact</span>
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={trustedContact} 
                onChange={e => setTrustedContact(e.target.value)} 
                style={{ width: '100%' }}
                placeholder="e.g. Roommate Sarah or Campus Counselor" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconlyHeart size={15} color="var(--restrained-red)" /> 
                <span>2. Key Coping Technique</span>
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={copingStrategy} 
                onChange={e => setCopingStrategy(e.target.value)} 
                style={{ width: '100%' }}
                placeholder="e.g. 4-7-8 Breathing or Listening to Music" 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconlyHome size={15} color="var(--alert-yellow)" /> 
                <span>3. Safe Physical Environment</span>
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={safePlace} 
                onChange={e => setSafePlace(e.target.value)} 
                style={{ width: '100%' }}
                placeholder="e.g. Campus Wellness Lounge Room 104" 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconlyShield size={15} color="var(--safety-green)" /> 
                <span>4. Personal Affirmation</span>
              </label>
              <input 
                type="text" 
                className="form-input" 
                value={affirmation} 
                onChange={e => setAffirmation(e.target.value)} 
                style={{ width: '100%' }}
                placeholder="e.g. I am safe and this panic will pass." 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            <IconlySave size={15} /> 
            <span>Save Personal Safety Net Card</span>
          </button>
        </form>
      </div>
    </div>
  );
}
