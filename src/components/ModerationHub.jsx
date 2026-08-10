import React from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ModerationHub() {
  const { posts, showToast, setActiveReplyPost } = useApp();

  // Filter posts that have high/crisis risk scores
  const flaggedPosts = posts.filter(p => p.riskAnalysis?.isCrisis || p.riskAnalysis?.riskLevel === 'HIGH');

  const handleApproveThread = (id, title) => {
    showToast(`Thread "${title.substring(0, 20)}..." verified & approved`, 'success');
  };

  return (
    <div className="counselor-dashboard-container">
      <div className="counselor-header-card">
        <div className="counselor-header-title" style={{ margin: 0 }}>
          <div className="counselor-badge-icon" style={{ backgroundColor: '#ffe4e6', color: '#e11d48' }}>
            <ShieldAlert size={28} />
          </div>
          <div>
            <h2 className="counselor-title-text">Automated Content Safety & Moderation Shield</h2>
            <p className="counselor-subtitle-text">Toxicity Scanning • Distress Trigger Auditing • Confidential Outreach Protocol</p>
          </div>
        </div>
      </div>

      <div className="counselor-main-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="triage-section">
          <div className="section-title-bar">
            <h3 className="section-heading">Flagged & Triaged Threads ({flaggedPosts.length})</h3>
          </div>

          <div className="triage-queue-list">
            {flaggedPosts.length > 0 ? (
              flaggedPosts.map(post => (
                <div key={post.id} className="triage-item-card" style={{ borderLeft: '4px solid #e11d48' }}>
                  <div className="triage-card-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="risk-badge badge-crisis">
                        <AlertTriangle size={13} />
                        {post.riskAnalysis?.riskLevel}
                      </span>
                      <span className="category-badge" style={{ margin: 0 }}>{post.tag}</span>
                    </div>

                    <span className="triage-score-pill">
                      AI Urgency Score: <strong>{post.riskAnalysis?.score}/100</strong>
                    </span>
                  </div>

                  <h4 className="triage-item-title">{post.title}</h4>
                  <p className="triage-item-body">{post.content}</p>

                  <div className="triage-triggers-tag" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="animate-icon-lock"><ShieldAlert size={14} /></span>
                    <span>AI Safety Detection Flags: {post.riskAnalysis?.triggers ? post.riskAnalysis.triggers.join(', ') : 'High emotional distress indicators'}</span>
                  </div>

                  <div className="triage-card-bottom">
                    <span className="triage-author">Student Hash: {post.author}</span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="sub-nav-btn" 
                        style={{ fontSize: '0.8rem', padding: '4px 10px', color: '#10b981' }}
                        onClick={() => handleApproveThread(post.id, post.title)}
                      >
                        <CheckCircle size={14} /> Clear Flag
                      </button>

                      <button 
                        className="btn-primary" 
                        style={{ width: 'auto', padding: '4px 12px', fontSize: '0.8rem' }}
                        onClick={() => setActiveReplyPost(post)}
                      >
                        <UserCheck size={14} /> Provide Counselor Support
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <CheckCircle size={36} color="#10b981" style={{ marginBottom: '8px' }} />
                <h4>Zero high-risk flags pending review</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Automated safety scanning active on all incoming peer posts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
