import React, { useState } from 'react';
import { 
  IconlyShield, 
  IconlyAlert, 
  IconlyClock, 
  IconlyCalendar, 
  IconlyVideo, 
  IconlyCheckCircle,
  IconlyClose,
  IconlyChat 
} from './Iconly';
import { useApp } from '../context/AppContext';
import { RISK_CONFIG } from '../types';
import InboxTab from './InboxTab';

export default function CounselorDashboard() {
  const { 
    posts, 
    appointments, 
    setActiveReplyPost, 
    setIsAppointmentModalOpen, 
    setActiveTelehealthRoom, 
    handlePublishArticle, 
    handlePublishGoodwill,
    directChats,
    userAuth,
    setSelectedChatCounselor
  } = useApp();

  const [activeSection, setActiveSection] = useState('triage'); // 'triage' | 'inbox'
  const [triageFilter, setTriageFilter] = useState('ALL'); // 'ALL' | 'CRISIS' | 'HIGH' | 'MODERATE'
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishType, setPublishType] = useState('article'); // 'article' | 'goodwill'

  // Form states for article
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState('Burnout');
  const [articleReadTime, setArticleReadTime] = useState('4 min read');
  const [articleAuthor, setArticleAuthor] = useState('');
  const [articleSummary, setArticleSummary] = useState('');
  const [articleContent, setArticleContent] = useState('');

  // Form states for goodwill
  const [goodwillText, setGoodwillText] = useState('');
  const [goodwillAuthor, setGoodwillAuthor] = useState('');
  const [goodwillRole, setGoodwillRole] = useState('');

  const onSubmitArticle = (e) => {
    e.preventDefault();
    handlePublishArticle({
      title: articleTitle,
      category: articleCategory,
      readTime: articleReadTime,
      author: articleAuthor,
      summary: articleSummary,
      content: articleContent
    });
    setArticleTitle('');
    setArticleAuthor('');
    setArticleSummary('');
    setArticleContent('');
    setIsPublishModalOpen(false);
  };

  const onSubmitGoodwill = (e) => {
    e.preventDefault();
    handlePublishGoodwill({
      text: goodwillText,
      author: goodwillAuthor,
      role: goodwillRole
    });
    setGoodwillText('');
    setGoodwillAuthor('');
    setGoodwillRole('');
    setIsPublishModalOpen(false);
  };

  // Sort posts by AI Risk Score descending (highest urgency first)
  const sortedPosts = [...posts].sort((a, b) => {
    const scoreA = a.riskAnalysis?.score || 0;
    const scoreB = b.riskAnalysis?.score || 0;
    return scoreB - scoreA;
  });

  const filteredPosts = sortedPosts.filter(p => {
    // If another counselor already responded, that thread shouldn't show in the current counselor's feed.
    const hasCounselorReplied = p.replies && p.replies.some(r => r.isCounselor);
    if (hasCounselorReplied) return false;

    if (triageFilter === 'ALL') return true;
    return p.riskAnalysis?.riskLevel === triageFilter;
  });

  // Count active (unanswered) items for accurate header counters
  const activePosts = posts.filter(p => {
    const hasCounselorReplied = p.replies && p.replies.some(r => r.isCounselor);
    return !hasCounselorReplied;
  });

  const crisisCount = activePosts.filter(p => p.riskAnalysis?.riskLevel === 'CRISIS').length;
  const highRiskCount = activePosts.filter(p => p.riskAnalysis?.riskLevel === 'HIGH').length;

  // Direct chats count for the currently logged-in counselor
  const myChats = (directChats || []).filter(chat => {
    if (!chat || !chat.counselorName) return false;
    const email = userAuth?.email?.toLowerCase() || '';
    const name = userAuth?.displayName?.toLowerCase() || '';
    const cName = (chat.counselorName || '').toLowerCase();
    if (email.includes('jenkins') || name.includes('jenkins')) {
      return cName.includes('jenkins');
    }
    if (email.includes('peterson') || name.includes('peterson')) {
      return cName.includes('peterson');
    }
    if (email.includes('rivera') || name.includes('rivera')) {
      return cName.includes('rivera');
    }
    const lastName = name.split(' ')[1]?.toLowerCase() || '';
    if (lastName && cName.includes(lastName)) {
      return true;
    }
    return cName.includes('jenkins');
  });

  return (
    <div className="counselor-dashboard-container">
      {/* Dashboard Top Header & Stats Cards */}
      <div className="counselor-header-card">
        <div className="counselor-header-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 className="counselor-title-text">Counselor Center</h2>
            <p className="counselor-subtitle-text">Verified Counselor Portal</p>
          </div>
          <button 
            className="btn-primary" 
            style={{ width: 'auto', padding: '10px 20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            onClick={() => setIsPublishModalOpen(true)}
          >
            <span>+ Publish Content</span>
          </button>
        </div>

        {/* Key Metrics grid */}
        <div className="counselor-metrics-grid">
          <div className="metric-box metric-crisis">
            <div className="metric-icon">
              <IconlyAlert size={20} />
            </div>
            <div>
              <span className="metric-value">{crisisCount}</span>
              <span className="metric-label">Immediate Crisis Signals</span>
            </div>
          </div>

          <div className="metric-box metric-high">
            <div className="metric-icon">
              <IconlyAlert size={20} />
            </div>
            <div>
              <span className="metric-value">{highRiskCount}</span>
              <span className="metric-label">High Distress Threads</span>
            </div>
          </div>

          <div className="metric-box metric-appointments">
            <div className="metric-icon">
              <IconlyCalendar size={20} />
            </div>
            <div>
              <span className="metric-value">{appointments.length}</span>
              <span className="metric-label">Booked Telehealth Sessions</span>
            </div>
          </div>

          <div 
            className="metric-box metric-speed"
            style={{ 
              cursor: 'pointer', 
              transition: 'all 0.2s', 
              border: activeSection === 'inbox' ? '2px solid var(--primary-teal)' : '1px solid var(--border-color)',
              background: activeSection === 'inbox' ? 'var(--pill-bg)' : undefined
            }}
            onClick={() => setActiveSection('inbox')}
            title="Click to switch to Direct Messages / Student Inquiries"
          >
            <div className="metric-icon" style={{ color: 'var(--primary-teal)' }}>
              <IconlyChat size={20} />
            </div>
            <div>
              <span className="metric-value">{myChats.length}</span>
              <span className="metric-label">Direct Student Inquiries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Triage Queue & Appointments OR Direct Messages */}
      <div className="counselor-main-grid" style={{ gridTemplateColumns: activeSection === 'inbox' ? '1fr' : undefined }}>
        {/* Left Column: Risk-Sorted Triage Queue OR Direct Messages */}
        <div className="triage-section" style={{ minWidth: 0 }}>
          {/* Main Left Pane Tab Bar: Triage Queue vs. Direct Messages */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: 'var(--pill-bg)', padding: '5px', borderRadius: '14px' }}>
            <button
              type="button"
              onClick={() => setActiveSection('triage')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeSection === 'triage' ? 'var(--card-bg)' : 'transparent',
                color: activeSection === 'triage' ? 'var(--primary-teal)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: activeSection === 'triage' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <IconlyAlert size={16} />
              <span>AI-Triaged Threads ({filteredPosts.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('inbox')}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '10px',
                border: 'none',
                background: activeSection === 'inbox' ? 'var(--card-bg)' : 'transparent',
                color: activeSection === 'inbox' ? 'var(--primary-teal)' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: activeSection === 'inbox' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <IconlyChat size={16} />
              <span>Direct Messages ({myChats.length})</span>
            </button>
          </div>

          {activeSection === 'triage' ? (
            <>
              <div className="section-title-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 className="section-heading">AI-Triaged Student Threads ({filteredPosts.length})</h3>
                </div>

                {/* Filter buttons */}
                <div className="triage-filter-group" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <button 
                    className={`filter-btn ${triageFilter === 'ALL' ? 'active' : ''}`}
                    onClick={() => setTriageFilter('ALL')}
                  >
                    All ({posts.length})
                  </button>
                  <button 
                    className={`filter-btn crisis ${triageFilter === 'CRISIS' ? 'active' : ''}`}
                    onClick={() => setTriageFilter('CRISIS')}
                  >
                    Crisis ({crisisCount})
                  </button>
                  <button 
                    className={`filter-btn high ${triageFilter === 'HIGH' ? 'active' : ''}`}
                    onClick={() => setTriageFilter('HIGH')}
                  >
                    High Risk ({highRiskCount})
                  </button>
                </div>
              </div>

              <div className="triage-queue-list">
                {filteredPosts.length > 0 ? (
                  filteredPosts.map(post => {
                    const riskMeta = RISK_CONFIG[post.riskAnalysis?.riskLevel] || RISK_CONFIG.LOW;
                    const hasCounselorReplied = post.replies && post.replies.some(r => r.isCounselor);

                    return (
                      <div key={post.id} className="triage-item-card">
                        <div className="triage-card-top">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`risk-badge ${riskMeta.badgeClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <IconlyAlert size={13} />
                              {riskMeta.label}
                            </span>
                            <span className="category-badge" style={{ margin: 0 }}>{post.tag}</span>
                          </div>

                          <span className="triage-score-pill">
                            Risk Score: <strong>{post.riskAnalysis?.score || 15}/100</strong>
                          </span>
                        </div>

                        <h4 className="triage-item-title">{post.title}</h4>
                        <p className="triage-item-body">{post.content}</p>

                        {post.riskAnalysis?.triggers && post.riskAnalysis.triggers.length > 0 && (
                          <div className="triage-triggers-tag">
                            ⚠️ Detected triggers: {post.riskAnalysis.triggers.join(', ')}
                          </div>
                        )}

                        <div className="triage-card-bottom">
                          <span className="triage-author">
                            Posted by {post.author} • {post.timeAgo}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {hasCounselorReplied ? (
                              <span className="counselor-status-done" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <IconlyCheckCircle size={13} /> Counselor Responded
                              </span>
                            ) : (
                              <span className="counselor-status-pending">
                                Pending Triage
                              </span>
                            )}

                            <button 
                              className="btn-primary" 
                              style={{ width: 'auto', padding: '6px 14px', fontSize: '0.85rem' }}
                              onClick={() => setActiveReplyPost(post)}
                            >
                              Respond
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', background: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <IconlyCheckCircle size={36} color="var(--safety-green)" style={{ marginBottom: '8px' }} />
                    <h4>No threads under selected filter</h4>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ minHeight: '600px', height: 'calc(100vh - 280px)' }}>
              <InboxTab />
            </div>
          )}
        </div>

        {/* Right Column: Scheduled Telehealth Sessions (visible when activeSection is triage) */}
        {activeSection === 'triage' && (
          <div className="appointments-section">
            <div className="section-title-bar">
              <h3 className="section-heading">Confirmed Telehealth Sessions ({appointments.length})</h3>
              <button 
                className="btn-primary" 
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => setIsAppointmentModalOpen(true)}
              >
                + Schedule Session
              </button>
            </div>

            <div className="appointments-list">
              {appointments.length > 0 ? (
                appointments.map(appt => (
                  <div key={appt.id} className="counselor-appt-card">
                    <div className="counselor-appt-header">
                      <span className="appt-mode-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <IconlyVideo size={13} />
                        {appt.mode}
                      </span>
                      <span className="appt-status-badge">{appt.status}</span>
                    </div>

                    <h4 className="appt-topic">{appt.topic}</h4>

                    <div className="appt-details">
                      <div>
                        <span className="detail-label">Student Session Hash:</span>
                        <strong style={{ fontFamily: 'monospace' }}>{appt.studentAlias}</strong>
                      </div>
                      <div>
                        <span className="detail-label">Assigned Specialist:</span>
                        <strong>{appt.counselorName}</strong>
                      </div>
                      <div>
                        <span className="detail-label">Date & Time:</span>
                        <strong>{appt.date} ({appt.timeSlot})</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <button 
                        type="button"
                        onClick={() => {
                          if (appt.meetingUrl) {
                            setActiveTelehealthRoom(appt); // Open embedded modal instead of new tab
                            return;
                          }
                          setActiveTelehealthRoom(appt);
                        }}
                        className="launch-telehealth-btn"
                        style={{ flex: 1, margin: 0 }}
                      >
                        <IconlyVideo size={14} />
                        <span>Launch Live Telehealth Meeting</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedChatCounselor(appt.counselorName);
                          setActiveSection('inbox');
                        }}
                        className="btn-secondary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                        title="Open direct message chat with student"
                      >
                        <IconlyChat size={14} />
                        <span>Chat</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontStyle: 'italic', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>No upcoming appointment sessions booked.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Publish Content Modal */}
      {isPublishModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPublishModalOpen(false)}>
          <div className="modal-card modal-large" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '650px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3 className="modal-title">Publish Daily Encouragements & Articles</h3>
              <button className="close-btn" onClick={() => setIsPublishModalOpen(false)}>
                <IconlyClose size={20} />
              </button>
            </div>

            <div className="modal-body" style={{ overflowY: 'auto', padding: '24px' }}>
              {/* Toggle switch between Article and Goodwill */}
              <div style={{ display: 'flex', background: 'var(--pill-bg)', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => setPublishType('article')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: publishType === 'article' ? 'var(--card-bg)' : 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: publishType === 'article' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Psychoeducational Article
                </button>
                <button
                  type="button"
                  onClick={() => setPublishType('goodwill')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: publishType === 'goodwill' ? 'var(--card-bg)' : 'transparent',
                    color: 'var(--text-main)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: publishType === 'goodwill' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Daily Goodwill Message
                </button>
              </div>

              {publishType === 'article' ? (
                <form onSubmit={onSubmitArticle}>
                  <div className="form-group">
                    <label className="form-label">Article Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Recognizing Signs of Clinical Burnout"
                      value={articleTitle}
                      onChange={e => setArticleTitle(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Topic Category</label>
                      <select
                        className="form-select"
                        value={articleCategory}
                        onChange={e => setArticleCategory(e.target.value)}
                        style={{ width: '100%' }}
                      >
                        <option value="Burnout">Burnout</option>
                        <option value="Anxiety">Anxiety</option>
                        <option value="Sleep">Sleep</option>
                        <option value="Academic pressure">Academic pressure</option>
                        <option value="Loneliness">Loneliness</option>
                        <option value="Depression">Depression</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Est. Read Time</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 4 min read"
                        value={articleReadTime}
                        onChange={e => setArticleReadTime(e.target.value)}
                        required
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Author Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dr. Alex Kwabena, PhD"
                      value={articleAuthor}
                      onChange={e => setArticleAuthor(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brief Summary</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Summary/snippet displayed in the articles grid list..."
                      value={articleSummary}
                      onChange={e => setArticleSummary(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Full Article Details</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Detailed content for the article reader view..."
                      value={articleContent}
                      onChange={e => setArticleContent(e.target.value)}
                      required
                      style={{ width: '100%', minHeight: '150px' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                    Publish Counselor Article
                  </button>
                </form>
              ) : (
                <form onSubmit={onSubmitGoodwill}>
                  <div className="form-group">
                    <label className="form-label">Encouragement Text</label>
                    <textarea
                      className="form-textarea"
                      placeholder="e.g. Take a moment to relax. Your health is more important than exam anxiety..."
                      value={goodwillText}
                      onChange={e => setGoodwillText(e.target.value)}
                      required
                      style={{ width: '100%', minHeight: '100px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Author Display Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Counselor Alex"
                      value={goodwillAuthor}
                      onChange={e => setGoodwillAuthor(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Counselor Role / Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Assistant Wellness Coordinator"
                      value={goodwillRole}
                      onChange={e => setGoodwillRole(e.target.value)}
                      required
                      style={{ width: '100%' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                    Publish Goodwill Card
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
