import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Video, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';
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
    if (triageFilter === 'ALL') return true;
    return p.riskAnalysis?.riskLevel === triageFilter;
  });

  const crisisCount = posts.filter(p => p.riskAnalysis?.riskLevel === 'CRISIS').length;
  const highRiskCount = posts.filter(p => p.riskAnalysis?.riskLevel === 'HIGH').length;

  return (
    <div className="counselor-dashboard-container">
      {/* Dashboard Top Header & Stats Cards */}
      <div className="counselor-header-card">
        <div className="counselor-header-title">
          <div className="counselor-badge-icon">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="counselor-title-text">Counselor Enterprise Command Center</h2>
            <p className="counselor-subtitle-text">Verified Mental Health Practitioner Portal • Real-Time AI Risk Triage Engine</p>
          </div>
        </div>

        {/* Key Metrics grid */}
        <div className="counselor-metrics-grid">
          <div className="metric-box metric-crisis">
            <div className="metric-icon">
              <AlertTriangle size={20} />
            </div>
            <div>
              <span className="metric-value">{crisisCount}</span>
              <span className="metric-label">Immediate Crisis Signals</span>
            </div>
          </div>

          <div className="metric-box metric-high">
            <div className="metric-icon">
              <AlertCircle size={20} />
            </div>
            <div>
              <span className="metric-value">{highRiskCount}</span>
              <span className="metric-label">High Distress Threads</span>
            </div>
          </div>

          <div className="metric-box metric-appointments">
            <div className="metric-icon">
              <Calendar size={20} />
            </div>
            <div>
              <span className="metric-value">{appointments.length}</span>
              <span className="metric-label">Booked Telehealth Sessions</span>
            </div>
          </div>

          <div className="metric-box metric-speed">
            <div className="metric-icon">
              <Clock size={20} />
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
            <div className="triage-filter-group">
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
                        <span className={`risk-badge ${riskMeta.badgeClass}`}>
                          {post.riskAnalysis?.isCrisis ? <AlertTriangle size={13} /> : <AlertCircle size={13} />}
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

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {hasCounselorReplied ? (
                          <span className="counselor-status-done">
                            <CheckCircle size={13} /> Counselor Responded
                          </span>
                        ) : (
                          <span className="counselor-status-pending">
                            Pending Outreach
                          </span>
                        )}

                        <button 
                          className="btn-primary" 
                          style={{ width: 'auto', padding: '6px 14px', fontSize: '0.85rem' }}
                          onClick={() => setActiveReplyPost(post)}
                        >
                          Respond as Counselor
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <CheckCircle size={36} color="#10b981" style={{ marginBottom: '8px' }} />
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
                    <span className="appt-mode-badge">
                      <Video size={13} />
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
                    onClick={() => setActiveTelehealthRoom(appt)}
                    className="launch-telehealth-btn"
                  >
                    <Video size={14} />
                    <span>Launch Live Telehealth Meeting</span>
                  </button>
                </div>
              ))
            ) : (
              <p style={{ fontStyle: 'italic', color: '#94a3b8', fontSize: '0.9rem' }}>No upcoming appointment sessions booked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
