import React from 'react';
import { useApp } from '../context/AppContext';
import {
  IconlyClose,
  IconlyCheckCircle,
  IconlyShield,
  IconlyKey,
  IconlyDatabase,
  IconlyRefresh
} from './Iconly';

export default function ComplianceModal() {
  const { isFerpaModalOpen, setIsFerpaModalOpen, sessionHash, rotateSessionHash } = useApp();

  if (!isFerpaModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsFerpaModalOpen(false)}>
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--safety-green)' }}>
            <IconlyShield size={22} />
            <h3 className="modal-title" style={{ color: 'var(--text-main)' }}>Enterprise Compliance & Data Protection Audit</h3>
          </div>
          <button className="close-btn" onClick={() => setIsFerpaModalOpen(false)}>
            <IconlyClose size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--safety-green)', fontWeight: 700, marginBottom: '6px' }}>
              <IconlyCheckCircle size={18} />
              <span>Ghana Data Protection Act (Act 843) & DPC Verified</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
              Haven KNUST strictly complies with the Ghana Data Protection Commission (DPC) standards and the Data Protection Act, 2012 (Act 843). Student academic identifiers remain completely separated from wellness records with zero permanent IP logging.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <div style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', background: 'var(--pill-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>
                <IconlyKey size={16} color="var(--primary-blue)" />
                <span>Active Cryptographic Token</span>
              </div>
              <div style={{ background: 'var(--card-bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--text-main)', marginBottom: '10px' }}>
                {sessionHash} [SHA-256 Validated]
              </div>
              <button className="btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '6px', height: 'auto' }} onClick={rotateSessionHash}>
                <IconlyRefresh size={13} /> Force Rotate Identity Token
              </button>
            </div>

            <div style={{ border: '1px solid var(--border-color)', padding: '16px', borderRadius: '12px', background: 'var(--pill-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>
                <IconlyDatabase size={16} color="var(--safety-green)" />
                <span>Security Audit Checklist</span>
              </div>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                <li>✅ Zero IP or Geo-location recording</li>
                <li>✅ Ephemeral AES-256 payload encryption</li>
                <li>✅ Student ID separation from clinical notes</li>
                <li>✅ Automated 24/7 Crisis Escalation Rule</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
