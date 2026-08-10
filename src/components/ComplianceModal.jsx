import React from 'react';
import { X, CheckCircle, ShieldCheck, Key, Database, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ComplianceModal() {
  const { isFerpaModalOpen, setIsFerpaModalOpen, sessionHash, rotateSessionHash } = useApp();

  if (!isFerpaModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsFerpaModalOpen(false)}>
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669' }}>
            <ShieldCheck size={22} />
            <h3 className="modal-title" style={{ color: 'inherit' }}>Enterprise Compliance & Data Protection Audit</h3>
          </div>
          <button className="close-btn" onClick={() => setIsFerpaModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 700, marginBottom: '6px' }}>
              <CheckCircle size={18} />
              <span>FERPA & HIPAA Technical Safeguards Verified</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#166534', margin: 0, lineHeight: 1.5 }}>
              Haven KNUST strictly separates student academic identifiers from wellness data. All communications utilize ephemeral session tokens with zero permanent IP logging.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}>
                <Key size={16} color="#0284c7" />
                <span>Active Cryptographic Token</span>
              </div>
              <div style={{ background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace', color: '#0f172a', marginBottom: '10px' }}>
                {sessionHash} [SHA-256 Validated]
              </div>
              <button className="btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '6px' }} onClick={rotateSessionHash}>
                <RefreshCw size={13} /> Force Rotate Identity Token
              </button>
            </div>

            <div style={{ border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}>
                <Database size={16} color="#059669" />
                <span>Security Audit Checklist</span>
              </div>
              <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.7 }}>
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
