import React, { useState, useEffect } from 'react';
import { IconlyClose, IconlyLock, IconlySend, IconlyCheckCircle, IconlyAlert } from './Iconly';
import { useApp } from '../context/AppContext';
import { CATEGORIES, RISK_CONFIG } from '../types';
import { analyzeTextRisk } from '../utils/riskAnalyzer';

export default function CreatePostModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, handleCreatePost, sessionHash, userAuth } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Anxiety');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [liveRisk, setLiveRisk] = useState(analyzeTextRisk('', ''));

  // Live real-time distress safety analysis as student types
  useEffect(() => {
    setLiveRisk(analyzeTextRisk(title, content));
  }, [title, content]);

  if (!isCreateModalOpen) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    handleCreatePost(title, content, tag, isAnonymous);
    setTitle('');
    setContent('');
  };

  const riskMeta = RISK_CONFIG[liveRisk.riskLevel] || RISK_CONFIG.LOW;

  return (
    <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '500px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 className="modal-title">Create a New Thread</h3>
          </div>
          <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>
            <IconlyClose size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-body">
          {/* Anonymity Toggle Checkbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--pill-bg)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
            <input 
              type="checkbox" 
              id="is-anonymous-checkbox" 
              checked={isAnonymous}
              onChange={e => setIsAnonymous(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer', margin: 0 }}
            />
            <label htmlFor="is-anonymous-checkbox" style={{ fontSize: '0.85rem', fontWeight: 550, color: 'var(--text-main)', cursor: 'pointer', userSelect: 'none', flexGrow: 1 }}>
              Post anonymously as <code style={{ color: 'var(--primary-teal)', fontFamily: 'monospace' }}>{sessionHash}</code>
            </label>
          </div>

          {isAnonymous && (
            <div className="privacy-banner" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '8px', color: 'var(--safety-green)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              <IconlyLock size={16} style={{ flexShrink: 0 }} />
              <span>Identity protected. No student ID or name is logged to this thread.</span>
            </div>
          )}

          {!isAnonymous && (
            <div className="privacy-banner" style={{ background: 'rgba(50, 121, 249, 0.05)', border: '1px solid rgba(50, 121, 249, 0.2)', padding: '12px', borderRadius: '8px', color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
              <IconlyLock size={16} style={{ flexShrink: 0 }} />
              <span>Posting as <strong style={{ color: 'var(--primary-teal)' }}>{userAuth?.displayName || 'Student'}</strong>. Your name will be visible to peers and counsellors.</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Topic Category</label>
            <select 
              className="form-select"
              value={tag} 
              onChange={e => setTag(e.target.value)}
              style={{ width: '100%' }}
            >
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input 
              type="text"
              className="form-input"
              placeholder="What's on your mind?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{ width: '100%' }}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Details</label>
            <textarea 
              className="form-textarea"
              placeholder="Express your thoughts freely..."
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{ width: '100%', minHeight: '120px' }}
              required
            />
          </div>

          {/* Real-time AI Safety Triage Indicator */}
          {(title || content) && (
            <div 
              className={`ai-live-triage-card ${riskMeta.badgeClass}`}
              style={{
                background: riskMeta.bgColor,
                borderColor: riskMeta.borderColor,
                color: riskMeta.color,
                padding: '12px',
                borderRadius: '10px',
                marginBottom: '16px',
                fontSize: '0.85rem',
                border: '1px solid'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {liveRisk.isCrisis ? <IconlyAlert size={15} /> : <IconlyCheckCircle size={15} />}
                  AI Safety Analysis: {riskMeta.label}
                </span>
                <span style={{ fontWeight: 600 }}>Score: {liveRisk.score}/100</span>
              </div>
              <p style={{ margin: 0, opacity: 0.9 }}>{liveRisk.recommendation}</p>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            <IconlySend size={16} />
            <span>{isAnonymous ? 'Post Anonymously' : 'Post Identified'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
