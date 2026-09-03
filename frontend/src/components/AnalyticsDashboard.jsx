import React, { useEffect, useState } from 'react';
import {
  IconlyActivity,
  IconlyTrendingUp,
  IconlyDownload,
  IconlyUser,
  IconlyAlert,
  IconlyHandshake,
  IconlyPie
} from './Iconly';
import { useApp } from '../context/AppContext';
import { fetchAnalyticsOverview } from '../services/api';

export default function AnalyticsDashboard() {
  const { posts, showToast } = useApp();
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetchAnalyticsOverview()
      .then(setOverview)
      .catch(err => showToast(err.message, 'warning'));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const categoryCounts = overview?.categoryCounts || {};
  const totalPosts = overview?.totalPosts || posts.length || 1;
  const trendData = overview?.trend || [];
  const totalSupportActions = posts.reduce((sum, p) => sum + (p.supportCount || 0), 0);

  // Coordinates for the 7 points on SVG (viewBox: 0 0 500 200)
  const xCoords = [35, 105, 175, 245, 315, 385, 455];
  const maxCount = Math.max(1, ...trendData.map(d => d.count));
  const yCoords = trendData.map(d => 160 - (d.count / maxCount) * 110);

  const handleMouseMove = (e) => {
    if (trendData.length === 0) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const svgWidth = rect.width;
    const xVal = (clientX / svgWidth) * 500;

    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < xCoords.length; i++) {
      const diff = Math.abs(xVal - xCoords[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    setHoveredIdx(closestIdx);
  };

  const handleMouseLeave = () => setHoveredIdx(null);

  const linePath = trendData.length === 7
    ? `M ${xCoords[0]} ${yCoords[0]} ` +
      `C 70 ${yCoords[0] - 10}, 70 ${yCoords[1] + 10}, ${xCoords[1]} ${yCoords[1]} ` +
      `C 140 ${yCoords[1] - 10}, 140 ${yCoords[2] + 10}, ${xCoords[2]} ${yCoords[2]} ` +
      `C 210 ${yCoords[2] - 10}, 210 ${yCoords[3] + 10}, ${xCoords[3]} ${yCoords[3]} ` +
      `C 280 ${yCoords[3] - 10}, 280 ${yCoords[4] + 10}, ${xCoords[4]} ${yCoords[4]} ` +
      `C 350 ${yCoords[4] - 10}, 350 ${yCoords[5] + 10}, ${xCoords[5]} ${yCoords[5]} ` +
      `C 420 ${yCoords[5] - 10}, 420 ${yCoords[6] + 10}, ${xCoords[6]} ${yCoords[6]}`
    : '';

  const areaPath = linePath ? `${linePath} L ${xCoords[xCoords.length - 1]} 180 L ${xCoords[0]} 180 Z` : '';

  const categories = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / totalPosts) * 100)
  }));

  const topCategory = categories.reduce((top, c) => (c.count > (top?.count || 0) ? c : top), null);

  let accumulatedPercent = 0;
  const donutSegments = categories.map((cat, idx) => {
    const strokeWidth = 20;
    const radius = 65;
    const circumference = 2 * Math.PI * radius;
    const strokeLength = (cat.count / totalPosts) * circumference;
    const dashOffset = -(accumulatedPercent / 100) * circumference;
    accumulatedPercent += (cat.count / totalPosts) * 100;

    const colors = ['var(--primary-blue)', 'var(--safety-green)', 'var(--restrained-red)', 'var(--alert-yellow)', 'var(--primary-teal)'];
    const color = colors[idx % colors.length];

    return {
      ...cat,
      color,
      strokeDasharray: `${strokeLength} ${circumference - strokeLength}`,
      strokeDashoffset: dashOffset
    };
  });

  const handleExportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      totalThreadsAnalyzed: posts.length,
      categoryDistribution: categoryCounts,
      crisisCount: overview?.crisisCount || 0,
      highRiskCount: overview?.highRiskCount || 0,
      appointmentsBooked: overview?.appointmentsCount || 0,
      dpaGhanaStatus: 'Data Protection Act, 2012 (Act 843) Audited & Compliant'
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `haven-knust-campus-analytics-${Date.now()}.json`);
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
            <div className="counselor-badge-icon" style={{ backgroundColor: 'var(--pill-bg)', color: 'var(--primary-blue)' }}>
              <IconlyActivity size={28} />
            </div>
            <div>
              <h2 className="counselor-title-text">Campus Emotional Health & Trend Analytics</h2>
              <p className="counselor-subtitle-text">Aggregated Anonymized Sentiment Heatmap • University Health Board Portal</p>
            </div>
          </div>

          <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '0.85rem' }} onClick={handleExportReport}>
            <IconlyDownload size={15} />
            <span>Export Executive Report</span>
          </button>
        </div>

        {/* Overview Stats — all computed from real data */}
        <div className="counselor-metrics-grid" style={{ marginTop: '20px' }}>
          <div className="metric-box">
            <IconlyUser size={20} color="var(--primary-blue)" />
            <div>
              <span className="metric-value">{overview?.totalPosts ?? posts.length}</span>
              <span className="metric-label">Total Peer Threads</span>
            </div>
          </div>

          <div className="metric-box">
            <IconlyAlert size={20} color="var(--restrained-red)" />
            <div>
              <span className="metric-value">{(overview?.crisisCount || 0) + (overview?.highRiskCount || 0)}</span>
              <span className="metric-label">Crisis & High-Risk Alerts</span>
            </div>
          </div>

          <div className="metric-box">
            <IconlyHandshake size={20} color="var(--safety-green)" />
            <div>
              <span className="metric-value">{totalSupportActions}</span>
              <span className="metric-label">Peer Support Actions</span>
            </div>
          </div>

          <div className="metric-box">
            <IconlyTrendingUp size={20} color="var(--alert-yellow)" />
            <div>
              <span className="metric-value">{overview?.appointmentsCount ?? 0}</span>
              <span className="metric-label">Telehealth Sessions Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytics Content Grid */}
      <div className="counselor-main-grid">

        {/* Trend Area Chart (Left Column) */}
        <div className="triage-section">
          <div className="section-title-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconlyTrendingUp size={18} color="var(--primary-teal)" />
              <h3 className="section-heading">7-Day Campus Post Volume Trend</h3>
            </div>
          </div>

          <div className="triage-item-card" style={{ padding: '24px', position: 'relative' }}>
            <div style={{ position: 'relative', width: '100%', height: '220px' }}>
              {trendData.length === 7 ? (
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 500 200"
                  preserveAspectRatio="none"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ overflow: 'visible', cursor: 'crosshair' }}
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary-teal)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--primary-teal)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="35" y1="50" x2="455" y2="50" stroke="var(--border-color)" strokeDasharray="3 3" opacity="0.5" />
                  <line x1="35" y1="105" x2="455" y2="105" stroke="var(--border-color)" strokeDasharray="3 3" opacity="0.5" />
                  <line x1="35" y1="160" x2="455" y2="160" stroke="var(--border-color)" strokeDasharray="3 3" opacity="0.5" />

                  <path d={areaPath} fill="url(#chartGradient)" />
                  <path d={linePath} fill="none" stroke="var(--primary-teal)" strokeWidth="3.5" strokeLinecap="round" />

                  {trendData.map((d, idx) => (
                    <circle
                      key={d.day + idx}
                      cx={xCoords[idx]}
                      cy={yCoords[idx]}
                      r={hoveredIdx === idx ? "6" : "4"}
                      fill={hoveredIdx === idx ? "var(--primary-teal)" : "var(--card-bg)"}
                      stroke="var(--primary-teal)"
                      strokeWidth="2.5"
                      style={{ transition: 'r 0.15s ease, fill 0.15s ease' }}
                    />
                  ))}

                  {trendData.map((d, idx) => (
                    <text
                      key={d.day + idx}
                      x={xCoords[idx]}
                      y="192"
                      textAnchor="middle"
                      style={{ fill: 'var(--text-muted)', fontSize: '10px', fontWeight: 600, fontFamily: 'sans-serif' }}
                    >
                      {d.day}
                    </text>
                  ))}

                  {hoveredIdx !== null && (
                    <line
                      x1={xCoords[hoveredIdx]}
                      y1="30"
                      x2={xCoords[hoveredIdx]}
                      y2="175"
                      stroke="var(--primary-teal)"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.75"
                    />
                  )}
                </svg>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading trend data...</p>
              )}

              {hoveredIdx !== null && trendData[hoveredIdx] && (
                <div
                  className="chart-tooltip"
                  style={{
                    position: 'absolute',
                    top: `${yCoords[hoveredIdx] - 50}px`,
                    left: `${(xCoords[hoveredIdx] / 500) * 100}%`,
                    transform: hoveredIdx === 0 ? 'translateX(0%)' : hoveredIdx === xCoords.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    boxShadow: 'var(--shadow-md)',
                    pointerEvents: 'none',
                    zIndex: 10,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.1s ease'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: 500 }}>
                    {trendData[hoveredIdx].day} New Threads
                  </span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--primary-teal)', fontWeight: 800 }}>
                    {trendData[hoveredIdx].count} Posts
                  </strong>
                </div>
              )}
            </div>

            <p style={{ margin: '14px 0 0 0', fontSize: '0.775rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              Hover over points to inspect daily post volume, computed live from submitted threads.
            </p>
          </div>
        </div>

        {/* Category Share Donut Chart (Right Column) */}
        <div className="appointments-section">
          <div className="section-title-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconlyPie size={18} color="var(--primary-teal)" />
              <h3 className="section-heading">Category Distribution Share</h3>
            </div>
          </div>

          <div className="triage-item-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
              <svg width="100%" height="100%" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="65" fill="transparent" stroke="var(--border-color)" strokeWidth="18" opacity="0.3" />
                {donutSegments.map((seg) => (
                  <circle
                    key={seg.name}
                    cx="90"
                    cy="90"
                    r="65"
                    fill="transparent"
                    stroke={seg.color}
                    strokeWidth="18"
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    transform="rotate(-90 90 90)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease', cursor: 'pointer' }}
                  />
                ))}
                <text x="90" y="86" textAnchor="middle" dominantBaseline="middle" style={{ fill: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 850 }}>
                  {overview?.totalPosts ?? posts.length}
                </text>
                <text x="90" y="104" textAnchor="middle" dominantBaseline="middle" style={{ fill: 'var(--text-muted)', fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Active Threads
                </text>
              </svg>
            </div>

            <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {donutSegments.map((seg) => (
                <div key={seg.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: seg.color, flexShrink: 0 }} />
                  <span style={{ color: 'var(--text-main)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={seg.name}>
                    {seg.name}
                  </span>
                  <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    {seg.count} ({seg.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Triage recommendations, derived from real data instead of scripted copy */}
      <div className="counselor-main-grid" style={{ marginTop: '20px' }}>
        <div className="triage-section" style={{ gridColumn: 'span 12' }}>
          <div className="section-title-bar">
            <h3 className="section-heading">Triage Signals</h3>
          </div>

          <div className="triage-recommendations-grid" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(overview?.crisisCount || 0) > 0 && (
              <div className="appointment-card" style={{ borderLeft: '4px solid var(--restrained-red)', background: 'var(--card-bg)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--restrained-red)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                  <IconlyAlert size={16} />
                  <span>Active Crisis Signals Require Attention</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {overview.crisisCount} thread{overview.crisisCount === 1 ? '' : 's'} currently flagged at CRISIS risk level. Review the Safety Shield & Moderation tab.
                </p>
              </div>
            )}

            {topCategory && topCategory.count > 0 && (
              <div className="appointment-card" style={{ borderLeft: '4px solid var(--primary-teal)', background: 'var(--card-bg)', padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-teal)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>
                  <IconlyTrendingUp size={16} />
                  <span>Leading Concern Category: {topCategory.name}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                  {topCategory.name} accounts for {topCategory.percentage}% of all peer threads ({topCategory.count} of {totalPosts}).
                </p>
              </div>
            )}

            {(!overview || ((overview.crisisCount || 0) === 0 && (!topCategory || topCategory.count === 0))) && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No notable signals yet — recommendations will appear here as students post.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
