import React, { useState, useEffect } from 'react';
import { X, Lock, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, RISK_CONFIG } from '../types';
import { analyzeTextRisk } from '../utils/riskAnalyzer';

export default function CreatePostModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, handleCreatePost, sessionHash } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Anxiety');
  const [liveRisk, setLiveRisk] = useState(analyzeTextRisk('', ''));

  // Live real-time distress safety analysis as student types
  useEffect(() => {
    setLiveRisk(analyzeTextRisk(title, content));
  }, [title, content]);

  if (!isCreateModalOpen) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    handleCreatePost(title, content, tag);
    setTitle('');
    setContent('');
  };

  const riskMeta = RISK_CONFIG[liveRisk.riskLevel] || RISK_CONFIG.LOW;

  return (
    <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h3 className="modal-title">Share Anonymously</h3>
            <span className="anon-hash-badge">{sessionHash}</span>
          </div>
          <button className="close-btn" onClick={() => setIsCreateModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-body">
          <div className="privacy-banner">
            <Lock size={16} />
            <span>Identity protected via SHA-256 session hash rotation. No student ID or IP is logged.</span>
          </div>

          <div className="form-group">
            <label className="form-label">Topic Category</label>
            <select 
              className="form-select"
              value={tag} 
              onChange={e => setTag(e.target.value)}
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
                  {liveRisk.isCrisis ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
                  AI Safety Analysis: {riskMeta.label}
                </span>
                <span style={{ fontWeight: 600 }}>Score: {liveRisk.score}/100</span>
              </div>
              <p style={{ margin: 0, opacity: 0.9 }}>{liveRisk.recommendation}</p>
            </div>
          )}

          <button type="submit" className="btn-primary">
            <Send size={16} /> Post Anonymously
          </button>
        </form>
      </div>
    </div>
  );
}
