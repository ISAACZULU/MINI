import React, { useEffect, useState } from 'react';
import { IconlyShield, IconlyCheckCircle, IconlyAlert, IconlyUser } from './Iconly';
import { useApp } from '../context/AppContext';
import { fetchFlaggedPosts, clearFlag } from '../services/api';

export default function ModerationHub() {
  const { showToast, setActiveReplyPost, posts } = useApp();
  const [flaggedPosts, setFlaggedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const { flaggedPosts: data } = await fetchFlaggedPosts();
      setFlaggedPosts(data);
    } catch (err) {
      showToast(err.message, 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApproveThread = async (id, title) => {
    try {
      await clearFlag(id);
      setFlaggedPosts(prev => prev.filter(p => p.id !== id));
      showToast(`Thread "${title.substring(0, 20)}..." verified & approved`, 'success');
    } catch (err) {
      showToast(err.message, 'warning');
    }
  };

  const openThread = (flagged) => {
    const fullPost = posts.find(p => p.id === flagged.id);
    setActiveReplyPost(fullPost || flagged);
  };

  return (
    <div className="counselor-dashboard-container">
      <div className="counselor-header-card">
        <div className="counselor-header-title" style={{ margin: 0 }}>
          <div className="counselor-badge-icon" style={{ backgroundColor: 'var(--restrained-red-light)', color: 'var(--restrained-red)' }}>
            <IconlyShield size={28} />
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
            {isLoading ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading flagged threads...</p>
            ) : flaggedPosts.length > 0 ? (
              flaggedPosts.map(post => (
                <div key={post.id} className="triage-item-card" style={{ borderLeft: '4px solid var(--restrained-red)' }}>
                  <div className="triage-card-top">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="risk-badge badge-crisis" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <IconlyAlert size={13} />
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

                  <div className="triage-card-bottom">
                    <span className="triage-author">Student Hash: {post.author}</span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="sub-nav-btn"
                        style={{ fontSize: '0.8rem', padding: '4px 10px', color: 'var(--safety-green)' }}
                        onClick={() => handleApproveThread(post.id, post.title)}
                      >
                        <IconlyCheckCircle size={14} /> Clear Flag
                      </button>

                      <button
                        className="btn-primary"
                        style={{ width: 'auto', padding: '4px 12px', fontSize: '0.8rem' }}
                        onClick={() => openThread(post)}
                      >
                        <IconlyUser size={14} /> Provide Counselor Support
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <IconlyCheckCircle size={36} color="var(--safety-green)" style={{ marginBottom: '8px' }} />
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
