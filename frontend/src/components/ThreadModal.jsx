import React, { useState } from 'react';
import { IconlyClose, IconlyHeart, IconlyShield, IconlyStar, IconlySend } from './Iconly';
import { useApp } from '../context/AppContext';
import { CANNED_COUNSELOR_RESPONSES, RISK_CONFIG } from '../types';

export default function ThreadModal() {
  const { 
    activeReplyPost, 
    setActiveReplyPost, 
    role, 
    handleToggleSupport, 
    handleAddReply,
    myPostIds,
    sessionHash,
    handleRevealIdentity
  } = useApp();

  const [replyText, setReplyText] = useState('');

  if (!activeReplyPost) return null;

  const riskMeta = RISK_CONFIG[activeReplyPost.riskAnalysis?.riskLevel] || RISK_CONFIG.LOW;

  const onSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    handleAddReply(activeReplyPost.id, replyText);
    setReplyText('');
  };

  const handleApplyCanned = (cannedText) => {
    setReplyText(cannedText);
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveReplyPost(null)}>
      <div className="modal-card modal-large" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '650px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span className="category-badge">
              <IconlyStar size={13} />
              {activeReplyPost.tag}
            </span>
            {role === 'counselor' && (
              <span 
                className={`risk-badge ${riskMeta.badgeClass}`}
                style={{ fontSize: '0.75rem', padding: '3px 8px' }}
              >
                {riskMeta.label}
              </span>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>by {activeReplyPost.author}</span>
          </div>
          <button className="close-btn" onClick={() => setActiveReplyPost(null)}>
            <IconlyClose size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Reveal Identity Banner (Safe Promotion) */}
          {myPostIds.includes(activeReplyPost.id) && activeReplyPost.author === sessionHash && (
            <div className="reveal-identity-banner" style={{ background: 'var(--pill-bg)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                <span style={{ fontWeight: 700, display: 'block', marginBottom: '2px', color: 'var(--primary-teal)' }}>Anonymous Thread Active</span>
                Feel safe enough to reveal your registered account name to counsellors and peers on this thread?
              </div>
              <button 
                onClick={() => handleRevealIdentity(activeReplyPost.id)}
                className="btn-primary"
                style={{ width: 'auto', padding: '8px 16px', fontSize: '0.8rem', height: '36px', flexShrink: 0 }}
              >
                Reveal Identity
              </button>
            </div>
          )}

          {/* Original Post Content */}
          <div className="thread-original-post">
            <p className="thread-content">{activeReplyPost.content}</p>
            
            <div className="thread-meta-bar">
              <button 
                className={`support-btn ${activeReplyPost.isSupported ? 'supported' : ''}`}
                onClick={(e) => handleToggleSupport(activeReplyPost.id, e)}
              >
                <IconlyHeart size={15} fill={activeReplyPost.isSupported ? 'var(--restrained-red)' : 'none'} style={{ color: activeReplyPost.isSupported ? 'var(--restrained-red)' : 'currentColor' }} />
                <span>{activeReplyPost.supportCount} supporting</span>
              </button>
              <span className="replies-count-label">{activeReplyPost.replies ? activeReplyPost.replies.length : 0} responses</span>
            </div>
          </div>

          {/* Counselor Response Helper (Visible in Counselor mode) */}
          {role === 'counselor' && (
            <div className="counselor-assistant-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--primary-teal)', fontWeight: 600, fontSize: '0.85rem' }}>
                <IconlyShield size={16} />
                <span>Verified Counselor Rapid Response Templates</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {CANNED_COUNSELOR_RESPONSES.map((canned, idx) => (
                  <button 
                    key={idx}
                    type="button"
                    className="canned-btn"
                    onClick={() => handleApplyCanned(canned.text)}
                  >
                    + {canned.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Replies List */}
          <h4 className="replies-section-header">Replies & Support</h4>
          <div className="thread-replies-list" style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {activeReplyPost.replies && activeReplyPost.replies.length > 0 ? (
              activeReplyPost.replies.map(reply => (
                <div 
                  key={reply.id} 
                  className={`reply-item ${reply.isCounselor ? 'counselor-reply-item' : ''}`}
                >
                  <div className="reply-header">
                    <div className="reply-author">
                      {reply.author}
                      {reply.isCounselor && <span className="counselor-badge">✓ Verified Counselor</span>}
                    </div>
                    <span className="reply-time">{reply.time}</span>
                  </div>
                  <p className="reply-content">{reply.text}</p>
                </div>
              ))
            ) : (
              <p className="no-replies-text">No responses yet. Be the first to offer words of encouragement!</p>
            )}
          </div>

          {/* Add Reply Form */}
          <form onSubmit={onSubmitReply} style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder={role === 'counselor' ? "Write verified counselor response..." : "Offer support anonymously..."}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              style={{ flexGrow: 1 }}
              required
            />
            <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 20px', height: 'auto' }}>
              <IconlySend size={15} />
              <span>Reply</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}