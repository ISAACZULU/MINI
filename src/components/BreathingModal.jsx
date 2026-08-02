import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RefreshCw, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function BreathingModal() {
  const { isBreathingModalOpen, setIsBreathingModalOpen } = useApp();

  const [phase, setPhase] = useState('Inhale'); // 'Inhale' | 'Hold' | 'Exhale'
  const [seconds, setSeconds] = useState(4);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!isBreathingModalOpen || !isRunning) return;

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev > 1) return prev - 1;

        // Phase transitions: Inhale (4s) -> Hold (7s) -> Exhale (8s) -> Inhale (4s)
        if (phase === 'Inhale') {
          setPhase('Hold');
          return 7;
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          return 8;
        } else {
          setPhase('Inhale');
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingModalOpen, isRunning, phase]);

  if (!isBreathingModalOpen) return null;

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'Inhale':
        return 'Breathe in slowly through your nose...';
      case 'Hold':
        return 'Hold your breath gently...';
      case 'Exhale':
        return 'Exhale slowly through your mouth...';
      default:
        return '';
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsBreathingModalOpen(false)}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
            <Heart size={20} fill="#10b981" />
            <h3 className="modal-title">4-7-8 Guided Breathing Relief</h3>
          </div>
          <button className="close-btn" onClick={() => setIsBreathingModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '36px 24px' }}>
          {/* Animated Breathing Circle */}
          <div className="breathing-circle-container">
            <div className={`breathing-circle ${phase.toLowerCase()} ${isRunning ? 'animating' : ''}`}>
              <div className="breathing-timer-text">{seconds}s</div>
              <div className="breathing-phase-label">{phase}</div>
            </div>
          </div>

          <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '20px', marginBottom: '8px' }}>
            {getPhaseInstruction()}
          </p>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
            The 4-7-8 technique reduces heart rate and calms panic or anxiety symptoms in under 2 minutes.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button 
              className="btn-primary" 
              style={{ width: 'auto', padding: '10px 24px' }}
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <Pause size={16} /> : <Play size={16} />}
              <span>{isRunning ? 'Pause' : 'Resume'}</span>
            </button>

            <button 
              className="sub-nav-btn" 
              onClick={() => { setPhase('Inhale'); setSeconds(4); setIsRunning(true); }}
            >
              <RefreshCw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
