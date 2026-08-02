import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Users, 
  AlertTriangle, 
  Activity,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AnalyticsDashboard() {
  const { posts, showToast } = useApp();

  // Compute live category counts from active posts feed
  const categoryCounts = {
    'Anxiety': posts.filter(p => p.tag === 'Anxiety').length,
    'Burnout': posts.filter(p => p.tag === 'Burnout').length,
    'Academic pressure': posts.filter(p => p.tag === 'Academic pressure').length,
    'Sleep': posts.filter(p => p.tag === 'Sleep').length,
    'Loneliness': posts.filter(p => p.tag === 'Loneliness').length
  };

  const totalPosts = posts.length || 1;

  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      totalThreadsAnalyzed: posts.length,
      categoryDistribution: categoryCounts,
      averageResponseTime: '14 mins',
      ferpaStatus: 'Audited & Compliant'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mindspace-campus-analytics-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Exported Campus Wellness Analytics Report (JSON)', 'success');
  };

  return (
    <div className="counselor-dashboard-container">
      {/* Analytics Top Header */}
      <div className="counselor-header-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div className="counselor-header-title" style={{ margin: 0 }}>
            <div className="counselor-badge-icon" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <BarChart3 size={28} />
            </div>
            <div>
              <h2 className="counselor-title-text">Campus Emotional Health & Trend Analytics</h2>
              <p className="counselor-subtitle-text">Aggregated Anonymized Sentiment Heatmap • University Health Board Portal</p>
            </div>
          </div>

          <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.85rem' }} onClick={handleExportReport}>
            <Download size={15} /> Export Executive Report
          </button>
        </div>

        {/* Overview Stats */}
        <div className="counselor-metrics-grid" style={{ marginTop: '20px' }}>
          <div className="metric-box">
            <Users size={20} color="#0284c7" />
            <div>
              <span className="metric-value">1,420+</span>
              <span className="metric-label">Active Student Sessions</span>
            </div>
          </div>

          <div className="metric-box">
            <Activity size={20} color="#10b981" />
            <div>
              <span className="metric-value">94.2%</span>
              <span className="metric-label">Positive Intervention Rate</span>
            </div>
          </div>

          <div className="metric-box">
            <HeartHandshake size={20} color="#f43f5e" />
            <div>
              <span className="metric-value">380+</span>
              <span className="metric-label">Peer Support Actions</span>
            </div>
          </div>

          <div className="metric-box">
            <TrendingUp size={20} color="#d97706" />
            <div>
              <span className="metric-value">+18%</span>
              <span className="metric-label">Midterm Week Spike</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Content */}
      <div className="counselor-main-grid">
        {/* Left Column: Category Sentiment Heatmap */}
        <div className="triage-section">
          <div className="section-title-bar">
            <h3 className="section-heading">Distress Category Heatmap Distribution</h3>
          </div>

          <div className="triage-item-card" style={{ padding: '20px' }}>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalPosts) * 100);
              return (
                <div key={cat} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-main)' }}>{cat}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} threads ({pct}%)</span>
                  </div>
                  <div className="analytics-progress-track">
                    <div className="analytics-progress-bar" style={{ width: `${Math.max(pct, 8)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Key Administrative Recommendations */}
        <div className="appointments-section">
          <div className="section-title-bar">
            <h3 className="section-heading">AI Administrative Insights</h3>
          </div>

          <div className="appointments-list">
            <div className="appointment-card" style={{ borderLeft: '4px solid #e11d48' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e11d48', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                <AlertTriangle size={16} />
                <span>Exam Panic Pre-emptive Outreach</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Anxiety threads spiked 28% in STEM departments prior to midterms. Deploying additional 4-7-8 breathing workshops in Science Hall.
              </p>
            </div>

            <div className="appointment-card" style={{ borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                <TrendingUp size={16} />
                <span>Peer Support Engagement Surge</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                Anonymous encouragement responses increased by 42% this week, showing high community resilience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
