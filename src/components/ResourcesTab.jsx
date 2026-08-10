import React, { useState } from 'react';
import { BookOpen, Search, Bookmark, CheckCircle, Sparkles, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const GUIDES_DATA = [
  {
    id: 'g-1',
    category: 'Anxiety',
    title: 'Exam Anxiety Survival Guide',
    readTime: '4 min read',
    description: 'Evidence-based cognitive grounding protocols for managing panic, racing heart, and mental blocks right before tests.',
    steps: [
      'Perform 3 cycles of 4-7-8 box breathing before flipping your exam sheet.',
      'Reframe panic symptoms: racing heart is your body preparing energy, not failing.',
      'Sip room-temperature water and drop shoulders away from your ears.'
    ]
  },
  {
    id: 'g-2',
    category: 'Burnout',
    title: 'Burnout Recovery & Energy Management',
    readTime: '5 min read',
    description: 'A structured blueprint to transition out of emotional numbness and restore mental clarity.',
    steps: [
      'Implement strict digital curfews 1 hour before sleep.',
      'Schedule non-negotiable 30-minute restorative breaks without screen exposure.',
      'Separate self-worth from academic productivity metrics.'
    ]
  },
  {
    id: 'g-3',
    category: 'Sleep',
    title: 'Sleep Hygiene & Insomnia Recovery Protocol',
    readTime: '3 min read',
    description: 'Proven circadian rhythm reset strategies for students dealing with late-night deadline stress.',
    steps: [
      'Stop caffeine intake at least 6 hours before bedtime.',
      'Use progressive muscle relaxation starting from toes to jaw.',
      'If awake in bed for >20 mins, get up and read a book under warm light.'
    ]
  },
  {
    id: 'g-4',
    category: 'Academic pressure',
    title: 'Overcoming Impostor Syndrome in College',
    readTime: '4 min read',
    description: 'Deconstruct feelings of inadequacy and build resilience against toxic perfectionism.',
    steps: [
      'Keep a "Wins Log" documenting past challenges you successfully conquered.',
      'Acknowledge that asking for help is a demonstration of strength, not weakness.',
      'Connect with peer support groups or campus mentors.'
    ]
  }
];

export default function ResourcesTab() {
  const { showToast } = useApp();
  const [selectedGuide, setSelectedGuide] = useState(GUIDES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarked, setBookmarked] = useState(['g-1']);
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(b => b !== id));
      showToast('Guide removed from bookmarks', 'info');
    } else {
      setBookmarked([...bookmarked, id]);
      showToast('Guide saved to your bookmarks!', 'success');
    }
  };

  const toggleStepCompleted = (guideId, stepIdx) => {
    const key = `${guideId}-${stepIdx}`;
    setCompletedSteps(prev => {
      const isNowCompleted = !prev[key];
      const next = { ...prev, [key]: isNowCompleted };
      
      const guide = GUIDES_DATA.find(g => g.id === guideId);
      if (guide) {
        const allDone = guide.steps.every((_, idx) => !!next[`${guideId}-${idx}`]);
        if (allDone && isNowCompleted) {
          showToast('Outstanding work! You have completed all recovery steps for this wellness guide. Keep up the great progress!', 'success');
        } else if (isNowCompleted) {
          showToast('Step completed! Keep taking positive steps!', 'success');
        }
      }
      return next;
    });
  };

  const filteredGuides = GUIDES_DATA.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="resources-tab-view animate-fade-in">
      {/* Left Column: List of Guides & Search */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div className="form-group" style={{ margin: 0 }}>
          <div style={{ position: 'relative' }}>
            <span className="animate-icon-search" style={{ position: 'absolute', left: '12px', top: '12.5px', display: 'flex', alignItems: 'center' }}>
              <Search size={16} color="var(--text-subtle)" />
            </span>
            <input 
              type="text" 
              className="form-input" 
              style={{ paddingLeft: '36px', fontSize: '0.875rem' }} 
              placeholder="Search guides (e.g. anxiety, sleep)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="resource-guides-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredGuides.map(guide => {
            const isSelected = selectedGuide?.id === guide.id;
            const isSaved = bookmarked.includes(guide.id);
            return (
              <div 
                key={guide.id} 
                className={`resource-guide-card ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedGuide(guide)}
                style={{
                  background: isSelected ? 'rgba(2, 132, 199, 0.06)' : 'var(--card-bg)',
                  border: isSelected ? '1px solid #0284c7' : '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.05)' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="category-badge" style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>
                    {guide.category}
                  </span>
                  <button 
                    onClick={(e) => toggleBookmark(guide.id, e)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    title="Save guide"
                  >
                    <span className="animate-icon-star">
                      <Bookmark size={15} fill={isSaved ? '#0284c7' : 'none'} color={isSaved ? '#0284c7' : 'var(--text-subtle)'} />
                    </span>
                  </button>
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--text-main)' }}>{guide.title}</h4>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{guide.readTime}</span>
                </div>
              </div>
            );
          })}
          {filteredGuides.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No guides match your search.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Guide Details Panel */}
      {selectedGuide ? (
        <div 
          className="guide-detail-view"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="category-badge" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7' }}>{selectedGuide.category}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedGuide.readTime}</span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px', marginTop: 0 }}>
            {selectedGuide.title}
          </h3>

          <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px', marginTop: 0 }}>
            {selectedGuide.description}
          </p>

          {(() => {
            const totalSteps = selectedGuide.steps.length;
            const completedCount = selectedGuide.steps.filter((_, idx) => !!completedSteps[`${selectedGuide.id}-${idx}`]).length;
            const progressPercent = Math.round((completedCount / totalSteps) * 100);
            
            return (
              <div className="progress-bar-container" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                  <span>Wellness Guide Progress</span>
                  <span>{completedCount} of {totalSteps} steps ({progressPercent}%)</span>
                </div>
                <div style={{ background: 'var(--border-color)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--safety-green)', width: `${progressPercent}%`, height: '100%', borderRadius: '3px', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            );
          })()}

          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--safety-green)" />
            <span>Actionable Steps to Apply</span>
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedGuide.steps.map((step, idx) => {
              const isCompleted = !!completedSteps[`${selectedGuide.id}-${idx}`];
              return (
                <div 
                  key={idx} 
                  className={`guide-step-box ${isCompleted ? 'completed' : ''}`}
                  onClick={() => toggleStepCompleted(selectedGuide.id, idx)}
                  style={{
                    background: isCompleted ? 'var(--safety-green-light)' : 'var(--input-bg)',
                    border: isCompleted ? '1px solid var(--safety-green)' : '1px solid var(--border)',
                    padding: '14px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <CheckCircle 
                    size={18} 
                    fill={isCompleted ? 'var(--safety-green)' : 'none'} 
                    color={isCompleted ? '#ffffff' : 'var(--text-subtle)'} 
                    style={{ flexShrink: 0, marginTop: '2px' }} 
                  />
                  <span style={{ 
                    fontSize: '0.875rem', 
                    color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)', 
                    lineHeight: 1.5,
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Select a guide from the list to view its steps.
        </div>
      )}
    </div>
  );
}
