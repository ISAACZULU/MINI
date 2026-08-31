import React, { useState } from 'react';
import { 
  IconlyShield, 
  IconlyAlert, 
  IconlyClock, 
  IconlyCalendar, 
  IconlyVideo, 
  IconlyCheckCircle 
} from './Iconly';
import { useApp } from '../context/AppContext';
import { RISK_CONFIG } from '../types';

export default function CounselorDashboard() {
  const { posts, appointments, setActiveReplyPost, setIsAppointmentModalOpen, setActiveTelehealthRoom } = useApp();

  const [triageFilter, setTriageFilter] = useState('ALL'); // 'ALL' | 'CRISIS' | 'HIGH' | 'MODERATE'

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

  return (
    <div className="counselor-dashboard-container">
      {/* Dashboard Top Header & Stats Cards */}
      <div className="counselor-header-card">
        <div className="counselor-header-title">
          <div>
            <h2 className="counselor-title-text">Counselor Center</h2>
            <p className="counselor-subtitle-text">Verified Counselor Portal</p>
          </div>
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

          <div className="metric-box metric-speed">
            <div className="metric-icon">
              <IconlyClock size={20} />
            </div>
            <div>
              <span className="metric-value">14m</span>
              <span className="metric-label">Avg Counselor Response</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Triage Queue & Appointments */}
      <div className="counselor-main-grid">
        {/* Left Column: Risk-Sorted Triage Queue */}
        <div className="triage-section">
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
        </div>

        {/* Right Column: Scheduled Telehealth Sessions */}
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
                <div key={appt.id} className="appointment-card">
                  <div className="appointment-header">
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
                  >
                    <IconlyVideo size={14} />
                    <span>Launch Live Telehealth Meeting</span>
                  </button>
                </div>
              ))
            ) : (
              <p style={{ fontStyle: 'italic', color: 'var(--text-subtle)', fontSize: '0.9rem' }}>No upcoming appointment sessions booked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
