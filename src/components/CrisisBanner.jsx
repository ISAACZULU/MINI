import React from 'react';
import { IconlyAlert, IconlyPhone, IconlyShield } from './Iconly';
import { useApp } from '../context/AppContext';

export default function CrisisBanner() {
  const { setIsCrisisModalOpen } = useApp();

  return (
    <div className="crisis-safety-bar">
      <div className="crisis-bar-inner">
        <div className="crisis-left">
          <div className="pulse-alert-icon">
            <IconlyAlert size={18} />
          </div>
          <div>
            <span className="crisis-title">Need immediate emergency or crisis support?</span>
            <span className="crisis-sub">Campus helpline is free, confidential & available 24/7.</span>
          </div>
        </div>

        <div className="crisis-right">
          <a href="tel:18005550199" className="crisis-action-btn primary">
            <IconlyPhone size={14} />
            <span>Call 1-800-555-0199</span>
          </a>
          <button className="crisis-action-btn secondary" onClick={() => setIsCrisisModalOpen(true)}>
            <IconlyShield size={14} />
            <span>View Emergency Resources</span>
          </button>
        </div>
      </div>
    </div>
  );
}
